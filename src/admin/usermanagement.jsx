import { useEffect, useState } from 'react';
import apiClient from '../api'; // Assurez-vous que le chemin est correct

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/utilisateurs');
        setUsers(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleAdminStatus = async (id, estadmin) => {
    try {
      await apiClient.put(`/utilisateurs/${id}/estadmin`, { estadmin: !estadmin });
      setUsers(users.map(user => (user.idutilisateur === id ? { ...user, estadmin: !estadmin } : user)));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut admin:', err);
    }
  };

  const deleteUser = async id => {
    try {
      await apiClient.delete(`/utilisateurs/${id}`);
      setUsers(users.filter(user => user.idutilisateur !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

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
