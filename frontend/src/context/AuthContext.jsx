import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('admin_user'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.login(credentials);
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', data.username);
        setToken(data.token);
        setUsername(data.username);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, isAuth: !!token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
