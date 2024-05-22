import { useEffect, useState } from 'react';
import apiClient from '../api';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    username: '',
    numtel: '',
    photo: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '', // Nouveau champ de confirmation
  });
  const [newPhoto, setNewPhoto] = useState(null);

  // Charger les données utilisateur
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await apiClient.get('/utilisateurs/informationsWithPassword');
        if (response.status === 200) {
          setUserData(response.data);
          setFormData({
            nom: response.data.nom,
            prenom: response.data.prenom,
            age: response.data.age,
            username: response.data.username,
            numtel: response.data.numtel,
            photo: response.data.photo.image || '',
          });
        } else {
          setError('Impossible de récupérer les informations.');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des informations.');
        console.error(err);
      }
    }
    fetchUserData();
  }, []);

  // Fonction de validation pour l'âge
  const isValidAge = (age) => {
    const num = parseInt(age, 10);
    return !isNaN(num) && num >= 0 && num <= 150;
  };

  // Fonction de validation pour le numéro de téléphone
  const isValidPhoneNumber = (numtel) => {
    // Regex pour format international (à ajuster selon les besoins)
    const phoneRegex = /^\+?\d{8,15}$/;
    return phoneRegex.test(numtel);
  };

  // Gestion des changements pour le formulaire d'édition
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion des changements pour le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Gestion des changements pour la nouvelle photo
  const handlePhotoChange = (e) => {
    setNewPhoto(e.target.files[0]);
  };
  // Validation des données utilisateur
  const validateFormData = () => {
    if (!isValidAge(formData.age)) {
      setFormError('Veuillez entrer un âge valide (entre 0 et 150).');
      return false;
    }
    if (!isValidPhoneNumber(formData.numtel)) {
      setFormError('Veuillez entrer un numéro de téléphone valide.');
      return false;
    }
    setFormError('');
    return true;
  };

  // Mise à jour des informations utilisateur
  const updateUserData = async () => {
    if (!validateFormData()) return; // Utilise les validations d'âge et de numéro de téléphone déjà définies
  
    try {
      const response = await apiClient.put('/utilisateurs/informations', formData);
  
      if (response.status === 200) {
        setUserData(response.data);
        setFormError('');
        setEditMode(false);
      } else {
        setFormError("Impossible de mettre à jour les informations.");
      }
    } catch (err) {
      setFormError("Erreur lors de la mise à jour des informations.");
      console.error(err);
    }
  };  

  // Validation et mise à jour du mot de passe
  const validateAndUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await apiClient.put('/utilisateurs/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.status === 200) {
        setPasswordMode(false);
      } else {
        setError('Impossible de mettre à jour le mot de passe.');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du mot de passe.');
      console.error(err);
    }
  };

// Mise à jour de la photo de profil
const updatePhoto = async () => {
  if (!newPhoto) {
    setFormError('Aucune nouvelle photo sélectionnée.');
    return;
  }

  // Fonction pour convertir un fichier en base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  try {
    // Convertir le fichier en base64
    const base64Image = await fileToBase64(newPhoto);

    // Préparer les données JSON
    const payload = { image: base64Image };

    // Envoyer la requête PUT au serveur avec les données JSON
    const response = await apiClient.put('/utilisateurs/photo', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      setUserData({ ...userData, photo: { image: response.data.image } });
      setFormError('');
      setPhotoMode(false);
    } else {
      setFormError("Impossible de mettre à jour la photo.");
    }
  } catch (err) {
    setFormError("Erreur lors de la mise à jour de la photo.");
    console.error(err);
  }
};


  // Afficher un message en cas d'erreur
  if (error) {
    return (
      <div className="bg-secondary h-screen flex justify-center items-center">
        <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Si les données utilisateur ne sont pas encore chargées
  if (!userData) {
    return (
      <div className="bg-secondary h-screen flex justify-center items-center">
        <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary-content p-8 rounded-2xl w-full max-w-2xl px-20 py-10 justify-center items-center">
        <h2 className="text-4xl font-bold mb-4 text-primary">Mes Informations</h2>
        {formError && <div className="text-red-600 mb-4">{formError}</div>}
        
        {editMode ? (
          // Mode modification des informations
          <form className="flex flex-col gap-4">
            <label>
              <span className="text-primary">Nom:</span>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="bg-neutral input input-primary text-primary input-bordered w-full mt-1" />
            </label>
            <label>
              <span className="text-primary">Prénom:</span>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="bg-neutral input input-primary text-primary input-bordered w-full mt-1" />
            </label>
            <label>
              <span className="text-primary">Âge:</span>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="bg-neutral input input-primary text-primary input-bordered w-full mt-1" />
            </label>
            <label>
              <span className="text-primary">Nom d'utilisateur:</span>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="bg-neutral input input-primary text-primary input-bordered w-full mt-1" />
            </label>
            <label>
              <span className="text-primary">Téléphone:</span>
              <input type="text" name="numtel" value={formData.numtel} onChange={handleChange} className="bg-neutral input input-primary text-primary input-bordered w-full mt-1" />
            </label>
            <button type="button" onClick={updateUserData} className="btn btn-primary mt-4">Enregistrer</button>
            <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary mt-4">Annuler</button>
          </form>
        ) : passwordMode ? (
          // Mode modification du mot de passe
          <form className="flex flex-col gap-4">
            <label>
              <span className="text-primary">Ancien Mot de Passe:</span>
              <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="input input-bordered w-full mt-1 bg-neutral text-primary" />
            </label>
            <label>
              <span className="text-primary">Nouveau Mot de Passe:</span>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="input input-bordered w-full mt-1 bg-neutral text-primary" />
            </label>
            <label>
              <span className="text-primary">Confirmer le Nouveau Mot de Passe:</span>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="input input-bordered w-full mt-1 bg-neutral text-primary" />
            </label>
            <button type="button" onClick={validateAndUpdatePassword} className="btn btn-primary mt-4">Enregistrer le Mot de Passe</button>
            <button type="button" onClick={() => setPasswordMode(false)} className="btn btn-secondary mt-4">Annuler</button>
          </form>
        ) : photoMode ? (
          // Mode modification de la photo
          <form className="flex flex-col gap-4">
            <label>
              <span className="text-primary">Nouvelle Photo:</span>
              <input type="file" name="photo" onChange={handlePhotoChange} className="file-input file-input-bordered file-input-primary bg-neutral text-primary w-full mt-1" />
            </label>
            <button type="button" onClick={updatePhoto} className="btn btn-primary mt-4">Enregistrer la Photo</button>
            <button type="button" onClick={() => setPhotoMode(false)} className="btn btn-secondary mt-4">Annuler</button>
          </form>
        ) : (
          // Mode affichage des informations
          <>
            <p className='text-primary'><strong>Nom:</strong> {userData.nom}</p>
            <p className='text-primary'><strong>Prénom:</strong> {userData.prenom}</p>
            <p className='text-primary'><strong>Âge:</strong> {userData.age}</p>
            <p className='text-primary'><strong>Nom d'utilisateur:</strong> {userData.username}</p>
            <p className='text-primary'><strong>Téléphone:</strong> {userData.numtel}</p>
            <p className='text-primary'><strong>Mot de passe:</strong> ******</p>
            {userData.photo && userData.photo.image && (
              <div>
                <strong className='text-primary'>Photo:</strong>
                <img src={userData.photo.image} alt="Photo de profil" className="max-w-xs max-h-xs mt-2 rounded-lg shadow" />
              </div>
            )}
            <div className="flex flex-col gap-4 mt-4">
              <button type="button" onClick={() => setEditMode(true)} className="btn btn-primary">Modifier les Informations</button>
              <button type="button" onClick={() => setPasswordMode(true)} className="btn btn-primary">Modifier le Mot de Passe</button>
              <button type="button" onClick={() => setPhotoMode(true)} className="btn btn-primary">Modifier la Photo</button>
            </div>
          </>
        )}
      </div>
    </div>
  );  
}

export default Profile;