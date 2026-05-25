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

    correct boolean default false,
    attempts integer default 0,
    mastery_level integer default 0,

    last_attempt timestamp with time zone default now()
);


-- =========================================
-- GAME SESSIONS TABLE
-- =========================================

create table public.game_sessions (
    id uuid primary key default uuid_generate_v4(),

    user_id uuid references auth.users(id) on delete cascade,

    mode text check (
        mode in ('recognize', 'translate')
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

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = user_id);


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