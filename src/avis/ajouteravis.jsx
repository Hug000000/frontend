import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Rating = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); // Utilisation du hook useNavigate
  const [rating, setRating] = useState(2); // Valeur initiale de 2 étoiles
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const submitRating = async () => {
    try {
      await apiClient.post('/avis', {
        note: rating,
        date: new Date().toISOString(),
        texte: text,
        destinataire: userId,
      });
      setMessage('Avis soumis avec succès');
      setError('');
      setTimeout(() => {
        navigate(-1); // Naviguer vers la page précédente après un court délai
      }, 1500); // 1.5 secondes
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
        setMessage('');
      } else {
        setError('Une erreur est survenue lors de la soumission de l\'avis');
        setMessage('');
      }
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <h2 className="text-2xl font-bold mb-4">Noter l'utilisateur</h2>
        <div className="rating flex mb-4">
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
