import { useContext } from 'react';
import { AuthContext } from './utilisateur/authContext';

// Hook personnalisé pour accéder au contexte
export function useAuth() {
  return useContext(AuthContext);
}