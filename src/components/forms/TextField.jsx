import { useState } from 'react';

export default function TextField({ type, className = '', ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  if (isPasswordType) {
    return (
      <div className="relative flex w-full items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          className={[
            'w-full min-h-[44px] rounded-2xl border border-[rgba(128,43,56,0.18)] bg-white pl-4 pr-11 py-3 text-sm sm:text-base text-[rgb(var(--color-neutral))] outline-none transition-colors placeholder:text-[rgb(var(--color-neutral))]/40 focus:border-accent focus:ring-2 focus:ring-[rgba(128,43,56,0.12)]',
            className,
          ].join(' ')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-xl text-[rgb(var(--color-accent))]/70 hover:text-[rgb(var(--color-accent))] hover:bg-[#fbefe8] focus:outline-none transition-colors"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <input
      type={type}
      className={[
        'w-full min-h-[44px] rounded-2xl border border-[rgba(128,43,56,0.18)] bg-white px-4 py-3 text-sm sm:text-base text-[rgb(var(--color-neutral))] outline-none transition-colors placeholder:text-[rgb(var(--color-neutral))]/40 focus:border-accent focus:ring-2 focus:ring-[rgba(128,43,56,0.12)]',
        className,
      ].join(' ')}
      {...props}
    />
  );
}

