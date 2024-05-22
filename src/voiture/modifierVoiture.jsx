import { useState, useEffect } from 'react';
import apiClient from '../api';
import { useParams, useNavigate } from 'react-router-dom';

function ModifierVoiture() {
  const { plaqueimat } = useParams();
  const navigate = useNavigate();
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [couleur, setCouleur] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Charger les détails de la voiture à modifier
  useEffect(() => {
    const chargerVoiture = async () => {
      try {
        const response = await apiClient.get(`/voiture/${plaqueimat}`);
        const voiture = response.data;
        setMarque(voiture.marque);
        setModele(voiture.modele);
        setCouleur(voiture.couleur);
      } catch (error) {
        console.error('Erreur lors du chargement de la voiture:', error);
        setError('Erreur lors du chargement de la voiture.');
      }
    };

    chargerVoiture();
  }, [plaqueimat]);

  // Vérifier que tous les champs sont remplis
  const validerChamps = () => {
    if (!marque || !modele || !couleur) {
      setError('Tous les champs doivent être remplis.');
      return false;
    }
    return true;
  };

  // Fonction pour mettre à jour la voiture
  const mettreAJourVoiture = async () => {
    if (!validerChamps()) {
      return;
    }

    try {
      await apiClient.put(`/voiture/${plaqueimat}`, {
        marque,
        modele,
        couleur,
      });

      setMessage('Voiture mise à jour avec succès.');
      setTimeout(() => navigate('/mesvoitures'), 2000); // Redirige après 2 secondes
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la voiture:', error);
      setError('Erreur lors de la mise à jour de la voiture.');
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
        <h1 className="text-2xl font-bold mb-5 text-primary">Modifier la Voiture</h1>
        {error && <p className="text-red-600 mb-5">{error}</p>}
        {message && <p className="text-green-600 mb-5">{message}</p>}
        <div className="form-group mb-3">
          <label className="text-primary">Marque</label>
          <input type="text" value={marque} onChange={(e) => setMarque(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <div className="form-group mb-3">
          <label className="text-primary">Modèle</label>
          <input type="text" value={modele} onChange={(e) => setModele(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <div className="form-group mb-3">
          <label className="text-primary">Couleur</label>
          <input type="text" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <button onClick={mettreAJourVoiture} className="btn btn-primary">Mettre à Jour</button>
      </div>
    </div>
  );
}

export default ModifierVoiture;