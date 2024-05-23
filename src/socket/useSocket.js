import { useEffect } from 'react';
import { io } from 'socket.io-client';

// Hook personnalisé pour gérer la connexion WebSocket et les événements
const useSocket = (eventHandlers) => {
  useEffect(() => {
    // URL du serveur WebSocket définie dans les variables d'environnement
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    
    // Initialisation de la connexion WebSocket avec certaines options
    const socket = io(socketUrl, {
      withCredentials: true, // Envoi des informations d'identification (cookies) avec la requête WebSocket
      transports: ['websocket'], // Utilisation du transport WebSocket uniquement
    });

    // Gestion des événements de connexion et d'erreur
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    // Ajout des gestionnaires d'événements fournis dans `eventHandlers`
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Nettoyage à la désactivation du composant ou du changement des `eventHandlers`
    return () => {
      // Suppression des gestionnaires d'événements
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      // Déconnexion du socket
      socket.disconnect();
    };
  }, [eventHandlers]); // Dépendances : `eventHandlers` (re-crée l'effet si ces derniers changent)
};

export default useSocket;
