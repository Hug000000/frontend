import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { format } from 'date-fns';
import useSocket from '../socket/useSocket';
import 'daisyui';

// Fonction pour obtenir la source de l'image
const getImageSrc = (image) => {
  if (!image) return '';
  const isBase64 = image.startsWith('data:image');
  return isBase64 ? image : `data:image/jpeg;base64,${image}`;
};

const TrajetDetails = () => {
  const { trajetId } = useParams(); // Récupère l'ID du trajet depuis les paramètres de l'URL
  const [trajet, setTrajet] = useState(null);
  const [user, setUser] = useState(null);
  const [conducteur, setConducteur] = useState(null);
  const [rating, setRating] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [trajetDeletedError, setTrajetDeletedError] = useState(null); // État pour gérer l'erreur de trajet supprimé
  const navigate = useNavigate();

  // Fonction pour récupérer les informations du trajet et de l'utilisateur
  const fetchUserAndTrajet = useCallback(async () => {
    try {
      const trajetResponse = await apiClient.get(`/trajets/${trajetId}`);
      setTrajet(trajetResponse.data);
      if (trajetResponse.data) {
        const conducteurDataResponse = await apiClient.get(`/utilisateurs/${trajetResponse.data.idConducteur}`);
        setConducteur(conducteurDataResponse.data);

        const ratingResponse = await apiClient.get(`/avis/moyenne/${trajetResponse.data.idConducteur}`);
        setRating(ratingResponse.data.moyenne === -1 ? 'Pas encore noté' : ratingResponse.data.moyenne);

        const hasRatedResponse = await apiClient.get(`/avis/hasRated/${trajetResponse.data.idConducteur}`);
        setHasRated(hasRatedResponse.data.hasRated);
      }
      const userDataResponse = await apiClient.get(`/utilisateurs/informationsWithPassword`);
      setUser(userDataResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to fetch details');
      setLoading(false);
    }
  }, [trajetId]);

  useEffect(() => {
    fetchUserAndTrajet();
  }, [fetchUserAndTrajet]);

  useSocket({
    nouvel_avis: (nouvelAvis) => {
      if (nouvelAvis.iddestinataire === conducteur?.idutilisateur) {
        fetchUserAndTrajet();
      }
    },
    supprimer_avis: (deletedAvis) => {
      if (deletedAvis.iddestinataire === conducteur?.idutilisateur) {
        fetchUserAndTrajet();
      }
    },
    trajet_supprime: ({ trajetId: deletedTrajetId }) => {
      if (deletedTrajetId === trajetId) {
        setTrajetDeletedError('Ce trajet a été supprimé.');
        setTimeout(() => {
          navigate('/mestrajets');
        }, 3000);
      }
    },
    passager_ajoute: ({ trajetId: updatedTrajetId }) => {
      console.log('passager_ajoute received:', updatedTrajetId);
      if (updatedTrajetId === trajetId) {
        fetchUserAndTrajet();
      }
    },
    passager_supprime: ({ trajetId: updatedTrajetId }) => {
      console.log('passager_supprime received:', updatedTrajetId);
      if (updatedTrajetId === trajetId) {
        fetchUserAndTrajet();
      }
    }
  });

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/trajets/${trajetId}`);
      navigate('/mestrajets');
    } catch (error) {
      console.error('Failed to delete the trajet:', error);
      setError('Failed to delete the trajet');
    }
    setShowDeleteModal(false);
  };

  const handleJoinAsPassenger = async () => {
    try {
      await apiClient.post(`/trajets/join/${trajetId}`);
      setSuccessMessage('Vous avez rejoint le trajet avec succès.');
      setTimeout(() => setSuccessMessage(''), 3000); // Effacer le message après 3 secondes
      setLoading(true);
      navigate(0); // Rafraîchir la page pour refléter le nouvel état
    } catch (error) {
      console.error('Failed to join the trajet as a passenger:', error);
      setError('Failed to join as a passenger');
    }
    setShowJoinModal(false);
  };

  const handleLeaveAsPassenger = async () => {
    try {
      await apiClient.post(`/trajets/leave/${trajetId}`);
      setSuccessMessage('Vous avez quitté le trajet avec succès.');
      setTimeout(() => setSuccessMessage(''), 3000); // Effacer le message après 3 secondes
      setLoading(true);
      navigate(0); // Rafraîchir la page pour refléter le nouvel état
    } catch (error) {
      console.error('Failed to leave the trajet as a passenger:', error);
      setError('Failed to leave as a passenger');
    }
    setShowLeaveModal(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!trajet) return <div>No trajet found</div>;

  const isConductor = user?.idutilisateur === trajet.conducteur.idutilisateur;
  const isPassenger = trajet.passagers?.some(passager => {
    return passager.passager.idutilisateur === user?.idutilisateur;
  });
  const trajetFull = trajet.nombrePassagers >= trajet.placesDisponibles;
  const placesInfo = `${trajet.nombrePassagers} / ${trajet.placesDisponibles}`;
  const now = new Date();
  const trajetDate = new Date(trajet.heuredepart);
  const canRate = (isPassenger && now > trajetDate && !hasRated);

  return (
    <div className="bg-secondary min-h-screen flex justify-center items-center py-60">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        <h1 className="text-4xl font-bold my-6">Détails du Trajet</h1>
        {trajetDeletedError && <div className="text-red-500 mb-4">{trajetDeletedError}</div>}
        <div className="bg-gray-100 p-4 rounded-lg my-1">
          <p><strong>Description:</strong> {trajet.description}</p>
        </div>
        <p className="my-1"><strong>De:</strong> {trajet.villedepart.nom}</p>
        <p className="my-1"><strong>À:</strong> {trajet.villearrivee.nom}</p>
        <p className="my-1"><strong>Date et heure de départ:</strong> {format(new Date(trajet.heuredepart), 'PPPp')}</p>
        <p className="my-1"><strong>Date et heure d'arrivée:</strong> {format(new Date(trajet.heurearrivee), 'PPPp')}</p>
        <p className="my-1"><strong>Prix:</strong> {trajet.prix} €</p>
        <p><strong>Places réservées:</strong> {placesInfo}</p>
        <h2 className="text-2xl font-semibold mt-6">Informations sur la voiture</h2>
        <p className="my-1"><strong>Marque:</strong> {trajet.voiture.marque}</p>
        <p className="my-1"><strong>Modèle:</strong> {trajet.voiture.modele}</p>
        <p className="my-1"><strong>Couleur:</strong> {trajet.voiture.couleur}</p>
        <p className="my-1"><strong>Plaque d'immatriculation:</strong> {trajet.voiture.plaqueimat}</p>
        <h2 className="text-2xl font-semibold mt-6">Informations sur le conducteur</h2>
        <p className="my-1"><strong>Nom:</strong> {conducteur?.prenom} {conducteur?.nom}</p>
        <p className="my-1"><strong>Âge:</strong> {conducteur?.age}</p>
        <p className="my-1"><strong>Contact:</strong> {conducteur?.numtel}</p>
        <p>
          <strong>Evaluation:</strong>
          <span onClick={() => navigate(`/avis-utilisateur/${conducteur?.idutilisateur}`)} className="text-blue-500 cursor-pointer">
            {rating}
          </span>
        </p>
        {conducteur?.photo?.image && (
          <img src={getImageSrc(conducteur.photo.image)} alt="Photo de profil" className="w-24 h-24 rounded-full my-1" />
        )}
        <button onClick={() => navigate(-1)} className="btn btn-secondary mt-8">Retour</button>
        {successMessage && <div className="text-green-500">{successMessage}</div>}
        {isConductor && (
          <button onClick={() => setShowDeleteModal(true)} className="btn btn-error mt-4 ml-2">Supprimer ce trajet</button>
        )}
        {!isConductor && !isPassenger && !trajetFull && (
          <button onClick={() => setShowJoinModal(true)} className="btn btn-success mt-4 ml-2">Rejoindre en tant que passager</button>
        )}
        {isPassenger && (
          <button onClick={() => setShowLeaveModal(true)} className="btn btn-warning mt-4 ml-2">Quitter en tant que passager</button>
        )}
        {canRate && (
          <button onClick={() => navigate(`/noter/${conducteur?.idutilisateur}`)} className="btn btn-primary mt-4 ml-2">Noter le conducteur</button>
        )}

        {/* Modale de confirmation pour suppression */}
        {showDeleteModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirmation de suppression</h3>
              <p className="py-4">Êtes-vous sûr de vouloir supprimer ce trajet ?</p>
              <div className="modal-action">
                <button onClick={handleDelete} className="btn btn-error">Oui</button>
                <button onClick={() => setShowDeleteModal(false)} className="btn-success">Non</button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de confirmation pour rejoindre */}
        {showJoinModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirmation de rejoindre</h3>
              <p className="py-4">Êtes-vous sûr de vouloir rejoindre ce trajet ?</p>
              <div className="modal-action">
                <button onClick={handleJoinAsPassenger} className="btn btn-success">Oui</button>
                <button onClick={() => setShowJoinModal(false)} className="btn btn-error">Non</button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de confirmation pour quitter */}
        {showLeaveModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirmation de quitter</h3>
              <p className="py-4">Êtes-vous sûr de vouloir quitter ce trajet ?</p>
              <div className="modal-action">
                <button onClick={handleLeaveAsPassenger} className="btn btn-warning">Oui</button>
                <button onClick={() => setShowLeaveModal(false)} className="btn btn-success">Non</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrajetDetails;