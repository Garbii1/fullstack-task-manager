import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css'; // Create this CSS file

// Import your logo (make sure the path is correct)
// Place logo.png in the public folder for easiest access
const logoUrl = process.env.PUBLIC_URL + '/logo.png'; // Adjust filename if needed


function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
         {/* Logo and Brand Name */}
         <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-brand">
            <img src={logoUrl} alt="App Logo" className="navbar-logo" />
            <span>Task Manager</span>
          </Link>

        <div className="navbar-menu">
           {/* Theme Toggle Button */}
           <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
           </button>

          {isAuthenticated ? (
            <>
              <span className="navbar-user">Welcome, {user?.username || 'User'}!</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Login/Register only if not authenticated */}
               {!window.location.pathname.includes('/login') && (
                   <Link to="/login" className="btn btn-primary" style={{ marginRight: 'var(--spacing-sm)'}}>Login</Link>
               )}
               {!window.location.pathname.includes('/register') && (
                    <Link to="/register" className="btn btn-secondary">Register</Link>
               )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;