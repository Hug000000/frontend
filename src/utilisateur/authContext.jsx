import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import apiClient from '../api';

// Création du contexte d'authentification
export const AuthContext = createContext();

// Fournisseur du contexte d'authentification
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour vérifier si l'utilisateur est authentifié
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
  const [isAdmin, setIsAdmin] = useState(false); // État pour vérifier si l'utilisateur est administrateur

  // Fonction pour vérifier l'authentification de l'utilisateur
  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.get('/utilisateurs/informationsWithPassword');
      if (response.data) {
        setIsAuthenticated(true); // Met à jour l'état d'authentification
        setUser(response.data); // Met à jour l'état utilisateur
        setIsAdmin(response.data.estadmin); // Met à jour l'état admin
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

  // Fonction pour se connecter
  const login = useCallback(() => {
    checkAuth(); // Vérifie l'authentification après la connexion
  }, [checkAuth]);

  // Fonction pour se déconnecter
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/utilisateurs/logout');
      setIsAuthenticated(false); // Met à jour l'état d'authentification
      setUser(null); // Réinitialise l'état utilisateur
      setIsAdmin(false); // Réinitialise l'état admin
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, []);

  // Utilisation de useEffect pour vérifier l'authentification à l'initialisation
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Valeur du contexte d'authentification
  const value = { isAuthenticated, user, isAdmin, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired // Définition des types pour les props
};