import LoginForm from '../../components/auth/LoginForm';
import toriiLogo from '../../img/torii.svg';

export default function LoginPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <LoginForm />
      <section className="flex min-h-[280px] items-center justify-center rounded-[1.75rem] border border-[#eaded6] bg-[#fbefe8] p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <div className="flex flex-col items-center gap-4">
          <img
            src={toriiLogo}
            alt="KanaQuest"
            className="w-[min(68vw,18.5rem)] max-w-full object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)' }}
          />
          <span className="text-[1.9rem] font-semibold leading-none tracking-tight text-[rgb(var(--color-accent))]">
            Kana Quest
          </span>
        </div>
      </section>
    </div>
  );
}
