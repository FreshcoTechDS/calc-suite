import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Mortgage', icon: '🏠' },
  { to: '/credit-card', label: 'Credit Card', icon: '💳' },
  { to: '/compound', label: 'Compound Interest', icon: '📈' },
];

export default function Nav() {
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
    </nav>
  );
}
