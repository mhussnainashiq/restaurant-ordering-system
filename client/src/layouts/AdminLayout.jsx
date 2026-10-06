import { Outlet, NavLink, Navigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const { user, isAdmin, logout, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  // Protect admin routes
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-icon">🍽</span>
          <div>
            <strong>SavorHub</strong>
            <small>Admin Panel</small>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/menu">
            <UtensilsCrossed size={18} /> Menu
          </NavLink>
          <NavLink to="/admin/orders">
            <ShoppingBag size={18} /> Orders
          </NavLink>
          <NavLink to="/admin/customers">
            <Users size={18} /> Customers
          </NavLink>
          <NavLink to="/admin/offers">
            <Tag size={18} /> Offers
          </NavLink>
          <NavLink to="/admin/settings">
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="back-store">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <button onClick={handleLogout} className="admin-logout">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <h2>Welcome, {user.name}</h2>
          <span className="admin-role">Admin</span>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;