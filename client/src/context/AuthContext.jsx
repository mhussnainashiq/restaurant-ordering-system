import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('savorhub_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load user', err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('savorhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('savorhub_user');
    }
  }, [user]);

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('savorhub_users') || '[]');

    const exists = users.find((u) => u.email === userData.email);
    if (exists) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      address: userData.address || '',
      password: userData.password,
      role: 'customer', // default role
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('savorhub_users', JSON.stringify(users));

    const { password, ...safeUser } = newUser;
    setUser(safeUser);
    return safeUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('savorhub_users') || '[]');
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem('savorhub_users') || '[]');
    const index = users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      localStorage.setItem('savorhub_users', JSON.stringify(users));
    }

    const newUser = { ...user, ...updatedData };
    setUser(newUser);
  };

  // Make current user an admin (for testing)
  const makeAdmin = () => {
    if (!user) return;
    updateProfile({ role: 'admin' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        makeAdmin,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}