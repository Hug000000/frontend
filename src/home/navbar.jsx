import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import logo from '/logoSansFond.png'; // Assurez-vous que le chemin est correct

function Navbar() {
  const { isAuthenticated, logout, isAdmin } = useAuth(); // Récupère le contexte d'authentification

  return (
    <div className="navbar bg-custom-white h-12 fixed top-0 w-full z-50">
      <div className="navbar-start">
        <img src={logo} alt="logo" className="mr-2" style={{ height: '60px' }} />
        <Link to="/" className="btn btn-ghost text-xl link-primary">CovoiTech</Link>
      </div>
      <div className="navbar-end">
        {isAuthenticated ? ( // Vérifie si l'utilisateur est authentifié
          <>
            {isAdmin && ( // Vérifie si l'utilisateur est un administrateur
              <Link to="/admin/users" className="btn btn-error link-neutral mx-1">Admin Mode</Link>
            )}
            <div className="dropdown dropdown-hover">
              <button tabIndex={0} role="button" className="btn btn-primary link-neutral m-1">Mon profil</button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box w-52">
                <li className="mb-1"><Link to="/profile" className="btn btn-primary link-neutral">Mes informations</Link></li>
                <li className="mb-1"><Link to="/mesvoitures" className="btn btn-primary link-neutral">Mes voitures</Link></li>
                <li className="mb-1"><Link to="/mestrajets" className="btn btn-primary link-neutral">Mes trajets</Link></li>
                <li className="mb-1"><Link to="/mesavis" className="btn btn-primary link-neutral">Mes avis</Link></li>
                <li><Link to="/supprimerCompte" className="btn btn-primary link-neutral">Supprimer mon compte</Link></li>
              </ul>
            </div>
            <button onClick={logout} className="btn btn-primary link-neutral">Déconnexion</button> {/* Bouton pour déconnecter l'utilisateur */}
          </>
        ) : ( // Si l'utilisateur n'est pas authentifié
          <>
            <Link to="/signup" className="btn btn-primary link-neutral mx-1">Inscription</Link> {/* Lien vers la page d'inscription */}
            <Link to="/login" className="btn btn-primary link-neutral mx-1">Connexion</Link> {/* Lien vers la page de connexion */}
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;