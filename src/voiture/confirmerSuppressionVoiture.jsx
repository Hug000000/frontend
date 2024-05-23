import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api';

function ConfirmerSuppressionVoiture() {
  const { plaqueimat } = useParams(); // Récupère la plaque d'immatriculation depuis les paramètres de l'URL
  const navigate = useNavigate(); // Utilisation du hook useNavigate pour la navigation

  // Fonction pour supprimer la voiture
  const supprimerVoiture = async () => {
    try {
      await apiClient.delete(`/voiture/${plaqueimat}`); // Envoie une requête DELETE à l'API pour supprimer la voiture
      navigate('/mesvoitures'); // Redirige vers la liste des voitures après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de la voiture:', error);
      alert('Erreur lors de la suppression de la voiture.'); // Affiche une alerte en cas d'erreur
    }
  };

  // Fonction pour annuler et revenir à la liste des voitures
  const annulerSuppression = () => {
    navigate('/mesvoitures'); // Redirige vers la liste des voitures sans supprimer
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
        <h1 className="text-2xl font-bold mb-5 text-primary">Supprimer la Voiture</h1>
        <p className='text-primary'>Êtes-vous sûr de vouloir supprimer la voiture avec la plaque d'immatriculation {plaqueimat} ?</p>
        <div className="mt-5">
          <button onClick={supprimerVoiture} className="btn btn-danger mr-3">Oui, supprimer</button>
          <button onClick={annulerSuppression} className="btn btn-primary">Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmerSuppressionVoiture;