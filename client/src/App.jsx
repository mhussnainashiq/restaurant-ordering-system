import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';


import Home from './pages/Home';
import Menu from './pages/Menu';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';


import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import AdminOrders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Offers from './pages/admin/Offers';
import Settings from './pages/admin/Settings';

function Placeholder({ title }) {
  return (
    <div style={{ padding: '3rem 1.5rem' }}>
      <h1>{title}</h1>
      <p style={{ marginTop: '0.75rem', color: '#666' }}>
        This admin page will be built in the next stages.
      </p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:id" element={<FoodDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:orderId" element={<OrderSuccess />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<OrderTracking />} />
              <Route path="account" element={<Account />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="offers" element={<Offers />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;