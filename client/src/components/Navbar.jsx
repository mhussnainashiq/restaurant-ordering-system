import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { restaurantInfo } from '../data/restaurantData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">🍽</span>
          <span className="logo-text">{restaurantInfo.name}</span>
        </Link>

        <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/menu" onClick={closeMenu}>
            Menu
          </NavLink>
          <NavLink to="/orders" onClick={closeMenu}>
            My Orders
          </NavLink>

          {isAuthenticated ? (
            <NavLink to="/account" onClick={closeMenu}>
              Account
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/signup" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn" onClick={closeMenu}>
            <ShoppingCart size={22} />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {isAuthenticated && (
            <Link to="/account" className="user-btn" onClick={closeMenu} title={user?.name}>
              <User size={22} />
            </Link>
          )}

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;