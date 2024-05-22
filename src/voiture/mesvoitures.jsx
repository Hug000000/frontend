import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';

function MesVoitures() {
  const [voitures, setVoitures] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Charger les voitures lors du montage du composant
  useEffect(() => {
    const chargerVoitures = async () => {
      try {
        const response = await apiClient.get('/voiture/par-proprietaire');
        if (Array.isArray(response.data)) {
          setVoitures(response.data);
        } else {
          setError("Erreur: La réponse reçue n'est pas un tableau.");
        }
      } catch (err) {
        console.error('Erreur lors du chargement des voitures:', err);
        setError('Erreur lors du chargement des voitures.');
      }
    };

    chargerVoitures();
  }, []);

  // Rediriger vers la page de confirmation de suppression
  const confirmerSuppression = (plaqueimat) => {
    navigate(`/confirmer-suppression-voiture/${plaqueimat}`);
  };

  // Rediriger vers la page de modification de voiture
  const modifierVoiture = (plaqueimat) => {
    navigate(`/modifier-voiture/${plaqueimat}`);
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">      
        <h1 className="text-2xl font-bold text-primary mb-5">Mes Voitures</h1>
        {error && <p className="text-red-600 mb-5">{error}</p>}
        <ul>
          {Array.isArray(voitures) && voitures.length > 0 ? (
            voitures.map((voiture) => (
              <li key={voiture.plaqueimat} className="mb-2 text-primary">
                {voiture.marque} {voiture.modele} ({voiture.couleur}) - {voiture.plaqueimat}
                <button onClick={() => modifierVoiture(voiture.plaqueimat)} className="btn btn-primary ml-2">
                  Modifier
                </button>
                <button onClick={() => confirmerSuppression(voiture.plaqueimat)} className="btn btn-danger ml-2">
                  Supprimer
                </button>
              </li>
            ))
          ) : (
            <p>Aucune voiture trouvée.</p>
          )}
        </ul>
        <Link to="/ajouter-voiture" className="btn btn-primary mt-5">Ajouter une Voiture</Link>
      </div>
    </div>
  );
}

export default MesVoitures;