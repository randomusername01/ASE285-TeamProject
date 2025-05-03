import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-title"> Inventory Manager</div>
      <div className="navbar-links">
        <Link to="/dashboard" className={location.pathname ==='/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>My Inventory</Link>
      </div>
    </nav>
  );
}

export default Navbar;
