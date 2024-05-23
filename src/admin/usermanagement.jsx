import { useEffect, useState } from 'react';
import apiClient from '../api';

// Composant pour la gestion des utilisateurs
const UserManagement = () => {
  // États pour stocker les utilisateurs, l'état de chargement et les erreurs
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect pour récupérer les utilisateurs lorsque le composant est monté
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Récupère les utilisateurs depuis l'API
        const response = await apiClient.get('/utilisateurs');
        // Met à jour l'état avec les données récupérées
        setUsers(response.data);
      } catch (err) {
        // En cas d'erreur, met à jour l'état de l'erreur
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        // Indique que le chargement est terminé
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fonction pour basculer le statut admin d'un utilisateur
  const toggleAdminStatus = async (id, estadmin) => {
    try {
      // Envoie une requête pour mettre à jour le statut admin
      await apiClient.put(`/utilisateurs/${id}/estadmin`, { estadmin: !estadmin });
      // Met à jour l'état des utilisateurs localement
      setUsers(users.map(user => (user.idutilisateur === id ? { ...user, estadmin: !estadmin } : user)));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut admin:', err);
    }
  };

  // Fonction pour supprimer un utilisateur
  const deleteUser = async id => {
    try {
      // Envoie une requête pour supprimer l'utilisateur
      await apiClient.delete(`/utilisateurs/${id}`);
      // Met à jour l'état des utilisateurs localement
      setUsers(users.filter(user => user.idutilisateur !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    }
  };

  // Affiche un spinner de chargement si les données sont en cours de chargement
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  // Affiche une alerte d'erreur si une erreur s'est produite lors de la récupération des utilisateurs
  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  // Rendu du composant
  return (
    <div className="bg-secondary min-h-screen flex justify-center items-center">
      <div className="bg-neutral text-primary p-8 rounded-xl w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestion des utilisateurs</h1>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Username</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Age</th>
                <th>Photo</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.idutilisateur}>
                  <td>{user.username}</td>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.age}</td>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user.photo.image} alt="user" />
                      </div>
                    </div>
                  </td>
                  <td>{user.estadmin ? 'Oui' : 'Non'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={() => toggleAdminStatus(user.idutilisateur, user.estadmin)}
                    >
                      {user.estadmin ? 'Retirer Admin' : 'Rendre Admin'}
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => deleteUser(user.idutilisateur)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;