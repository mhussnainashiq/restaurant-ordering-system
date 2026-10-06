import { useState, useEffect } from 'react';
import { Save, Store } from 'lucide-react';

const defaultSettings = {
  name: 'SavorHub',
  tagline: 'Delicious food, delivered with love',
  phone: '+1 (555) 123-4567',
  email: 'hello@savorhub.com',
  address: '123 Food Street, Flavor City, FC 10001',
  openingHours: [
    { day: 'Monday - Friday', time: '10:00 AM - 10:00 PM' },
    { day: 'Saturday - Sunday', time: '11:00 AM - 11:00 PM' },
  ],
  deliveryFee: 3.99,
  taxPercentage: 8,
  minOrderAmount: 0,
  currency: 'USD', // USD or PKR
};

function Settings() {
  const [form, setForm] = useState(defaultSettings);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savorhub_settings');
    if (saved) {
      try {
        setForm({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHoursChange = (index, field, value) => {
    const updated = [...form.openingHours];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, openingHours: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const settingsToSave = {
      ...form,
      deliveryFee: Number(form.deliveryFee) || 0,
      taxPercentage: Number(form.taxPercentage) || 0,
      minOrderAmount: Number(form.minOrderAmount) || 0,
    };

    localStorage.setItem('savorhub_settings', JSON.stringify(settingsToSave));

    // Also update a global flag so other pages can react
    window.dispatchEvent(new Event('settingsUpdated'));

    setTimeout(() => {
      setLoading(false);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 400);
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div>
          <h1>Restaurant Settings</h1>
          <p>Manage your restaurant information</p>
        </div>
      </div>

      {message && (
        <div className="success-message" style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Basic Info */}
        <div className="settings-card">
          <h2>
            <Store size={20} /> Basic Information
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="settings-card">
          <h2>Opening Hours</h2>

          {form.openingHours.map((item, index) => (
            <div className="form-row" key={index}>
              <div className="form-group">
                <label>Days</label>
                <input
                  type="text"
                  value={item.day}
                  onChange={(e) =>
                    handleHoursChange(index, 'day', e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) =>
                    handleHoursChange(index, 'time', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Currency & Order Settings */}
        <div className="settings-card">
          <h2>Currency & Order Settings</h2>

          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              style={{ maxWidth: '220px' }}
            >
              <option value="USD">US Dollar ($)</option>
              <option value="PKR">Pakistani Rupee (Rs)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Delivery Fee ({form.currency === 'PKR' ? 'Rs' : '$'})
              </label>
              <input
                type="number"
                name="deliveryFee"
                value={form.deliveryFee}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Tax Percentage (%)</label>
              <input
                type="number"
                name="taxPercentage"
                value={form.taxPercentage}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Minimum Order Amount ({form.currency === 'PKR' ? 'Rs' : '$'})
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default Settings;