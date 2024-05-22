import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import apiClient from '../api';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    motdepasse: '',
  });
  const [errors, setErrors] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const { username, motdepasse } = formData;
    return username && motdepasse;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setRequestStatus('');

    if (!validateForm()) {
      setErrors('Tous les champs doivent être remplis.');
      return;
    }

    try {
      const response = await apiClient.post(
        '/utilisateurs/login/',
        {
          username: formData.username,
          motdepasse: formData.motdepasse,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setRequestStatus('Connexion réussie!');
        login(); // Met à jour l'état d'authentification
        navigate('/'); // Redirige vers la page d'accueil après la connexion
      }
    } catch (error) {
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
