import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api';
import useSocket from '../socket/useSocket';

// Composant pour afficher et gérer les avis envoyés et reçus par l'utilisateur
const MesAvis = () => {
  const [sentAvis, setSentAvis] = useState([]); // État pour stocker les avis envoyés
  const [receivedAvis, setReceivedAvis] = useState([]); // État pour stocker les avis reçus
  const [error, setError] = useState(''); // État pour stocker les messages d'erreur
  const [successMessage, setSuccessMessage] = useState(''); // État pour stocker les messages de succès

  // Fonction pour récupérer les avis envoyés et reçus
  const fetchAvis = useCallback(async () => {
    try {
      const sentResponse = await apiClient.get('/avis/emetteur/');
      setSentAvis(sentResponse.data); // Met à jour l'état avec les avis envoyés

      const receivedResponse = await apiClient.get('/avis/destinataire/');
      setReceivedAvis(receivedResponse.data); // Met à jour l'état avec les avis reçus
    } catch (err) {
      setError('Erreur lors de la récupération des avis'); // Met à jour l'état en cas d'erreur
      console.error(err);
    }
  }, []);

  // Utilise useEffect pour récupérer les avis lors du montage du composant
  useEffect(() => {
    fetchAvis();
  }, [fetchAvis]);

  // Utilise le hook useSocket pour mettre à jour les avis en temps réel
  useSocket({
    nouvel_avis: () => {
      fetchAvis();
    },
    supprimer_avis: () => {
      fetchAvis();
    },
  });

  // Fonction pour supprimer un avis
  const deleteAvis = useCallback(async (id) => {
    try {
      await apiClient.delete(`/avis/${id}`);
      setSentAvis((prev) => prev.filter((avis) => avis.idavis !== id)); // Met à jour l'état pour retirer l'avis supprimé
      setSuccessMessage('Avis supprimé avec succès'); // Affiche un message de succès
      setTimeout(() => setSuccessMessage(''), 3000); // Efface le message après 3 secondes
    } catch (err) {
      setError('Erreur lors de la suppression de l\'avis'); // Met à jour l'état en cas d'erreur
      console.error(err);
    }
  }, []);

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Mes Avis</h2>
        {error && <p className="text-red-600">{error}</p>} {/* Affiche les messages d'erreur */}
        {successMessage && <p className="text-green-600">{successMessage}</p>} {/* Affiche les messages de succès */}
        <div className="mb-8">
          <div className="collapse mb-4">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-2xl bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              Avis Envoyés
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              {sentAvis.length > 0 ? (
                sentAvis.map((avis) => (
                  <div key={avis.idavis} className="mb-4 p-4 bg-accent text-accent-content rounded-lg shadow-md">
                    <p>Note: {avis.note}</p>
                    <p>Texte: {avis.texte}</p>
                    <p>Date: {new Date(avis.date).toLocaleDateString()}</p>
                    <button
                      onClick={() => deleteAvis(avis.idavis)}
                      className="btn btn-error mt-2"
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucun avis envoyé.</p>
              )}
            </div>
          </div>

          <div className="collapse">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-2xl bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              Avis Reçus
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              {receivedAvis.length > 0 ? (
                receivedAvis.map((avis) => (
                  <div key={avis.idavis} className="mb-4 p-4 bg-accent text-accent-content rounded-lg shadow-md">
                    <p>Note: {avis.note}</p>
                    <p>Texte: {avis.texte}</p>
                    <p>Date: {new Date(avis.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>Aucun avis reçu.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesAvis;
