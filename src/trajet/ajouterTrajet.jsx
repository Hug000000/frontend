import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';

function CreateTripPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    lieuDepart: '',
    lieuArrivee: '',
    dateDepart: '',
    heureDepart: '',
    dateArrivee: '',
    heureArrivee: '',
    placesDisponibles: '',
    voitureId: '',
    prix: '' // Ajout du champ prix
  });
  const [voitures, setVoitures] = useState([]);
  const [villes, setVilles] = useState([]);
  const [filteredVillesDepart, setFilteredVillesDepart] = useState([]);
  const [filteredVillesArrivee, setFilteredVillesArrivee] = useState([]);
  const [showSuggestionsDepart, setShowSuggestionsDepart] = useState(false);
  const [showSuggestionsArrivee, setShowSuggestionsArrivee] = useState(false);
  const [errors, setErrors] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les noms de villes et les voitures du propriétaire à l'initialisation du composant
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [villesResponse, voituresResponse] = await Promise.all([
          apiClient.get('/ville/'),
          apiClient.get('/voiture/par-proprietaire')
        ]);

        if (villesResponse.status === 200) {
          setVilles(villesResponse.data);
        }

        if (voituresResponse.status === 200 && Array.isArray(voituresResponse.data)) {
          setVoitures(voituresResponse.data);
        } else {
          setErrors("Erreur lors de la récupération des voitures.");
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setErrors("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fonction pour normaliser les chaînes de caractères (suppression des accents, conversion en minuscules)
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Gérer les changements dans la zone de saisie pour la ville de départ
  const handleVilleDepartChange = (e) => {
    const value = e.target.value;
    setFormData(prevState => ({ ...prevState, lieuDepart: value }));
    const normalizedValue = normalizeString(value);
    setFilteredVillesDepart(
      villes.filter((ville) => normalizeString(ville).includes(normalizedValue))
    );
    setShowSuggestionsDepart(true);
  };

  // Gérer les changements dans la zone de saisie pour la ville d'arrivée
  const handleVilleArriveeChange = (e) => {
    const value = e.target.value;
    setFormData(prevState => ({ ...prevState, lieuArrivee: value }));
    const normalizedValue = normalizeString(value);
    setFilteredVillesArrivee(
      villes.filter((ville) => normalizeString(ville).includes(normalizedValue))
    );
    setShowSuggestionsArrivee(true);
  };

  // Gérer la sélection d'une ville de départ
  const handleVilleDepartSelect = (ville) => {
    setFormData(prevState => ({ ...prevState, lieuDepart: ville }));
    setShowSuggestionsDepart(false);
  };

  // Gérer la sélection d'une ville d'arrivée
  const handleVilleArriveeSelect = (ville) => {
    setFormData(prevState => ({ ...prevState, lieuArrivee: ville }));
    setShowSuggestionsArrivee(false);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Valider les données du formulaire
  const validateForm = () => {
    const { description, lieuDepart, lieuArrivee, dateDepart, heureDepart, dateArrivee, heureArrivee, placesDisponibles, voitureId, prix } = formData;
    if (!description || !lieuDepart || !lieuArrivee || !dateDepart || !heureDepart || !dateArrivee || !heureArrivee || !placesDisponibles || !voitureId || !prix) {
      setErrors('Tous les champs sont obligatoires.');
      return false;
    }

    const depart = new Date(`${dateDepart}T${heureDepart}`);
    const arrivee = new Date(`${dateArrivee}T${heureArrivee}`);
    if (depart >= arrivee) {
      setErrors('La date et heure de départ doivent être antérieures à la date et heure d\'arrivée.');
      return false;
    }

    if (parseInt(placesDisponibles, 10) <= 0) {
      setErrors('Le nombre de places disponibles doit être positif.');
      return false;
    }

    if (parseFloat(prix) <= 0) {
      setErrors('Le prix doit être positif.');
      return false;
    }

    setErrors('');
    return true;
  };

  // Récupérer l'ID de la ville à partir de son nom
  const fetchVilleId = async (nomVille) => {
    try {
      const response = await apiClient.get(`/ville/${nomVille}`);
      if (response.status === 200) {
        return response.data.id;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'ID pour la ville '${nomVille}':`, error);
      throw new Error(`La ville '${nomVille}' n'existe pas.`);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const idvilledepart = await fetchVilleId(formData.lieuDepart);
      const idvillearrivee = await fetchVilleId(formData.lieuArrivee);

      const tripData = {
        description: formData.description,
        idvilledepart,
        idvillearrivee,
        dateDepart: formData.dateDepart,
        heureDepart: formData.heureDepart,
        dateArrivee: formData.dateArrivee,
        heureArrivee: formData.heureArrivee,
        prix: formData.prix,
        plaqueimatVoiture: formData.voitureId,
        placesDisponibles: formData.placesDisponibles
      };

      const response = await apiClient.post('/trajets/', tripData);
      if (response.status === 201) {
        setRequestStatus('Création du trajet réussie!');
        setTimeout(() => {
          navigate('/');
        }, 2000); // Redirige après 2 secondes
      } else {
        setRequestStatus("Échec de la création du trajet. Veuillez réessayer.");
      }
    } catch (error) {
      setErrors(error.message);
      if (error.response && error.response.status === 409) {
        setRequestStatus("Échec de la création du trajet : un trajet similaire existe déjà.");
      } else {
        setRequestStatus("Une erreur s'est produite lors de la création du trajet.");
      }    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-2xl px-20 py-10 mt-16 justify-center items-center"
      >
        <h3 className="text-5xl font-bold mb-8 text-primary flex justify-center gap-2 mx-auto">
          Créer un trajet
        </h3>

        {errors && <p className="text-red-600 mb-4">{errors}</p>}
        {requestStatus && (
          <p className={`mb-4 ${requestStatus.includes('réussie') ? 'text-green-600' : 'text-red-600'}`}>{requestStatus}</p>
        )}
        {loading && <p className="text-blue-600 mb-4">Chargement...</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-bold">Lieu de départ</label>
            <input
              name="lieuDepart"
              type="text"
              className="input w-full bg-secondary text-primary mb-6"
              placeholder="Lieu de départ"
              value={formData.lieuDepart}
              onChange={handleVilleDepartChange}
            />
            {showSuggestionsDepart && filteredVillesDepart.length > 0 && (
              <ul className="bg-neutral text-primary rounded-xl shadow-lg max-h-40 overflow-y-auto mt-1">
                {filteredVillesDepart.map((ville, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-accent"
                    onClick={() => handleVilleDepartSelect(ville)}
                  >
                    {ville}
                  </li>
                ))}
              </ul>
            )}

            <label className="block mb-2 text-sm font-bold">Date de départ</label>
            <input
              name="dateDepart"
              type="date"
              className="input bg-secondary text-primary w-full mb-6"
              value={formData.dateDepart}
              onChange={handleChange}
            />

            <label className="block mb-2 text-sm font-bold">Heure de départ</label>
            <input
              name="heureDepart"
              type="time"
              className="input bg-secondary text-primary w-full mb-6"
              value={formData.heureDepart}
              onChange={handleChange}
            />

            <div className="w-full flex flex-col">
              <label className="block mb-2 text-sm font-bold">Sélectionnez une voiture</label>
              <select
                name="voitureId"
                className="select bg-secondary w-full max-w-xs"
                value={formData.voitureId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une voiture</option>
                {voitures.map((voiture) => (
                  <option key={voiture.plaqueimat} value={voiture.plaqueimat}>
                    {voiture.marque} {voiture.modele} ({voiture.plaqueimat})
                  </option>
                ))}
              </select>
              <Link to="/ajouter-voiture" className="btn btn-primary mt-1 mb-5">Ajouter une Voiture</Link>

              <label className="block mb-2 text-sm font-bold">Prix</label>
              <input
                name="prix"
                type="number"
                className="input bg-secondary text-primary w-full max-w-xs mb-6"
                placeholder="Prix en euros"
                value={formData.prix}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold">Lieu d'arrivée</label>
            <input
              name="lieuArrivee"
              type="text"
              className="input bg-secondary text-primary w-full mb-6"
              placeholder="Lieu d'arrivée"
              value={formData.lieuArrivee}
              onChange={handleVilleArriveeChange}
            />
            {showSuggestionsArrivee && filteredVillesArrivee.length > 0 && (
              <ul className="bg-neutral text-primary rounded-xl shadow-lg max-h-40 overflow-y-auto mt-1">
                {filteredVillesArrivee.map((ville, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleVilleArriveeSelect(ville)}
                  >
                    {ville}
                  </li>
                ))}
              </ul>
            )}

            <label className="block mb-2 text-sm font-bold">Date d'arrivée</label>
            <input
              name="dateArrivee"
              type="date"
              className="input bg-secondary text-primary w-full mb-6"
              value={formData.dateArrivee}
              onChange={handleChange}
            />

            <label className="block mb-2 text-sm font-bold">Heure d'arrivée</label>
            <input
              name="heureArrivee"
              type="time"
              className="input bg-secondary text-primary w-full mb-6"
              value={formData.heureArrivee}
              onChange={handleChange}
            />

            <label className="block mb-2 text-sm font-bold">Nombre de places disponibles</label>
            <input
              name="placesDisponibles"
              type="number"
              className="input bg-secondary text-primary w-full max-w-xs mb-6"
              placeholder="Places disponibles"
              value={formData.placesDisponibles}
              onChange={handleChange}
            />

            <label className="block mb-2 mt-6 text-sm font-bold">Description</label>
            <textarea
              name="description"
              className="textarea bg-secondary text-primary w-full mb-6"
              placeholder="Description du trajet"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          Créer le trajet
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;