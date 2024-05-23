import { useState } from 'react';
import toast from 'react-hot-toast'; // Importation pour afficher des notifications toast
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import apiClient from '../api';

const SearchPage = () => {
  // États pour gérer les entrées de l'utilisateur et les résultats de recherche
  const [dateDepart, setDateDepart] = useState('');
  const [villeDepart, setVilleDepart] = useState('');
  const [villeArrivee, setVilleArrivee] = useState('');
  const [trajets, setTrajets] = useState([]);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false); // Nouvel état pour suivre si une recherche a été effectuée
  const navigate = useNavigate();

  // Fonction pour récupérer l'ID d'une ville
  const fetchVilleId = async (ville) => {
    if (!ville) return null; // Retourne null si aucune ville n'est fournie
    try {
      const response = await apiClient.get(`/ville/${ville}`);
      if (!response.data) {
        throw new Error('Problème de recherche de ville');
      }
      return response.data.id;
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
      return null;
    }
  };

  // Fonction pour gérer la recherche de trajets
  const handleSearch = async () => {
    setError(''); // Effacer les erreurs précédentes
    setSearchPerformed(false); // Réinitialiser l'état de recherche effectuée
    const idVilleDepart = await fetchVilleId(villeDepart);
    const idVilleArrivee = await fetchVilleId(villeArrivee);

    let query = `/trajets/search?`;
    if (dateDepart) query += `dateDepart=${dateDepart}&`;
    if (idVilleDepart) query += `villeDepart=${idVilleDepart}&`;
    if (idVilleArrivee) query += `villeArrivee=${idVilleArrivee}`;

    try {
      const response = await apiClient.get(query);
      if (response.data) {
        setTrajets(response.data);
        setSearchPerformed(true); // Indiquer que la recherche a été effectuée
      } else {
        throw new Error('Aucun trajet trouvé');
      }
    } catch (error) {
      setError('Erreur lors de la récupération des trajets');
      toast.error(error.message);
      setSearchPerformed(true); // Indiquer que la recherche a été effectuée même s'il y a une erreur
    }
  };

  // Fonction pour afficher les trajets
  const renderTrajets = (trajets) => (
    trajets.map(trajet => (
      <div key={trajet.idtrajet} className="card bg-base-100 shadow-xl p-4 m-4 cursor-pointer hover:bg-base-300"
           onClick={() => navigate(`/trajet/${trajet.idtrajet}`)}>
        <h3 className="card-title">{trajet.description}</h3>
        <p>De {trajet.villedepart.nom} à {trajet.villearrivee.nom}</p>
        <p>Date de départ: {format(new Date(trajet.heuredepart), 'PPpp')}</p>
        <p>Date d'arrivée: {format(new Date(trajet.heurearrivee), 'PPpp')}</p>
      </div>
    ))
  );

  return (
    <div className="bg-secondary min-h-screen flex justify-center items-center py-60">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        <h1 className="text-4xl text-primary font-bold mb-4">Recherche de Trajets</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="form-control">
          <label className="block mb-2 text-md text-primary font-bold mt-6">Date de départ</label>
          <input
            type="date"
            className="input input-bordered bg-primary"
            value={dateDepart}
            onChange={(e) => setDateDepart(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="block mb-2 text-md text-primary font-bold mt-6">Ville de départ</label>
          <input
            type="text"
            className="input input-bordered bg-primary"
            placeholder="Entrez la ville de départ"
            value={villeDepart}
            onChange={(e) => setVilleDepart(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="block mb-2 text-md text-primary font-bold mt-6">Ville d'arrivée</label>
          <input
            type="text"
            className="input input-bordered bg-primary"
            placeholder="Entrez la ville d'arrivée"
            value={villeArrivee}
            onChange={(e) => setVilleArrivee(e.target.value)}
          />
        </div>
        <div className="form-control mt-20">
          <button className="btn btn-accent" onClick={handleSearch}>
            Rechercher
          </button>
        </div>
        <div>
          {searchPerformed && trajets.length === 0 && (
            <div className="mt-4">
              <h2 className="text-2xl text-accent mx-auto text-center font-semibold">Aucun trajet trouvé</h2>
            </div>
          )}
          {trajets.length > 0 && (
            <div className="mt-4">
              <h2 className="text-4xl text-primary mt-20 font-semibold">Résultats:</h2>
              <ul>
                {renderTrajets(trajets)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;