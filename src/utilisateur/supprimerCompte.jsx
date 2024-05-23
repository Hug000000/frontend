import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../useAuth';

function SupprimerCompte() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fonction pour supprimer le compte
  async function supprimerCompte() {
    try {
      const response = await apiClient.delete('/utilisateurs/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Compte supprimé avec succès.');
        logout();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrorMessage('Erreur lors de la suppression du compte.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  // Fonction pour annuler la suppression
  function annulerSuppression() {
    navigate('/profile');
  }

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
        <h1 className="text-2xl font-bold mb-5">Supprimer le compte</h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <p className="mb-5">Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.</p>
        <div>
          <button onClick={supprimerCompte} className="btn btn-danger mr-2">Oui, supprimer</button>
          <button onClick={annulerSuppression} className="btn btn-primary">Annuler</button>
        </div>
      </div>
    </div>        
  );
}

export default SupprimerCompte;
