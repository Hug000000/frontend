import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import apiClient from '../api';

function LoginPage() {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages
  const { login } = useAuth(); // Récupère la fonction login du contexte d'authentification

  // État local pour les données du formulaire, les erreurs et le statut de la requête
  const [formData, setFormData] = useState({
    username: '',
    motdepasse: '',
  });
  const [errors, setErrors] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  // Gère les changements dans les champs de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Valide les champs du formulaire
  const validateForm = () => {
    const { username, motdepasse } = formData;
    return username && motdepasse; // Retourne vrai si les deux champs sont remplis
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setRequestStatus('');

    // Vérifie si tous les champs sont remplis
    if (!validateForm()) {
      setErrors('Tous les champs doivent être remplis.');
      return;
    }

    try {
      // Envoie une requête POST pour tenter de se connecter
      const response = await apiClient.post(
        '/utilisateurs/login/',
        {
          username: formData.username,
          motdepasse: formData.motdepasse,
        },
        { withCredentials: true } // Inclut les cookies dans la requête
      );

      // Si la connexion est réussie
      if (response.status === 200) {
        setRequestStatus('Connexion réussie!');
        login(); // Met à jour l'état d'authentification
        navigate('/'); // Redirige vers la page d'accueil après la connexion
      }
    } catch (error) {
      // Gère les erreurs de connexion
      if (error.response && error.response.status === 401) {
        setRequestStatus('Nom d\'utilisateur ou mot de passe incorrect');
      } else {
        setRequestStatus('Une erreur s\'est produite lors de la tentative de connexion.');
      }
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center"
      >
        <h3 className="text-5xl font-bold mb-5 text-primary flex justify-center gap-2 mx-auto">
          Connectez-vous
        </h3>

        {errors && <p className="text-red-600 mb-4">{errors}</p>}
        {requestStatus && (
          <p
            className={`mb-4 ${
              requestStatus.includes('réussie') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {requestStatus}
          </p>
        )}

        <label className="bg-neutral input input-primary text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="username"
            type="text"
            className="grow"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
          />
        </label>

        <label className="bg-neutral input input-primary text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="motdepasse"
            type="password"
            className="grow"
            placeholder="Mot de passe"
            value={formData.motdepasse}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="btn btn-lg btn-primary flex items-center gap-2 my-6 mx-auto w-full"
        >
          Se connecter
        </button>

        <p className="text-primary">
          Pas encore inscrit ?{' '}
          <Link className="link-accent" to="/signup">
            Inscrivez-vous
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;