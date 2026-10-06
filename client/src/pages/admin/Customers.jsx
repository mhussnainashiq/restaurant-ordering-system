import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('savorhub_users') || '[]');
    const orders = JSON.parse(localStorage.getItem('savorhub_orders') || '[]');

    // Calculate order stats for each customer
    const customersWithStats = users.map((user) => {
      const userOrders = orders.filter(
        (order) => order.customer.email === user.email
      );

      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '—',
        role: user.role || 'customer',
        orderCount: userOrders.length,
        totalSpent,
        createdAt: user.createdAt,
      };
    });

    // Sort by most recent registration
    customersWithStats.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setCustomers(customersWithStats);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="admin-customers-page">
      <div className="admin-page-header">
        <div>
          <h1>Customer Management</h1>
          <p>View all registered customers</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="customer-stats">
        <div className="stat-card small">
          <Users size={20} color="#2563eb" />
          <div>
            <h3>{customers.length}</h3>
            <p>Total Customers</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-bar" style={{ marginBottom: '1.5rem' }}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.orderCount}</td>
                    <td>
                      <strong>${customer.totalSpent.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        className={`role-badge ${
                          customer.role === 'admin' ? 'admin' : 'customer'
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td>
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;