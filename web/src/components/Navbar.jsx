import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">MarketHub</Link>
      </div>
      {user && (
        <div className="nav-links">
          <Link to="/">Products</Link>
          <Link to="/favorites">Favorites</Link>
          <span className="user-greeting">Hi, {user.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
