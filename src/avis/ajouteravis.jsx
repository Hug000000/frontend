import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// Composant pour noter un utilisateur
const Rating = () => {
  const { userId } = useParams(); // Récupération de l'ID de l'utilisateur depuis les paramètres de l'URL
  const navigate = useNavigate(); // Utilisation du hook useNavigate pour la navigation
  const [rating, setRating] = useState(2); // Valeur initiale de 2 étoiles
  const [text, setText] = useState(''); // État pour le texte du commentaire
  const [message, setMessage] = useState(''); // État pour les messages de succès
  const [error, setError] = useState(''); // État pour les messages d'erreur

  // Fonction pour gérer le changement de note
  const handleRatingChange = (value) => {
    setRating(value);
  };

  // Fonction pour gérer le changement de texte du commentaire
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Fonction pour soumettre l'avis
  const submitRating = async () => {
    try {
      // Envoie la note, la date, le texte et l'ID du destinataire à l'API
      await apiClient.post('/avis', {
        note: rating,
        date: new Date().toISOString(),
        texte: text,
        destinataire: userId,
      });
      setMessage('Avis soumis avec succès'); // Affiche un message de succès
      setError(''); // Réinitialise les messages d'erreur
      setTimeout(() => {
        navigate(-1); // Navigue vers la page précédente après 1.5 secondes
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Affiche le message d'erreur de la réponse
        setMessage('');
      } else {
        setError('Une erreur est survenue lors de la soumission de l\'avis'); // Affiche un message d'erreur générique
        setMessage('');
      }
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        {message && <div className="alert alert-success">{message}</div>} {/* Affiche le message de succès */}
        {error && <div className="alert alert-error">{error}</div>} {/* Affiche le message d'erreur */}
        <h2 className="text-2xl font-bold mb-4">Noter l'utilisateur</h2>
        <div className="rating flex mb-4">
          {/* Affiche les étoiles de notation */}
          {[1, 2, 3, 4, 5].map((value) => (
            <FontAwesomeIcon
              key={value}
              icon={faStar}
              className={`cursor-pointer text-4xl ${value <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => handleRatingChange(value)}
            />
          ))}
        </div>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Entrez votre commentaire"
          className="textarea textarea-bordered mt-4 w-full"
        ></textarea>
        <button onClick={submitRating} className="btn btn-primary mt-4">
          Soumettre l'avis
        </button>
      </div>
    </div>
  );
};

export default Rating;