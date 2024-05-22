import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import apiClient from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.get('/utilisateurs/informationsWithPassword');
      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        setIsAdmin(response.data.estadmin);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  const login = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/utilisateurs/logout');
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = { isAuthenticated, user, isAdmin, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};