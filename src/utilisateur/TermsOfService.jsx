import { useNavigate } from 'react-router-dom';

function TermsOfService() {

    const navigate = useNavigate(); // Hook pour naviguer

    // Fonction pour retourner à la page précédente
    const goBack = () => {
        navigate(-1); // Retourne à la page précédente
    };

    return (
      <div className="bg-secondary flex justify-center items-center overflow-auto">
        <div className="bg-neutral text-primary p-8 rounded-2xl w-full max-w-7xl px-20 py-10 my-24">        
          <h1>Conditions Générales d'Utilisation</h1>
          <p className="mb-4">Merci de choisir notre plateforme de covoiturage. L'utilisation de notre service est régie par les conditions générales suivantes. En accédant à notre site et en utilisant nos services, vous confirmez accepter ces conditions et vous engagez à les respecter.</p>
      
          <h2><strong>Acceptation des Conditions</strong></h2>
          <p className="mb-4">En utilisant ce site, vous acceptez d'être lié par ces conditions générales, qui entrent en vigueur immédiatement dès votre première utilisation du site. Si vous n'acceptez pas les termes stipulés, veuillez ne pas accéder, utiliser et/ou contribuer au site.</p>
      
          <h2><strong>Modifications des Conditions</strong></h2>
          <p className="mb-4">Nous nous réservons le droit de changer ces conditions à tout moment en publiant des modifications en ligne. Votre utilisation continue de ce site après les publications de modifications constitue votre acceptation de cet accord modifié.</p>
      
          <h2><strong>Utilisation du Service</strong></h2>
          <p className="mb-4">Vous vous engagez à utiliser ce site uniquement pour des fins légales, et de manière à ne pas porter atteinte aux droits, restreindre ou inhiber l'utilisation et la jouissance du site par toute autre personne.</p>
      
          <h2><strong>Sécurité et Comportement</strong></h2>
          <p className="mb-4">Vous êtes responsable de la sécurité de votre compte et de la confidentialité de votre mot de passe et des informations de votre compte. Le comportement de chaque conducteur et passager doit être responsable et conforme aux lois de la circulation routière.</p>
      
          <h2><strong>Assurances et Responsabilités</strong></h2>
          <p className="mb-4">Chaque conducteur doit s'assurer d'être couvert par une assurance adéquate couvrant tous les aspects de la conduite et du covoiturage légal. Notre plateforme ne se tient pas responsable des incidents pouvant survenir pendant un covoiturage.</p>
      
          <h2><strong>Respect de la Vie Privée et des Données Personnelles</strong></h2>
          <p className="mb-4">Nous nous engageons à protéger votre vie privée. Les informations personnelles collectées par notre site sont utilisées pour le bon fonctionnement des services et pour vous informer des mises à jour ou autres opportunités liées à nos services. Ces informations ne seront pas partagées avec des tiers sans votre accord explicite, sauf dans le cadre requis par la loi.</p>
            
          <h2><strong>Limitation de Responsabilité</strong></h2>
          <p className="mb-4">Notre plateforme n'assure pas la vérification des antécédents des utilisateurs et ne garantit pas la précision des informations fournies par les utilisateurs. Nous ne sommes pas responsables des actes ou omissions des utilisateurs de notre plateforme.</p>
      
          <h2><strong>Dispositions Générales</strong></h2>
          <p className="mb-4">Si une partie de ces conditions est déterminée comme illégale, invalide ou autrement inapplicable, alors cette partie sera séparée et supprimée de ces conditions, tandis que les autres dispositions continueront d'être applicables et en vigueur.</p>
      
          <h2><strong>Contact</strong></h2>
          <p className="mb-4">Pour toute question relative à ces conditions d'utilisation, ou si vous avez des questions ou des plaintes concernant notre service, veuillez nous contacter à [personneneNeLiraJamaisCesConditionsdUtilisationEnEntier@gmail.com]</p>
          <button 
            onClick={goBack}
            className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
          >
            Retourner sur la page précédente
          </button>
        </div>
      </div>
    );
}
  
export default TermsOfService;
