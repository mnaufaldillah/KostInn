import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function SideBar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const items = [
    { to: '/dashboard/profil', label: 'Profil', icon: '👤', end: false },
    { to: '/dashboard/riwayat', label: 'Riwayat Kost', icon: '🏠' },
  ];

  if (role === 'Admin') {
    items.push({ to: '/dashboard/pengguna', label: 'Daftar Pengguna', icon: '👥' });
  }

  return (
    <aside className="ki-sidebar">
      <div className="ki-sidebar-brand">KostInn</div>
      <nav className="ki-sidebar-nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => `ki-sidebar-link${isActive ? ' is-active' : ''}`}
          >
            <span className="ki-sidebar-icon">{it.icon}</span>
            {it.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="ki-sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

SideBar.propTypes = {
  role: PropTypes.string,
};

SideBar.defaultProps = {
  role: 'Pencari Kost',
};

export default SideBar;
