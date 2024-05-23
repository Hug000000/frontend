import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api';
import useSocket from '../socket/useSocket';

// Composant pour afficher les avis sur un utilisateur spécifique
const AvisSurUtilisateur = () => {
  const { destinataireId } = useParams(); // Récupère l'ID du destinataire à partir des paramètres de l'URL
  const [avis, setAvis] = useState([]); // État pour stocker les avis
  const [average, setAverage] = useState(null); // État pour stocker la moyenne des notes
  const [error, setError] = useState(''); // État pour stocker les messages d'erreur

  // Fonction pour récupérer les avis d'un utilisateur spécifique
  const fetchAvis = useCallback(async () => {
    try {
      const response = await apiClient.get(`/avis/destinataire/${destinataireId}`);
      setAvis(response.data); // Met à jour l'état avec les avis récupérés
    } catch (err) {
      setError('Erreur lors de la récupération des avis');
      console.error(err); // Affiche l'erreur dans la console
    }
  }, [destinataireId]);

  // Fonction pour récupérer la moyenne des notes d'un utilisateur spécifique
  const fetchAverage = useCallback(async () => {
    try {
      const response = await apiClient.get(`/avis/moyenne/${destinataireId}`);
      setAverage(response.data.moyenne !== -1 ? response.data.moyenne : 'Pas encore noté'); // Met à jour l'état avec la moyenne ou un message par défaut
    } catch (err) {
      setError('Erreur lors de la récupération de la moyenne');
      console.error(err); // Affiche l'erreur dans la console
    }
  }, [destinataireId]);

  // Utilise useEffect pour récupérer les avis et la moyenne des notes lors du montage du composant
  useEffect(() => {
    fetchAvis();
    fetchAverage();
  }, [fetchAvis, fetchAverage]);

  // Utilise le hook useSocket pour mettre à jour les avis et la moyenne en temps réel
  useSocket({
    nouvel_avis: () => {
      fetchAvis();
      fetchAverage();
    },
    supprimer_avis: () => {
      fetchAvis();
      fetchAverage();
    },
  });

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Avis sur l'utilisateur</h2>
        {error && <p className="text-red-600">{error}</p>} {/* Affiche les messages d'erreur */}
        {average !== null && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold">Moyenne des avis: {average}</h3> {/* Affiche la moyenne des avis */}
          </div>
        )}
        <div className="mb-8">
          {avis.length > 0 ? (
            avis.map((avis) => (
              <div key={avis.idavis} className="mb-4 p-4 bg-secondary text-secondary-content rounded-lg shadow-md">
                <p><strong>Note:</strong> {avis.note}</p>
                <p><strong>Texte:</strong> {avis.texte}</p>
                <p><strong>Date:</strong> {new Date(avis.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>Aucun avis trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvisSurUtilisateur;