import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-calendar-event me-2 text-primary"></i>
          <span className="fw-bold text-dark">Event Manager</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">Home</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/create-event">Create Event</Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <div className="d-flex align-items-center me-3">
                  <div className="bg-primary text-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{width: '30px', height: '30px'}}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-dark fw-medium">{user.username}</span>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link text-dark me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-primary" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;