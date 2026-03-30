import { motion, AnimatePresence } from "framer-motion";
import { PiListBold, PiXBold } from "react-icons/pi";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export default function MobileNavbar({ isMenuOpen, onToggleMenu }) {
  const { t } = useLanguage();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="lg:hidden fixed top-0 left-0 right-0 z-50"
    >
      <nav className="gradient-primary shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center"
          >
            <img
              src="/images/adlogoW.svg"
              alt="Activo Digital"
              className="h-8 md:h-10"
            />
          </motion.a>

          {/* Right Section - Language Toggle & Menu Button */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            <motion.button
              onClick={onToggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
              aria-label={isMenuOpen ? t('mainMenu.cerrarMenu') : t('mainMenu.abrirMenu')}
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PiXBold size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PiListBold size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}