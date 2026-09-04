import LoginForm from '../../components/auth/LoginForm';
import toriiLogo from '../../img/torii.svg';

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md lg:max-w-4xl grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
      <LoginForm />
      <section className="hidden lg:flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-[#eaded6] bg-[#fbefe8] p-8 sm:p-10 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <div className="flex flex-col items-center gap-5 text-center my-auto">
          <img
            src={toriiLogo}
            alt="KanaQuest"
            className="w-[min(68vw,14.5rem)] max-w-full object-contain transition-transform hover:scale-105 duration-300"
            style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)' }}
          />
          <div className="space-y-1.5">
            <span className="text-[1.85rem] font-semibold leading-none tracking-tight text-[rgb(var(--color-accent))] block">
              Kana Quest
            </span>
            <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-[rgb(var(--color-neutral))]/65">
              Aprende japonés a tu propio ritmo con práctica interactiva de Hiragana y Katakana.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


