import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, X } from 'lucide-react';

const emptyForm = {
  code: '',
  type: 'percentage', // percentage | fixed
  value: '',
  minOrder: '',
  startDate: '',
  expiryDate: '',
  isActive: true,
};

function Offers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem('savorhub_offers');
    if (saved) {
      setOffers(JSON.parse(saved));
    }
  }, []);

  const saveOffers = (newOffers) => {
    setOffers(newOffers);
    localStorage.setItem('savorhub_offers', JSON.stringify(newOffers));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (offer) => {
    setEditingId(offer.id);
    setForm({
      code: offer.code,
      type: offer.type,
      value: offer.value,
      minOrder: offer.minOrder,
      startDate: offer.startDate,
      expiryDate: offer.expiryDate,
      isActive: offer.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.code.trim() || !form.value) {
      alert('Please fill Promo Code and Discount Value');
      return;
    }

    const offerData = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      startDate: form.startDate,
      expiryDate: form.expiryDate,
      isActive: form.isActive,
    };

    if (editingId) {
      const updated = offers.map((o) =>
        o.id === editingId ? { ...o, ...offerData } : o
      );
      saveOffers(updated);
    } else {
      // Check if code already exists
      if (offers.some((o) => o.code === offerData.code)) {
        alert('This promo code already exists');
        return;
      }

      const newOffer = {
        id: Date.now().toString(),
        ...offerData,
        createdAt: new Date().toISOString(),
      };
      saveOffers([newOffer, ...offers]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this offer?')) {
      saveOffers(offers.filter((o) => o.id !== id));
    }
  };

  const toggleActive = (id) => {
    const updated = offers.map((o) =>
      o.id === id ? { ...o, isActive: !o.isActive } : o
    );
    saveOffers(updated);
  };

  return (
    <div className="admin-offers-page">
      <div className="admin-page-header">
        <div>
          <h1>Offers & Promo Codes</h1>
          <p>Create and manage discount codes</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: '12px', padding: '3rem' }}>
          <Tag size={48} strokeWidth={1.5} />
          <h3>No offers yet</h3>
          <p>Create your first promo code to attract customers.</p>
        </div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min. Order</th>
                  <th>Validity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <strong className="promo-code">{offer.code}</strong>
                    </td>
                    <td>
                      {offer.type === 'percentage'
                        ? `${offer.value}% OFF`
                        : `$${offer.value.toFixed(2)} OFF`}
                    </td>
                    <td>
                      {offer.minOrder > 0
                        ? `$${offer.minOrder.toFixed(2)}`
                        : 'No minimum'}
                    </td>
                    <td>
                      <small>
                        {offer.startDate || '—'} → {offer.expiryDate || '—'}
                      </small>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${
                          offer.isActive ? 'available' : 'unavailable'
                        }`}
                        onClick={() => toggleActive(offer.id)}
                      >
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(offer)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(offer.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Offer' : 'Create New Offer'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Promo Code *</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="WELCOME10"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Value *</label>
                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                    placeholder={form.type === 'percentage' ? '10' : '5.00'}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum Order Amount ($)</label>
                <input
                  type="number"
                  name="minOrder"
                  value={form.minOrder}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline-dark" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;