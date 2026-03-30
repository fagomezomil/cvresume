import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 border border-white/10"
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className="text-base">
        {language === 'es' ? '🇪🇸' : '🇬🇧'}
      </span>
      <span>{language === 'es' ? 'ES' : 'EN'}</span>
    </motion.button>
  );
}