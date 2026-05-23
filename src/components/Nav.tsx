import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const links = [
  { to: '/', label: 'Mortgage', icon: '🏠' },
  { to: '/auto-loan', label: 'Auto Loan', icon: '🚗' },
  { to: '/credit-card', label: 'Credit Card', icon: '💳' },
  { to: '/compound', label: 'Compound', icon: '📈' },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('calcsuite-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('calcsuite-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, () => setDark(!dark)] as const;
}

export default function Nav() {
  const [dark, toggleDark] = useDarkMode();

  return (
    <nav className="nav">
      <div className="nav-brand">🧮 CalcSuite</div>
      <div className="nav-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </div>
      <button
        className="theme-toggle"
        onClick={toggleDark}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle dark mode"
      >
        {dark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
