import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

function AjouterVoiture() {
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [couleur, setCouleur] = useState('');
  const [plaqueimat, setPlaqueimat] = useState('');
  const [checkboxOne, setCheckboxOne] = useState(false);
  const [checkboxTwo, setCheckboxTwo] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonction pour valider la plaque d'immatriculation
  const validerPlaque = (plaque) => {
    const regex = /^[[-]A-Z0-9]{1,9}$/;
    return regex.test(plaque);
  };

  // Fonction pour ajouter une voiture
  const ajouterVoiture = async () => {
    if (!marque || !modele || !couleur || !plaqueimat) {
      setError('Tous les champs doivent être remplis.');
      return;
    }

    if (!validerPlaque(plaqueimat)) {
      setError('La plaque d\'immatriculation doit être au format valide (A-Z, 0-9, tirets).');
      return;
    }

    if (!checkboxOne || !checkboxTwo) {
      setError('Vous devez accepter les deux conditions.');
      return;
    }

    try {
      const response = await apiClient.post('/voiture/', {
        marque,
        modele,
        couleur,
        plaqueimat,
      });

      if (response.status === 201) {
        setMarque('');
        setModele('');
        setCouleur('');
        setPlaqueimat('');
        setMessage('Voiture ajoutée avec succès.');
        setError('');
        setTimeout(() => navigate('/mesvoitures'), 500);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture:', error);
      setMessage('Erreur lors de l\'ajout de la voiture.');
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
        <h1 className="text-2xl font-bold text-primary mb-5">Ajouter une Voiture</h1>
        {error && <p className="text-red-600 mb-5">{error}</p>}
        {message && <p className="text-green-600 mb-5">{message}</p>}
        <div className="form-group text-primary mb-3">
          <label>Marque</label>
          <input type="text" value={marque} onChange={(e) => setMarque(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <div className="form-group text-primary mb-3">
          <label>Modèle</label>
          <input type="text" value={modele} onChange={(e) => setModele(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <div className="form-group text-primary mb-3">
          <label>Couleur</label>
          <input type="text" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <div className="form-group text-primary mb-3">
          <label>Plaque d'Immatriculation</label>
          <input type="text" value={plaqueimat} onChange={(e) => setPlaqueimat(e.target.value)} className="bg-neutral input input-primary text-primary input-bordered form-control" required />
        </div>
        <div className="form-group text-primary mb-3">
          <label className="cursor-pointer label">
            <span className="label-text mr-2">J'atteste que mon véhicule est couvert par une assurance adaptée au covoiturage, conforme aux exigences légales et aux conditions du site.</span>
            <input type="checkbox" checked={checkboxOne} onChange={(e) => setCheckboxOne(e.target.checked)} className="checkbox checkbox-primary" />
          </label>
        </div>
        <div className="form-group text-primary mb-3">
          <label className="cursor-pointer label">
            <span className="label-text mr-2">Je confirme que mon véhicule a réussi un contrôle technique récent et qu'il respecte toutes les normes de sécurité en vigueur.</span>
            <input type="checkbox" checked={checkboxTwo} onChange={(e) => setCheckboxTwo(e.target.checked)} className="checkbox checkbox-primary" />
          </label>
        </div>
        <button onClick={ajouterVoiture} className="btn btn-primary">Ajouter</button>
      </div>
    </div>
  );
}

export default AjouterVoiture;