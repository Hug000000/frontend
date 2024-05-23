import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../useAuth';

function SupprimerCompte() {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages
  const { logout } = useAuth(); // Récupère la fonction logout du contexte d'authentification
  const [errorMessage, setErrorMessage] = useState(null); // État pour gérer les messages d'erreur
  const [successMessage, setSuccessMessage] = useState(null); // État pour gérer les messages de succès

  // Fonction pour supprimer le compte
  async function suppressionCompte() {
    try {
      const response = await apiClient.delete('/utilisateurs/'); // Envoie une requête DELETE pour supprimer le compte utilisateur

      if (response.status === 200) {
        setSuccessMessage('Compte supprimé avec succès.'); // Affiche un message de succès
        logout(); // Déconnecte l'utilisateur
        setTimeout(() => {
          navigate('/'); // Redirige vers la page d'accueil après 2 secondes
        }, 2000);
      } else {
        setErrorMessage('Erreur lors de la suppression du compte.'); // Affiche un message d'erreur si le statut de la réponse n'est pas 200
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.'); // Affiche un message d'erreur en cas d'exception
    }
  }

  // Fonction pour annuler la suppression
  function annulerSuppression() {
    navigate('/profile'); // Redirige vers la page du profil
  }

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
        <h1 className="text-2xl font-bold mb-5">Supprimer le compte</h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <p className="mb-5">Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.</p>
        <div>
          <button onClick={suppressionCompte} className="btn btn-danger mr-2">Oui, supprimer</button>
          <button onClick={annulerSuppression} className="btn btn-primary">Annuler</button>
        </div>
      </div>
    </div>        
  );
}

export default SupprimerCompte;