import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/game', label: 'Game' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/profile', label: 'Profile' },
];

export default function AppLayout({ children }) {
  return (
    <main className="min-h-screen bg-background text-neutral">
      <header className="border-b border-cream/10 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link className="text-sm font-semibold uppercase tracking-[0.35em] text-cream" to="/">
            KanaQuest
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral/80">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-1.5 transition-colors',
                    isActive ? 'bg-accent text-white' : 'hover:bg-cream/10 hover:text-neutral',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </main>
  );
}
