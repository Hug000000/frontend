import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api';
import useSocket from '../socket/useSocket';

const AvisSurUtilisateur = () => {
  const { destinataireId } = useParams();
  const [avis, setAvis] = useState([]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState('');

  const fetchAvis = useCallback(async () => {
    try {
      const response = await apiClient.get(`/avis/destinataire/${destinataireId}`);
      setAvis(response.data);
    } catch (err) {
      setError('Erreur lors de la récupération des avis');
      console.error(err);
    }
  }, [destinataireId]);

  const fetchAverage = useCallback(async () => {
    try {
      const response = await apiClient.get(`/avis/moyenne/${destinataireId}`);
      setAverage(response.data.moyenne !== -1 ? response.data.moyenne : 'Pas encore noté');
    } catch (err) {
      setError('Erreur lors de la récupération de la moyenne');
      console.error(err);
    }
  }, [destinataireId]);

  useEffect(() => {
    fetchAvis();
    fetchAverage();
  }, [fetchAvis, fetchAverage]);

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
        {error && <p className="text-red-600">{error}</p>}
        {average !== null && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold">Moyenne des avis: {average}</h3>
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
