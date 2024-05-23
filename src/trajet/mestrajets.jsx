import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import apiClient from '../api.jsx';

const MesTrajets = () => {
  const [trajetsConducteur, setTrajetsConducteur] = useState({ passes: [], aVenir: [] });
  const [trajetsPassager, setTrajetsPassager] = useState({ passes: [], aVenir: [] });
  const navigate = useNavigate();

  // Utiliser useEffect pour récupérer les trajets lorsque le composant est monté
  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        // Récupérer les trajets où l'utilisateur est conducteur
        const { data: trajetsConduite } = await apiClient.get('/trajets/conducteur');
        // Récupérer les trajets où l'utilisateur est passager
        const { data: trajetsPassage } = await apiClient.get('/trajets/passager');

        const now = new Date().getTime(); // Obtenir l'heure actuelle en millisecondes

        // Filtrer les trajets passés et à venir pour le conducteur
        const passesConducteur = trajetsConduite.filter(t => new Date(t.heuredepart).getTime() < now);
        const aVenirConducteur = trajetsConduite.filter(t => new Date(t.heuredepart).getTime() >= now);

        // Filtrer les trajets passés et à venir pour le passager
        const passesPassager = trajetsPassage.filter(t => new Date(t.heuredepart).getTime() < now);
        const aVenirPassager = trajetsPassage.filter(t => new Date(t.heuredepart).getTime() >= now);

        // Mettre à jour l'état avec les trajets filtrés
        setTrajetsConducteur({ passes: passesConducteur, aVenir: aVenirConducteur });
        setTrajetsPassager({ passes: passesPassager, aVenir: aVenirPassager });
      } catch (error) {
        console.error('Erreur lors de la récupération des trajets:', error);
      }
    };

    fetchTrajets();
  }, []);

  // Fonction pour afficher les trajets
  const renderTrajets = (trajets) => (
    trajets.map(trajet => (
      <div key={trajet.idtrajet} className="card bg-base-100 shadow-xl p-4 m-4 cursor-pointer hover:bg-base-300"
           onClick={() => navigate(`/trajet/${trajet.idtrajet}`)}>
        <h3 className="card-title">{trajet.description}</h3>
        <p>De {trajet.villedepart} à {trajet.villearrivee}</p>
        <p>Date de départ: {format(new Date(trajet.heuredepart), 'PPpp')}</p>
      </div>
    ))
  );

  return (
    <div className="bg-secondary min-h-screen flex justify-center items-center py-60">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-4xl px-20 py-10 justify-center items-center">
        <h2 className="text-4xl font-bold mb-4 text-primary pb-12">Mes Trajets</h2>
        <div className="collapse collapse-arrow border border-primary bg-primary my-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Trajets conducteur
          </div>
          <div className="collapse-content">
            <div className="collapse collapse-arrow border border-accent bg-accent my-4">
              <input type="checkbox" />
              <div className="collapse-title text-primary text-xl font-medium">
                Trajets passés
              </div>
              <div className="collapse-content">
                {renderTrajets(trajetsConducteur.passes)}
              </div>
            </div>
            <div className="collapse collapse-arrow border border-accent bg-accent my-4">
              <input type="checkbox" />
              <div className="collapse-title text-primary text-xl font-medium">
                Trajets à venir
              </div>
              <div className="collapse-content">
                {renderTrajets(trajetsConducteur.aVenir)}
              </div>
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow border border-primary bg-primary my-4">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Trajets passager
          </div>
          <div className="collapse-content">
            <div className="collapse collapse-arrow border border-accent bg-accent my-4">
              <input type="checkbox" />
              <div className="collapse-title text-primary text-xl font-medium">
                Trajets passés
              </div>
              <div className="collapse-content">
                {renderTrajets(trajetsPassager.passes)}
              </div>
            </div>
            <div className="collapse collapse-arrow border border-accent bg-accent my-4">
              <input type="checkbox" />
              <div className="collapse-title text-primary text-xl font-medium">
                Trajets à venir
              </div>
              <div className="collapse-content">
                {renderTrajets(trajetsPassager.aVenir)}
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-lg mt-10" onClick={() => navigate('/ajouter-trajet')}>Créer un trajet</button>
      </div>
    </div>
  );
};

export default MesTrajets;