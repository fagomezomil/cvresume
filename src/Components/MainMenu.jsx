import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  PiBriefcaseLight,
  PiDownloadSimpleFill,
  PiDownloadSimpleLight,
  PiEnvelopeSimpleOpenFill,
  PiEnvelopeSimpleOpenLight,
  PiGearSixFill,
  PiGearSixLight,
  PiUserListFill,
  PiUserListLight
} from "react-icons/pi";
import { staggerContainer, staggerItem } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const menuItems = [
  { id: 'Perfil', iconFilled: PiUserListFill, iconLight: PiUserListLight },
  { id: 'Trabajos', iconFilled: PiGearSixFill, iconLight: PiGearSixLight },
  { id: 'Descargar CV', iconFilled: PiDownloadSimpleFill, iconLight: PiDownloadSimpleLight },
  { id: 'Contacto', iconFilled: PiEnvelopeSimpleOpenFill, iconLight: PiEnvelopeSimpleOpenLight },
];

const menuItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const menuPanelVariants = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { x: '-100%', transition: { duration: 0.2 } }
};

export default function MainMenu({ activeComponent, onSelect, isMobileMenuOpen = false, onMobileMenuClose }) {
  const { t } = useLanguage();

  // Get translated menu label
  const getMenuLabel = (id) => {
    const labels = {
      'Perfil': t('mainMenu.perfil'),
      'Trabajos': t('mainMenu.trabajos'),
      'Descargar CV': t('mainMenu.descargarCV'),
      'Contacto': t('mainMenu.contacto')
    };
    return labels[id] || id;
  };

  const handleClick = (id) => {
    onSelect(id);
    // Close mobile menu if callback provided
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const MenuButton = ({ item, index }) => {
    const isActive = activeComponent === item.id;
    const IconFilled = item.iconFilled;
    const IconLight = item.iconLight;

    return (
      <motion.button
        custom={index}
        variants={menuItemVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={() => handleClick(item.id)}
        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left ${isActive
          ? 'bg-white/15 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-teal rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Icon */}
        <span className="text-xl 2xl:text-3xl">
          {isActive ? <IconFilled /> : <IconLight />}
        </span>

        {/* Label */}
        <span className={`text-sm 2xl:text-base font-medium transition-all duration-200 ${isActive ? 'text-white' : 'group-hover:text-white'
          }`}>
          {getMenuLabel(item.id)}
        </span>
      </motion.button>
    );
  };

  // Desktop Menu Component
  const DesktopMenu = () => (
    <motion.nav
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="w-full hidden lg:block"
    >
      {/* Section Label */}
      <motion.div
        variants={staggerItem}
        className="flex items-center justify-between mb-4 pl-4 pr-0"
      >
        <p className="text-white/50 text-xs md:text-sm font-bold uppercase tracking-wider">
          {t('mainMenu.conocemas')}
        </p>
        <LanguageToggle />
      </motion.div>
      {/* Menu Items */}
      <div className="flex 2xl:flex-col gap-1">
        {menuItems.map((item, index) => (
          <MenuButton key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Language Toggle for Desktop */}
      <motion.div
        variants={staggerItem}
        className="mt-6 pl-4"
      >

      </motion.div>
    </motion.nav>
  );

  // Mobile Menu Overlay Component
  const MobileMenuOverlay = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onMobileMenuClose}
        >
          <motion.div
            variants={menuPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[80vw] gradient-primary shadow-2xl overflow-y-auto pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Section Label */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4"
              >
                {t('mainMenu.conocemas')}
              </motion.p>

              {/* Menu Items */}
              <motion.nav
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="flex flex-col gap-1"
              >
                {menuItems.map((item, index) => (
                  <MenuButton key={item.id} item={item} index={index} />
                ))}
              </motion.nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopMenu />
      <MobileMenuOverlay />
    </>
  );
}