import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { menuItems as initialMenu } from '../../data/menuData';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Burgers',
  image: '',
  ingredients: '',
  isVegetarian: false,
  isPopular: false,
  isAvailable: true,
  preparationTime: 15,
  rating: 4.5,
};

const categories = [
  'Burgers',
  'Pizza',
  'Chicken',
  'Pasta',
  'Rice',
  'Drinks',
  'Desserts',
  'Deals',
];

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Load menu from localStorage or seed with initial data
  useEffect(() => {
    const saved = localStorage.getItem('savorhub_menu');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      localStorage.setItem('savorhub_menu', JSON.stringify(initialMenu));
      setItems(initialMenu);
    }
  }, []);

  // Save to localStorage whenever items change
  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('savorhub_menu', JSON.stringify(newItems));
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      ingredients: item.ingredients.join(', '),
      isVegetarian: item.isVegetarian,
      isPopular: item.isPopular,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime,
      rating: item.rating,
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

    if (!form.name.trim() || !form.price || !form.category) {
      alert('Please fill Name, Price and Category');
      return;
    }

    const itemData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      ingredients: form.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      isVegetarian: form.isVegetarian,
      isPopular: form.isPopular,
      isAvailable: form.isAvailable,
      preparationTime: Number(form.preparationTime) || 15,
      rating: Number(form.rating) || 4.5,
    };

    if (editingId) {
      // Update existing
      const updated = items.map((item) =>
        item.id === editingId ? { ...item, ...itemData } : item
      );
      saveItems(updated);
    } else {
      // Add new
      const newItem = {
        id: Date.now(),
        ...itemData,
      };
      saveItems([newItem, ...items]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updated = items.filter((item) => item.id !== id);
      saveItems(updated);
    }
  };

  const toggleAvailability = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    saveItems(updated);
  };

  return (
    <div className="admin-menu-page">
      <div className="admin-page-header">
        <div>
          <h1>Menu Management</h1>
          <p>Add, edit and manage your food items</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {/* Search */}
      <div className="admin-search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name or category..."
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
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="table-img"
                      />
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                      {item.isPopular && (
                        <span className="mini-badge">Popular</span>
                      )}
                    </td>
                    <td>{item.category}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <button
                        className={`status-toggle ${
                          item.isAvailable ? 'available' : 'unavailable'
                        }`}
                        onClick={() => toggleAvailability(item.id)}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(item)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Classic Cheeseburger"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="12.99"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description of the item"
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preparation Time (min)</label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={form.preparationTime}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label>Ingredients (comma separated)</label>
                <input
                  type="text"
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Beef, Cheese, Lettuce, Tomato"
                />
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={form.isVegetarian}
                    onChange={handleChange}
                  />
                  Vegetarian
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={form.isPopular}
                    onChange={handleChange}
                  />
                  Popular
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                  />
                  Available
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline-dark" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuManagement;