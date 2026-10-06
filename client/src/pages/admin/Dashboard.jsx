import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  DollarSign,
  Users,
  UtensilsCrossed,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { menuItems } from '../../data/menuData';

function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('savorhub_orders') || '[]');
    const users = JSON.parse(localStorage.getItem('savorhub_users') || '[]');

    const today = new Date().toDateString();

    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalCustomers: users.length,
      totalMenuItems: menuItems.length,
    });

    setRecentOrders(orders.slice(0, 5));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#f59e0b',
      Confirmed: '#3b82f6',
      Preparing: '#8b5cf6',
      Ready: '#06b6d4',
      'Out for Delivery': '#f97316',
      Delivered: '#16a34a',
      Cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Overview of your restaurant</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <ShoppingBag size={22} color="#2563eb" />
          </div>
          <div>
            <h3>{stats.todayOrders}</h3>
            <p>Today's Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            <DollarSign size={22} color="#16a34a" />
          </div>
          <div>
            <h3>${stats.todayRevenue.toFixed(2)}</h3>
            <p>Today's Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Clock size={22} color="#d97706" />
          </div>
          <div>
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff' }}>
            <CheckCircle size={22} color="#7c3aed" />
          </div>
          <div>
            <h3>{stats.completedOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe' }}>
            <Users size={22} color="#0284c7" />
          </div>
          <div>
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <UtensilsCrossed size={22} color="#dc2626" />
          </div>
          <div>
            <h3>{stats.totalMenuItems}</h3>
            <p>Menu Items</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-card">
        <h2>Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="no-data">No orders yet.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer.fullName}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;