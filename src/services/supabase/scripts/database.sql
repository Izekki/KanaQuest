-- =========================================
-- ENABLE EXTENSIONS
-- =========================================

create extension if not exists "uuid-ossp";


-- =========================================
-- USERS PROFILE TABLE
-- =========================================

create table public.profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    username text unique not null,
    avatar_url text,
    level integer default 1,
    experience integer default 0,
    games_played integer default 0,
    correct_answers integer default 0,
    wrong_answers integer default 0,
    created_at timestamp with time zone default now()
);


-- =========================================
-- WORD TYPES TABLE
-- =========================================

create table public.word_types (
    id uuid primary key default uuid_generate_v4(),
    name text unique not null
);


-- =========================================
-- WORDS TABLE
-- =========================================

create table public.words (
    id uuid primary key default uuid_generate_v4(),

    japanese text not null,
    hiragana text,
    katakana text,
    romaji text,
    translation text not null,

    level integer not null default 1 check (level > 0),
    experience_reward integer not null default 10 check (experience_reward > 0),

    type_id uuid references public.word_types(id),

    difficulty text check (
        difficulty in ('beginner', 'intermediate', 'advanced')
    ),

    image_url text,
    audio_url text,

    created_at timestamp with time zone default now()
);


-- =========================================
-- USER PROGRESS TABLE
-- =========================================

create table public.progress (
    id uuid primary key default uuid_generate_v4(),

    user_id uuid references auth.users(id) on delete cascade,
    word_id uuid references public.words(id) on delete cascade,
    mode text not null default 'recognize' check (
        mode in ('recognize', 'translate', 'sentence_builder', 'pair_match')
    ),

    status text not null default 'new' check (
        status in ('new', 'learning', 'correct', 'incorrect', 'review', 'mastered')
    ),
    correct boolean default false,
    attempts integer default 0,
    mastery_level integer default 0,

    last_attempt timestamp with time zone default now()
);

alter table public.progress
add constraint progress_user_word_mode_key unique (user_id, word_id, mode);


-- =========================================
-- WORD EXPERIENCE AWARDS TABLE
-- =========================================

create table public.word_experience_awards (
    id uuid primary key default uuid_generate_v4(),

    user_id uuid references auth.users(id) on delete cascade,
    word_id uuid references public.words(id) on delete cascade,

    awarded_at timestamp with time zone default now(),

    constraint word_experience_awards_user_word_key unique (user_id, word_id)
);


-- =========================================
-- LEVEL HELPERS
-- =========================================

create or replace function public.calculate_profile_level(p_experience integer)
returns integer
language sql
immutable
as $$
    select greatest(1, floor(coalesce(p_experience, 0) / 100.0)::integer + 1);
$$;


create or replace function public.apply_word_experience_award()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    reward_points integer := 0;
begin
    select coalesce(experience_reward, 0)
    into reward_points
    from public.words
    where id = new.word_id;

    if reward_points <= 0 then
        return new;
    end if;

    update public.profiles
    set experience = coalesce(experience, 0) + reward_points,
        level = public.calculate_profile_level(coalesce(experience, 0) + reward_points)
    where user_id = new.user_id;

    return new;
end;
$$;


create trigger word_experience_awards_apply_experience
after insert on public.word_experience_awards
for each row
execute function public.apply_word_experience_award();


-- Function to prevent direct modification of profile statistics from client
create or replace function public.protect_profile_stats()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if (current_user in ('authenticated', 'anon') or (auth.role() in ('authenticated', 'anon') and session_user = 'authenticator')) then
        if (OLD.experience is distinct from NEW.experience) or
           (OLD.level is distinct from NEW.level) or
           (OLD.correct_answers is distinct from NEW.correct_answers) or
           (OLD.wrong_answers is distinct from NEW.wrong_answers) or
           (OLD.games_played is distinct from NEW.games_played) then
            raise exception 'Direct client modification of statistics (experience, level, correct_answers, wrong_answers, games_played) is forbidden. Use official RPC functions.';
        end if;
    end if;
    return new;
end;
$$;

create trigger trg_protect_profile_stats
before update on public.profiles
for each row
execute function public.protect_profile_stats();


-- Centralized Transactional RPC for Word Submissions
create or replace function public.handle_word_submission(
    p_word_id uuid,
    p_mode text,
    p_is_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_user_id uuid;
    v_reward_points integer := 0;
    v_xp_awarded integer := 0;
    v_award_id uuid := null;
    v_current_mastery integer := 0;
    v_new_total_xp integer := 0;
    v_new_level integer := 1;
    v_valid_word boolean := false;
begin
    -- 1. Authenticate user
    v_user_id := auth.uid();
    if v_user_id is null then
        raise exception 'Not authenticated';
    end if;

    -- 2. Validate word
    select true, coalesce(experience_reward, 10)
    into v_valid_word, v_reward_points
    from public.words
    where id = p_word_id;

    if not coalesce(v_valid_word, false) then
        raise exception 'Word with id % does not exist', p_word_id;
    end if;

    -- 3. Validate mode
    if p_mode not in ('recognize', 'translate', 'sentence_builder', 'pair_match') then
        raise exception 'Invalid mode: %', p_mode;
    end if;

    -- 4. Atomic Upsert in public.progress
    insert into public.progress (
        user_id,
        word_id,
        mode,
        correct,
        attempts,
        mastery_level,
        last_attempt
    )
    values (
        v_user_id,
        p_word_id,
        p_mode,
        p_is_correct,
        1,
        case when p_is_correct then 1 else 0 end,
        now()
    )
    on conflict (user_id, word_id, mode)
    do update set
        attempts = public.progress.attempts + 1,
        correct = (public.progress.correct or EXCLUDED.correct),
        mastery_level = case 
            when EXCLUDED.correct then least(5, public.progress.mastery_level + 1)
            else public.progress.mastery_level
        end,
        last_attempt = now()
    returning mastery_level into v_current_mastery;

    -- 5. Handle XP and word_experience_awards
    if p_is_correct then
        insert into public.word_experience_awards (user_id, word_id, awarded_at)
        values (v_user_id, p_word_id, now())
        on conflict (user_id, word_id) do nothing
        returning id into v_award_id;

        if v_award_id is not null then
            v_xp_awarded := v_reward_points;
        else
            v_xp_awarded := 0;
        end if;

        update public.profiles
        set correct_answers = coalesce(correct_answers, 0) + 1
        where user_id = v_user_id
        returning experience, level into v_new_total_xp, v_new_level;
    else
        v_xp_awarded := 0;

        update public.profiles
        set wrong_answers = coalesce(wrong_answers, 0) + 1
        where user_id = v_user_id
        returning experience, level into v_new_total_xp, v_new_level;
    end if;

    if v_new_total_xp is null then
        select coalesce(experience, 0), coalesce(level, 1)
        into v_new_total_xp, v_new_level
        from public.profiles
        where user_id = v_user_id;
    end if;

    -- 6. Return response payload
    return jsonb_build_object(
        'is_correct', p_is_correct,
        'xp_awarded', v_xp_awarded,
        'new_total_xp', coalesce(v_new_total_xp, 0),
        'new_level', coalesce(v_new_level, 1),
        'current_mastery', coalesce(v_current_mastery, 0)
    );
end;
$$;

grant execute on function public.handle_word_submission(uuid, text, boolean) to authenticated;
grant execute on function public.handle_word_submission(uuid, text, boolean) to service_role;


-- =========================================
-- GAME SESSIONS TABLE
-- =========================================

create table public.game_sessions (
    id uuid primary key default uuid_generate_v4(),

    user_id uuid references auth.users(id) on delete cascade,

    mode text check (
        mode in ('recognize', 'translate', 'sentence_builder', 'pair_match')
    ),

    difficulty text check (
        difficulty in ('beginner', 'intermediate', 'advanced')
    ),

    score integer default 0,
    correct_answers integer default 0,
    wrong_answers integer default 0,

    duration integer default 0,

    created_at timestamp with time zone default now()
);


-- =========================================
-- REVIEW QUEUE TABLE
-- =========================================

create table public.review_queue (
    id uuid primary key default uuid_generate_v4(),

    user_id uuid references auth.users(id) on delete cascade,
    word_id uuid references public.words(id) on delete cascade,

    priority integer default 1,

    created_at timestamp with time zone default now()
);


-- =========================================
-- INSERT DEFAULT WORD TYPES
-- =========================================

insert into public.word_types (name)
values
    ('object'),
    ('animal'),
    ('food'),
    ('kanji'),
    ('verb'),
    ('adjective'),
    ('place'),
    ('nature');


-- =========================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================

alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.progress enable row level security;
alter table public.game_sessions enable row level security;
alter table public.review_queue enable row level security;


-- =========================================
-- PUBLIC READ ACCESS FOR WORDS
-- =========================================

create policy "Public read words"
on public.words
for select
using (true);


-- =========================================
-- PUBLIC READ ACCESS FOR WORD TYPES
-- =========================================

create policy "Public read word types"
on public.word_types
for select
using (true);


-- =========================================
-- PROFILES POLICIES
-- =========================================

create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = user_id);

create policy "profiles_select_auth"
on public.profiles
for select
using (auth.role() = 'authenticated');

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- =========================================
-- PROGRESS POLICIES
-- =========================================

create policy "Users can view own progress"
on public.progress
for select
using (auth.uid() = user_id);

create policy "Users can insert own progress"
on public.progress
for insert
with check (auth.uid() = user_id);

create policy "Users can update own progress"
on public.progress
for update
using (auth.uid() = user_id);


-- =========================================
-- WORD EXPERIENCE AWARDS POLICIES
-- =========================================

create policy "Users can view own word experience awards"
on public.word_experience_awards
for select
to authenticated
using (auth.uid() = user_id);


-- =========================================
-- GAME SESSIONS POLICIES
-- =========================================

create policy "Users can view own sessions"
on public.game_sessions
for select
using (auth.uid() = user_id);

create policy "Users can insert own sessions"
on public.game_sessions
for insert
with check (auth.uid() = user_id);


-- =========================================
-- REVIEW QUEUE POLICIES
-- =========================================

create policy "Users can manage own review queue"
on public.review_queue
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);