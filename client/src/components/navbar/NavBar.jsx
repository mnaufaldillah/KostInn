import { Link, NavLink, useNavigate } from 'react-router-dom';

// ponytail: token presence in localStorage = auth source of truth.
// Swap for a Redux selector if/when auth state needs to be reactive across components.
const useIsLoggedIn = () => !!localStorage.getItem('access_token');

function NavBar() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg ki-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">KostInn</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {isLoggedIn ? (
            // NavBar2 — authenticated
            <ul className="ki-nav-actions">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profiles">Profile</NavLink>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            // NavBar1 — guest
            <ul className="ki-nav-actions">
              <li className="nav-item">
                <Link className="btn btn-outline-dark" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-dark" to="/register">Register</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
