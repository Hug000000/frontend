import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import imagePartage from '/photoCovoiturage1.jpeg'; // Importation de l'image pour la section Partage
import imageRessource from '/photoCovoiturage2.jpg'; // Importation de l'image pour la section Ressource
import imageHaut from '/photoCovoiturage3.jpg'; // Importation de l'image pour la section Hero
import { FaMoneyBill } from "react-icons/fa"; // Importation de l'icône FaMoneyBill
import { FaLeaf } from "react-icons/fa"; // Importation de l'icône FaLeaf
import { AiFillThunderbolt } from "react-icons/ai"; // Importation de l'icône AiFillThunderbolt

// Composant pour la section Hero
function HeroSection() {
  const { isAuthenticated } = useAuth(); // Récupère le contexte d'authentification
  const navigate = useNavigate();

  // Fonction pour gérer les clics sur les boutons
  const handleClick = (path) => {
    if (isAuthenticated) {
      navigate(path); // Navigation vers le chemin spécifié si l'utilisateur est authentifié
    } else {
      navigate('/login'); // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
    }
  };

  return (
    <section className="relative w-full" style={{ backgroundImage: `url(${imageHaut})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', height: '75vh' }}>
      <div className="absolute bg-opacity-0 bottom-0 left-1/2 transform -translate-x-1/2 mb-10 w-full max-w-6xl">
        <div className="bg-primary rounded-2xl flex justify-center items-center relative w-full">
          <button
            onClick={() => handleClick('/rechercher-trajet')}
            className="btn btn-primary w-1/2 h-16 text-xl z-10"
          >
            Réserver un trajet
          </button>
          <div className="w-1 bg-white absolute left-1/2 transform -translate-x-1/2" style={{ height: '100%', zIndex: 30 }}></div>
          <button
            onClick={() => handleClick('/ajouter-trajet')}
            className="btn btn-primary w-1/2 h-16 text-xl z-10"
          >
            Proposer un trajet
          </button>
        </div>
      </div>
    </section>
  );
}

// Composant pour la section des fonctionnalités
function FeaturesSection() {
  return (
    <section className="bg-secondary pt-16">
      <h1 className="mb-4 text-6xl font-bold text-center">Voyagez en toute simplicité</h1>
      <div className="container mx-auto px-2 py-16">
        <div className="flex items-center justify-between">
          <div className="w-1/2 p-4 bg-opacity-0">
            <h3 className="text-4xl font-bold my-4">Partagez vos trajets</h3>
            <div className="pr-12 mt-4">
              <p className="text-xl text-gray-700">
                En rejoignant notre communauté, vous optez pour une manière de voyager qui enrichit votre vie sociale. Partagez plus qu'un trajet, partagez des expériences et créez des souvenirs ensemble. C'est l'esprit du covoiturage : connecter les gens, un trajet à la fois.
              </p>
            </div>
          </div>
          <div className="w-1/2 flex justify-end">
            <img src={imagePartage} alt="imagePartage" className="max-w-full h-auto rounded-xl" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-2 py-16">
        <div className="flex items-center justify-between">
          <div className="w-1/2 flex justify-start">
            <img src={imageRessource} alt="imagePartage" className="max-w-full h-auto rounded-xl" />
          </div>
          <div className="w-1/2 p-4 bg-opacity-0 pl-16">
            <h3 className="text-4xl font-bold my-4">Tout type de déplacement</h3>
            <div className="mt-4">
              <p className="text-xl text-gray-700">
                Plus qu'un simple moyen de rejoindre votre famille pendant les vacances, notre plateforme de covoiturage offre des solutions de mobilité quotidiennes. Que ce soit pour vous rendre au travail, à l'école ou pour tout autre trajet régulier, notre service vous aide à voyager de manière économique et écologique. Rejoignez notre communauté et transformez vos déplacements habituels en une expérience plus agréable et durable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant pour la section des icônes
function IconSection() {
  return (
    <div className="bg-secondary p-5">
      <div className="flex justify-around items-stretch px-4">
        <div className="flex flex-col mx-4 w-1/3">
          <FaMoneyBill className="text-6xl mb-2 mx-auto text-primary" />
          <div className="collapse bg-base-200 collapse-arrow mx-4">
            <input type="checkbox" className="peer" /> 
            <div className="text-xl collapse-title bg-accent text-accent-content peer-checked:bg-primary peer-checked:text-primary-content">
              Économisez sur vos trajets
            </div>
            <div className="collapse-content bg-accent text-accent-content peer-checked:bg-primary peer-checked:text-primary-content"> 
              <p className="text-lg">
                Partager un trajet réduit les frais de déplacement pour tous. En utilisant le covoiturage, non seulement vous divisez les coûts de l'essence et du péage, mais vous contribuez également à amortir les dépenses liées à l'entretien de votre véhicule.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-4 w-1/3">
          <FaLeaf className="text-6xl mb-2 mx-auto text-primary" />
          <div className="collapse bg-base-200 collapse-arrow mx-4">
            <input type="checkbox" className="peer" /> 
            <div className="text-xl collapse-title bg-accent text-accent-content peer-checked:bg-primary peer-checked:text-primary-content">
              Réduisez l'empreinte carbone
            </div>
            <div className="collapse-content bg-accent text-accent-content peer-checked:bg-primary peer-checked:text-primary-content"> 
              <p className="text-lg">
                Choisir le covoiturage c'est participer activement à la diminution des émissions de CO2. Moins de voitures sur la route signifie moins de pollution et une meilleure qualité de l'air pour nous tous.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-4 w-1/3">
          <AiFillThunderbolt className="text-6xl mb-2 mx-auto text-primary" />
          <div className="collapse bg-base-200 collapse-arrow mx-4">
            <input type="checkbox" className="peer" /> 
            <div className="text-xl collapse-title bg-accent text-accent-content peer-checked:bg-primary peer-checked:text-primary-content">
              Un clic pour voyager
            </div>
            <div className="collapse-content bg-accent text-accent-content peer-checked:bg-primary peer-checked:text-primary-content"> 
              <p className="text-lg">
                Notre plateforme rend le covoiturage simple et rapide. Trouvez facilement un trajet correspondant à votre itinéraire, réservez en quelques clics et partez à l'aventure sans complication !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal pour la page d'accueil
function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <IconSection />
    </>
  );
}

export default Home;