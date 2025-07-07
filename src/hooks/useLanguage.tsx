
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

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    'Profile Hub': 'Profile Hub',
    'Loading profile...': 'Loading profile...',
    'Edit': 'Edit',
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Profile': 'Profile',
    'Wallet': 'Wallet',
    'Friends': 'Friends',
    'Settings': 'Settings',
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
  },
  es: {
    'Profile Hub': 'Centro de Perfil',
    'Loading profile...': 'Cargando perfil...',
    'Edit': 'Editar',
    'Cancel': 'Cancelar',
    'Save': 'Guardar',
    'Profile': 'Perfil',
    'Wallet': 'Billetera',
    'Friends': 'Amigos',
    'Settings': 'Configuración',
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
  },
  fr: {
    'Profile Hub': 'Centre de Profil',
    'Loading profile...': 'Chargement du profil...',
    'Edit': 'Modifier',
    'Cancel': 'Annuler',
    'Save': 'Sauvegarder',
    'Profile': 'Profil',
    'Wallet': 'Portefeuille',
    'Friends': 'Amis',
    'Settings': 'Paramètres',
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
