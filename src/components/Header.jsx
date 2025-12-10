// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">My Digital Shelf</Link>
      </div>
      <nav className="nav-menu">
        <Link to="/mylab">내 서재</Link>
        <Link to="/login" className="login-btn">LOGIN</Link>
      </nav>
    </header>
  );
}
export default Header;