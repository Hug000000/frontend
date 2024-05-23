import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utilisateur/authContext.jsx';
import SignUp from './utilisateur/signUp.jsx';
import Login from './utilisateur/login.jsx';
import Navbar from './home/navbar.jsx';
import Profile from './utilisateur/profile.jsx';
import Mesvoitures from './voiture/mesvoitures.jsx';
import Mestrajets from './trajet/mestrajets.jsx';
import SupprimerCompte from './utilisateur/supprimerCompte.jsx';
import ModifierVoiture from './voiture/modifierVoiture.jsx';
import AjouterVoiture from './voiture/ajouterVoiture.jsx';
import ConfirmerSuppressionVoiture from './voiture/confirmerSuppressionVoiture.jsx';
import TermsOfService from './utilisateur/TermsOfService.jsx';
import Footer from "./home/footer.jsx";
import Home from './home/home.jsx';
import TravelForm from './trajet/ajouterTrajet.jsx';
import TrajetDetails from './trajet/trajetdetail.jsx';
import SearchPage from './trajet/searchtrajet.jsx';
import UserManagement from './admin/usermanagement.jsx';
import AvisSurUtilisateur from './avis/avisutilisateur';
import Rating from './avis/ajouteravis.jsx';
import MesAvis from './avis/mesavis.jsx';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState('themeCovoit');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'themeCovoit';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'themeCovoit' ? 'themeCovoitdark' : 'themeCovoit';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <AuthProvider>
      <Router>
        <div className='h-screen' data-theme={theme}>
          <Navbar />
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mesvoitures" element={<Mesvoitures />} />
            <Route path="/mestrajets" element={<Mestrajets />} />
            <Route path="/supprimerCompte" element={<SupprimerCompte />} />
            <Route path="/modifier-voiture/:plaqueimat" element={<ModifierVoiture />} />
            <Route path="/ajouter-voiture" element={<AjouterVoiture />} />
            <Route path="/confirmer-suppression-voiture/:plaqueimat" element={<ConfirmerSuppressionVoiture />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/ajouter-trajet" element={<TravelForm />} />
            <Route path="/trajet/:trajetId" element={<TrajetDetails />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/rechercher-trajet" element={<SearchPage />} />
            <Route path="/avis-utilisateur/:destinataireId" element={<AvisSurUtilisateur />} />
            <Route path="/noter/:userId" element={<Rating />} />
            <Route path="/mesavis" element={<MesAvis />} />
            <Route path="/" element={<Home />} />
          </Routes>
          <Footer toggleTheme={toggleTheme} theme={theme} /> {/* Assurez-vous de passer les props */}
        </div>
      </Router> 
    </AuthProvider>
  );
}

export default App;