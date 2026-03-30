import { useEffect, useState } from "react";
import { getItems } from "../service/api";
import Perfil from "../Components/Perfil";
import Trabajos from "../Components/Trabajos";
import DescargarCV from "../Components/DescargarCV";
import Contacto from "../Components/Contacto";
import MainMenu from "../Components/MainMenu";
import MobileNavbar from "../Components/MobileNavbar";
import ModalWork from "../Components/ModalWork";
import Footer from "../Components/Footer";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInLeft, staggerContainer, staggerItem } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";

// Custom hook to lock body scroll
function useScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
}

const logoAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeComponent, setActiveComponent] = useState('Perfil');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Lock body scroll when mobile menu is open
  useScrollLock(isMobileMenuOpen);

  useEffect(() => {
    showItems();
  }, []);

  const showItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = (id) => {
    setActiveComponent(id);
  };

  // Navigation handlers for modal
  const handlePrevItem = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setItemId(filteredItems[prevIndex].id);
    }
  };

  const handleNextItem = () => {
    if (currentIndex < filteredItems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setItemId(filteredItems[nextIndex].id);
    }
  };

  // Handler to open a specific work from footer
  const handleOpenWork = (work) => {
    // Filter items to ensure valid IDs
    const validItems = items.filter(item => item.id);
    // Set the filtered items to all valid items when opening from footer
    setFilteredItems(validItems);
    // Find the index of the work in the valid items array
    const workIndex = validItems.findIndex(item => item.id === work.id);
    setCurrentIndex(workIndex >= 0 ? workIndex : 0);
    setItemId(work.id);
    setIsOpenModal(true);
  };

  // Handler to open works from a category (from footer services)
  const handleOpenCategory = (category) => {
    // Filter items by category and ensure they have valid IDs
    const categoryItems = items.filter(item => item.type === category && item.id);
    if (categoryItems.length > 0) {
      setFilteredItems(categoryItems);
      setCurrentIndex(0);
      setItemId(categoryItems[0].id);
      setIsOpenModal(true);
    }
  };

  // Get translated textIndex content based on active component
  const getTextIndexContent = (componentId) => {
    const keyMap = {
      'Perfil': 'textIndex.perfil',
      'Trabajos': 'textIndex.trabajos',
      'Descargar CV': 'textIndex.descargarCV',
      'Contacto': 'textIndex.contacto'
    };
    return keyMap[componentId] || 'textIndex.perfil';
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Perfil':
        return <Perfil items={items} />;
      case 'Trabajos':
        return (
          <Trabajos
            setIsOpenModal={setIsOpenModal}
            setItemId={setItemId}
            onFilterChange={setFilteredItems}
            setCurrentIndex={setCurrentIndex}
          />
        );
      case 'Descargar CV':
        return <DescargarCV />;
      case 'Contacto':
        return <Contacto />;
      default:
        return <Perfil items={items} />;
    }
  };

  return (
    <div>
      {/* Mobile Navbar - Fixed at top on mobile only */}
      <MobileNavbar

        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Menu Overlay */}
      <div className="lg:hidden" ><MainMenu
        activeComponent={activeComponent}
        onSelect={handleButtonClick}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      /></div>

      {/* Mobile Content - Visible only on mobile */}
      <div className="lg:hidden pt-16">
        {/* Mobile Header Section */}
        <div className="gradient-primary px-4 py-6">
          {/* Dynamic Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeComponent}
              className="text-white text-[28px] font-bold uppercase leading-tight"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {t(`${getTextIndexContent(activeComponent)}.title`)}
            </motion.h1>
          </AnimatePresence>

          {/* Dynamic Description */}
          <motion.p
            className="text-white/80 text-sm mt-2 leading-relaxed"
            variants={staggerItem}
          >
            {t(`${getTextIndexContent(activeComponent)}.text`)}
          </motion.p>
        </div>

        {/* Mobile Content Area */}
        <div className="bg-white min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeComponent}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <Footer
            items={items}
            onNavigate={handleButtonClick}
            onOpenCategory={handleOpenCategory}
          />
        </div>
      </div>

      {/* Desktop Layout - Left Panel Fixed */}
      <motion.div
        className="hidden lg:block min-h-screen fixed left-0 top-0 w-[45%] xl:w-[40%] gradient-primary"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="pl-6 pr-6 md:pl-12 md:pr-8 py-12 lg:py-16 2xl:py-28 h-full flex flex-col">
          {/* Logo */}
          <motion.div variants={staggerItem}>
            <motion.img
              src="/images/adlogoW.svg"
              alt="Activo Digital"
              className="max-w-[200px] md:max-w-[250px] 2xl:max-w-[330px]"
              {...logoAnimation}
            />
          </motion.div>

          {/* Dynamic Title */}
          <motion.div
            className="mt-8 md:mt-16"
            variants={fadeInLeft}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeComponent}
                className="text-white text-[24px] lg:text-[28px] 2xl:text-[40px] font-bold pr-0 md:pr-2 uppercase leading-tight"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {t(`${getTextIndexContent(activeComponent)}.title`)}
              </motion.h1>
            </AnimatePresence>
          </motion.div>

          {/* Dynamic Description */}
          <motion.p
            className="text-white/80 text-[13px] 2xl:text-[16px] mt-4 md:mt-6 pr-0 md:pr-2 leading-relaxed"
            variants={staggerItem}
          >
            {t(`${getTextIndexContent(activeComponent)}.text`)}
          </motion.p>

          {/* Navigation Menu */}
          <div className="mt-6 md:mt-12">
            <MainMenu activeComponent={activeComponent} onSelect={handleButtonClick} />
          </div>
        </div>
      </motion.div>

      {/* Desktop Right Panel - Content */}
      <div className="hidden lg:block lg:ml-[45%] xl:ml-[40%] min-h-screen bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderActiveComponent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <Footer
          items={items}
          onNavigate={handleButtonClick}
          onOpenCategory={handleOpenCategory}
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <ModalWork
            item={filteredItems.find(item => item.id === itemId)}
            onClose={() => setIsOpenModal(false)}
            filteredItems={filteredItems}
            currentIndex={currentIndex}
            onPrev={handlePrevItem}
            onNext={handleNextItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}