import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Save } from 'lucide-react';

function Account() {
  const {
    user,
    isAuthenticated,
    updateProfile,
    logout,
    loading,
    makeAdmin,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: form.name,
      phone: form.phone,
      address: form.address,
    });
    setMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="page-header">
          <h1>My Account</h1>
          <p>Manage your profile information</p>
        </div>

        <div className="account-layout">
          <div className="account-card">
            <div className="account-avatar">
              <User size={40} />
            </div>

            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} disabled />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Add your phone"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Add your address"
                />
              </div>

              <div className="account-actions">
                {isEditing ? (
                  <>
                    <button type="submit" className="btn btn-primary">
                      <Save size={16} /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="account-sidebar">
            <Link to="/orders" className="sidebar-link">
              My Orders
            </Link>

            {user.role === 'admin' ? (
              <Link to="/admin" className="sidebar-link">
                Admin Dashboard
              </Link>
            ) : (
              <button
                className="sidebar-link"
                onClick={() => {
                  makeAdmin();
                  alert('You are now an Admin! Go to Admin Dashboard.');
                }}
              >
                Become Admin (Demo)
              </button>
            )}

            <button className="sidebar-link logout" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;