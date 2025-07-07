
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

// Enhanced translation dictionary with more comprehensive coverage
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'Home': 'Home',
    'Marketplace': 'Marketplace',
    'Sell Items': 'Sell Items',
    'Crypto Exchange': 'Crypto Exchange',
    'Messages': 'Messages',
    'Forum': 'Forum',
    'Settings': 'Settings',
    'Profile': 'Profile',
    'Wallet': 'Wallet',
    'Friends': 'Friends',
    
    // Profile Hub
    'Profile Hub': 'Profile Hub',
    'Loading profile...': 'Loading profile...',
    'Edit': 'Edit',
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Username': 'Username',
    'Bio': 'Bio',
    'Your username': 'Your username',
    'Add your bio': 'Add your bio',
    'Tell us about yourself': 'Tell us about yourself',
    'Member since': 'Member since',
    'Crypto Wallet': 'Crypto Wallet',
    '0x... your wallet address': '0x... your wallet address',
    'Account Settings': 'Account Settings',
    'Account Email': 'Account Email',
    'Loading...': 'Loading...',
    'Private - never shown to other users': 'Private - never shown to other users',
    'Email Notifications': 'Email Notifications',
    'Updates about transactions and messages': 'Updates about transactions and messages',
    'Two-Factor Authentication': 'Two-Factor Authentication',
    'Extra security for your account': 'Extra security for your account',
    
    // Home Page
    'The premier digital marketplace for gift cards, game accounts, and premium subscriptions': 'The premier digital marketplace for gift cards, game accounts, and premium subscriptions',
    'Browse Marketplace': 'Browse Marketplace',
    'Start Selling': 'Start Selling',
    'Search digital items...': 'Search digital items...',
    'Why Choose SKID HAVEN?': 'Why Choose SKID HAVEN?',
    'Secure Trading': 'Secure Trading',
    'Protected transactions': 'Protected transactions',
    'Instant Delivery': 'Instant Delivery',
    'Digital items in minutes': 'Digital items in minutes',
    'Trusted Community': 'Trusted Community',
    'Verified traders': 'Verified traders',
    'Privacy First': 'Privacy First',
    'Encrypted & secure': 'Encrypted & secure',
    'Multiple Payments': 'Multiple Payments',
    'Crypto, PayPal & more': 'Crypto, PayPal & more',
    'Reputation System': 'Reputation System',
    'Verified sellers': 'Verified sellers',
    'Popular Categories': 'Popular Categories',
    'Gift Cards': 'Gift Cards',
    'Game Accounts': 'Game Accounts',
    'Premium Subs': 'Premium Subs',
    'Digital Content': 'Digital Content',
    '0 items': '0 items',
    'Ready to Start Trading?': 'Ready to Start Trading?',
    'Join our community of digital traders': 'Join our community of digital traders',
    'Join Community': 'Join Community',
    'Start Chatting': 'Start Chatting',
    'Active Users': 'Active Users',
    'Items Sold': 'Items Sold',
    'Transactions': 'Transactions',
    'Success Rate': 'Success Rate',
    
    // Auth
    'Login': 'Login',
    'Sign Up': 'Sign Up',
    'Sign Out': 'Sign Out',
  },
  es: {
    // Navigation
    'Home': 'Inicio',
    'Marketplace': 'Mercado',
    'Sell Items': 'Vender',
    'Crypto Exchange': 'Intercambio Crypto',
    'Messages': 'Mensajes',
    'Forum': 'Foro',
    'Settings': 'Configuración',
    'Profile': 'Perfil',
    'Wallet': 'Billetera',
    'Friends': 'Amigos',
    
    // Profile Hub
    'Profile Hub': 'Centro de Perfil',
    'Loading profile...': 'Cargando perfil...',
    'Edit': 'Editar',
    'Cancel': 'Cancelar',
    'Save': 'Guardar',
    'Username': 'Nombre de usuario',
    'Bio': 'Biografía',
    'Your username': 'Tu nombre de usuario',
    'Add your bio': 'Añade tu biografía',
    'Tell us about yourself': 'Cuéntanos sobre ti',
    'Member since': 'Miembro desde',
    'Crypto Wallet': 'Billetera Crypto',
    '0x... your wallet address': '0x... tu dirección de billetera',
    'Account Settings': 'Configuración de Cuenta',
    'Account Email': 'Email de Cuenta',
    'Loading...': 'Cargando...',
    'Private - never shown to other users': 'Privado - nunca mostrado a otros usuarios',
    'Email Notifications': 'Notificaciones por Email',
    'Updates about transactions and messages': 'Actualizaciones sobre transacciones y mensajes',
    'Two-Factor Authentication': 'Autenticación de Dos Factores',
    'Extra security for your account': 'Seguridad adicional para tu cuenta',
    
    // Home Page
    'The premier digital marketplace for gift cards, game accounts, and premium subscriptions': 'El mercado digital principal para tarjetas de regalo, cuentas de juego y suscripciones premium',
    'Browse Marketplace': 'Explorar Mercado',
    'Start Selling': 'Comenzar a Vender',
    'Search digital items...': 'Buscar artículos digitales...',
    'Why Choose SKID HAVEN?': '¿Por qué elegir SKID HAVEN?',
    'Secure Trading': 'Comercio Seguro',
    'Protected transactions': 'Transacciones protegidas',
    'Instant Delivery': 'Entrega Instantánea',
    'Digital items in minutes': 'Artículos digitales en minutos',
    'Trusted Community': 'Comunidad Confiable',
    'Verified traders': 'Comerciantes verificados',
    'Privacy First': 'Privacidad Primero',
    'Encrypted & secure': 'Encriptado y seguro',
    'Multiple Payments': 'Múltiples Pagos',
    'Crypto, PayPal & more': 'Crypto, PayPal y más',
    'Reputation System': 'Sistema de Reputación',
    'Verified sellers': 'Vendedores verificados',
    'Popular Categories': 'Categorías Populares',
    'Gift Cards': 'Tarjetas de Regalo',
    'Game Accounts': 'Cuentas de Juego',
    'Premium Subs': 'Suscripciones Premium',
    'Digital Content': 'Contenido Digital',
    '0 items': '0 artículos',
    'Ready to Start Trading?': '¿Listo para Comenzar a Comerciar?',
    'Join our community of digital traders': 'Únete a nuestra comunidad de comerciantes digitales',
    'Join Community': 'Unirse a la Comunidad',
    'Start Chatting': 'Comenzar a Chatear',
    'Active Users': 'Usuarios Activos',
    'Items Sold': 'Artículos Vendidos',
    'Transactions': 'Transacciones',
    'Success Rate': 'Tasa de Éxito',
    
    // Auth
    'Login': 'Iniciar Sesión',
    'Sign Up': 'Registrarse',
    'Sign Out': 'Cerrar Sesión',
  },
  fr: {
    // Navigation
    'Home': 'Accueil',
    'Marketplace': 'Marché',
    'Sell Items': 'Vendre',
    'Crypto Exchange': 'Échange Crypto',
    'Messages': 'Messages',
    'Forum': 'Forum',
    'Settings': 'Paramètres',
    'Profile': 'Profil',
    'Wallet': 'Portefeuille',
    'Friends': 'Amis',
    
    // Profile Hub
    'Profile Hub': 'Centre de Profil',
    'Loading profile...': 'Chargement du profil...',
    'Edit': 'Modifier',
    'Cancel': 'Annuler',
    'Save': 'Sauvegarder',
    'Username': "Nom d'utilisateur",
    'Bio': 'Biographie',
    'Your username': "Votre nom d'utilisateur",
    'Add your bio': 'Ajoutez votre biographie',
    'Tell us about yourself': 'Parlez-nous de vous',
    'Member since': 'Membre depuis',
    'Crypto Wallet': 'Portefeuille Crypto',
    '0x... your wallet address': '0x... votre adresse de portefeuille',
    'Account Settings': 'Paramètres du Compte',
    'Account Email': 'Email du Compte',
    'Loading...': 'Chargement...',
    'Private - never shown to other users': 'Privé - jamais montré aux autres utilisateurs',
    'Email Notifications': 'Notifications par Email',
    'Updates about transactions and messages': 'Mises à jour sur les transactions et messages',
    'Two-Factor Authentication': 'Authentification à Deux Facteurs',
    'Extra security for your account': 'Sécurité supplémentaire pour votre compte',
    
    // Home Page
    'The premier digital marketplace for gift cards, game accounts, and premium subscriptions': 'Le marché numérique principal pour les cartes-cadeaux, comptes de jeu et abonnements premium',
    'Browse Marketplace': 'Parcourir le Marché',
    'Start Selling': 'Commencer à Vendre',
    'Search digital items...': 'Rechercher des articles numériques...',
    'Why Choose SKID HAVEN?': 'Pourquoi choisir SKID HAVEN?',
    'Secure Trading': 'Commerce Sécurisé',
    'Protected transactions': 'Transactions protégées',
    'Instant Delivery': 'Livraison Instantanée',
    'Digital items in minutes': 'Articles numériques en minutes',
    'Trusted Community': 'Communauté de Confiance',
    'Verified traders': 'Commerçants vérifiés',
    'Privacy First': 'Confidentialité d\'abord',
    'Encrypted & secure': 'Chiffré et sécurisé',
    'Multiple Payments': 'Paiements Multiples',
    'Crypto, PayPal & more': 'Crypto, PayPal et plus',
    'Reputation System': 'Système de Réputation',
    'Verified sellers': 'Vendeurs vérifiés',
    'Popular Categories': 'Catégories Populaires',
    'Gift Cards': 'Cartes-Cadeaux',
    'Game Accounts': 'Comptes de Jeu',
    'Premium Subs': 'Abonnements Premium',
    'Digital Content': 'Contenu Numérique',
    '0 items': '0 articles',
    'Ready to Start Trading?': 'Prêt à Commencer le Commerce?',
    'Join our community of digital traders': 'Rejoignez notre communauté de commerçants numériques',
    'Join Community': 'Rejoindre la Communauté',
    'Start Chatting': 'Commencer à Discuter',
    'Active Users': 'Utilisateurs Actifs',
    'Items Sold': 'Articles Vendus',
    'Transactions': 'Transactions',
    'Success Rate': 'Taux de Réussite',
    
    // Auth
    'Login': 'Connexion',
    'Sign Up': 'S\'inscrire',
    'Sign Out': 'Déconnexion',
  },
};

const translate = (key: string, currentLanguage: string): string => {
  return translations[currentLanguage]?.[key] || key;
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('kid-haven-language');
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('kid-haven-language', languageCode);
      
      toast({
        title: "Language Changed! 🌍",
        description: `Switched to ${language.name}`,
      });
      
      console.log('Language changed to:', language.name);
      
      // Force re-render by triggering a custom event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
      
      return true;
    }
    return false;
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const t = (key: string) => translate(key, currentLanguage);

  return {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    availableLanguages: languages,
    t
  };
};
