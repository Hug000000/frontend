import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';

function SignUpPage() {
  const navigate = useNavigate();

  // Initialisation de l'état du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    username: '',
    numtel: '',
    motdepasse: '',
    confirmMotDePasse: '',
    image: '',
    termsAccepted: false // Ajout de l'état pour la case à cocher des conditions d'utilisation
  });

  // État pour gérer les messages d'erreur et de statut
  const [errors, setErrors] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  // Fonction de validation pour l'âge
  const isValidAge = (age) => {
    const num = parseInt(age, 10);
    return !isNaN(num) && num >= 0 && num <= 150;
  };

  // Fonction de validation pour le numéro de téléphone
  const isValidPhoneNumber = (numtel) => {
    const phoneRegex = /^\+?\d{8,15}$/;
    return phoneRegex.test(numtel);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({ ...prevState, [name]: checked }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  // Gestion du changement du champ d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({ ...prevState, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const { nom, prenom, age, username, numtel, motdepasse, confirmMotDePasse, image, termsAccepted } = formData;

    if (!nom || !prenom || !username || !motdepasse || !confirmMotDePasse || !image || !termsAccepted) {
      setErrors('Tous les champs et l’acceptation des conditions sont obligatoires.');
      return false;
    }
    if (!isValidAge(age)) {
      setErrors('Veuillez entrer un âge valide (entre 0 et 150).');
      return false;
    }
    if (!isValidPhoneNumber(numtel)) {
      setErrors('Veuillez entrer un numéro de téléphone valide.');
      return false;
    }
    if (motdepasse !== confirmMotDePasse) {
      setErrors('Les mots de passe ne correspondent pas.');
      return false;
    }

    setErrors('');
    return true;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // Envoyer la requête d'inscription
      const response = await apiClient.post('/utilisateurs/', {
        nom: formData.nom,
        prenom: formData.prenom,
        age: formData.age,
        username: formData.username,
        numtel: formData.numtel,
        motdepasse: formData.motdepasse,
        image: formData.image
      });

      if (response.status === 201) {
        setRequestStatus('Inscription réussie! Redirection vers la page de connexion...');
        setTimeout(() => {
          navigate('/login'); // Redirige vers la page de connexion après une inscription réussie
        }, 2000); // Délai de 2 secondes avant la redirection
      } else if (response.status === 409) {
        // Gérer spécifiquement le cas où le nom d'utilisateur est déjà pris
        setErrors('Le nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.');
      } else {
        setRequestStatus("Échec de l'inscription. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setRequestStatus("Une erreur s'est produite lors de l'inscription.");
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 mt-16 justify-center items-center"
      >
        <h3 className="text-5xl font-bold mb-5 text-primary flex justify-center gap-2 mx-auto">
          Inscrivez-vous
        </h3>

        {errors && <p className="text-red-600 mb-4">{errors}</p>}
        {requestStatus && (
          <p className={`mb-4 ${requestStatus.includes('réussie') ? 'text-green-600' : 'text-red-600'}`}>{requestStatus}</p>
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
            name="nom"
            type="text"
            className="grow"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
          />
        </label>

        <label className="bg-neutral input input-primary text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="prenom"
            type="text"
            className="grow"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
          />
        </label>

        <label className="bg-neutral input input-primary text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="numtel"
            type="text"
            className="grow"
            placeholder="Téléphone"
            value={formData.numtel}
            onChange={handleChange}
          />
        </label>

        <label className="bg-neutral input input-primary text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="age"
            type="number"
            className="grow"
            placeholder="Âge"
            value={formData.age}
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

        <label className="bg-neutral input input-primary text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="confirmMotDePasse"
            type="password"
            className="grow"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmMotDePasse}
            onChange={handleChange}
          />
        </label>

        <label className="block mb-2 text-primary font-bold">Photo de profil</label>
        <label className="bg-primary input input-neutral text-primary input-bordered flex items-center gap-2 my-3">
          <input
            name="image"
            type="file"
            className="file-input file-input-bordered file-input-primary text-neutral w-full"
            onChange={handleImageChange}
          />
        </label>

        <label className="flex items-center gap-2 mt-4 text-accent">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            className='checkbox checkbox-accent'
            onChange={handleChange}
            name="termsAccepted"
          />
          J'accepte les <a href="/terms" className="link link-primary">conditions d'utilisation</a>
        </label>

        <button
          type="submit"
          className="btn btn-lg btn-outline btn-primary flex items-center gap-2 my-6 mx-auto w-full"
          disabled={!formData.termsAccepted}
        >
          S'inscrire
        </button>

        <p className="text-primary">
          Déjà inscrit ?{' '}
          <Link className="link-accent" to="/login">
            Connectez-vous
          </Link>
        </p>
      </form>
    </div>
  );  
}

export default SignUpPage;