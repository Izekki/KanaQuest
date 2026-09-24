import LoginForm from '../../components/auth/LoginForm';
import toriiLogo from '../../img/torii.svg';

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-4xl grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
      <LoginForm />
      <section className="hidden lg:flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-[#eaded6] bg-gradient-to-b from-[#fdf7f4] via-[#fbf0ec] to-[#f6e4dc] p-8 sm:p-10 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <div className="flex flex-col items-center gap-5 text-center my-auto">
          <div className="relative flex items-center justify-center">
            <img
              src={toriiLogo}
              alt="Torii KanaQuest"
              className="w-48 lg:w-56 xl:w-64 h-auto max-h-56 object-contain drop-shadow-[0_12px_24px_rgba(107,40,50,0.15)] transition-transform hover:scale-105 duration-300 select-none"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)',
              }}
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[1.85rem] font-bold leading-none tracking-tight text-[#6b2832] block">
              KanaQuest
            </span>
            <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-[rgb(var(--color-neutral))]/70">
              Aprende japonés a tu propio ritmo con práctica interactiva de Hiragana, Katakana y Kanji.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
