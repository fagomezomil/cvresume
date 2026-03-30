import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getItems } from "../service/api";
import WorkCard from "./WorkCard";
import { PiGearSixFill, PiSpinner } from "react-icons/pi";
import { staggerContainer, staggerItem, fadeInUp } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";
import { translateCategory } from "../utils/translations";

const filterVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function Trabajos({ setIsOpenModal, setItemId, onFilterChange, setCurrentIndex }) {
  const [items, setItems] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    showItems();
  }, []);

  const showItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
      const categoriasUnicas = [...new Set(data.map(item => item.type))];
      setCategorias(categoriasUnicas);
      // Notify parent with all items on initial load
      if (onFilterChange) {
        onFilterChange(data);
      }
    } catch (error) {
      console.error("Error loading works:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = categoria === ""
    ? items
    : items.filter(item => item.type === categoria);

  // Handle category change
  const handleCategoryChange = useCallback((newCategory) => {
    setCategoria(newCategory);
    // Reset index when category changes
    setCurrentIndex(0);
  }, [setCurrentIndex]);

  // Notify parent when category changes
  useEffect(() => {
    if (onFilterChange && items.length > 0) {
      onFilterChange(filteredItems);
    }
  }, [categoria, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-3 pb-4 mb-6 border-b border-neutral-200"
        >
          <PiGearSixFill className="text-3xl text-primary-500" />
          <span className="text-xl md:text-2xl font-semibold text-neutral-600">
            {t('trabajos.titulo')}
          </span>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="mb-8">
          <p className="text-sm uppercase tracking-wider text-neutral-400 mb-3">
            {t('trabajos.filtrarPorCategoria')}
          </p>

          <div className="flex flex-wrap gap-2">
            <motion.button
              variants={filterVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                categoria === ""
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {t('trabajos.todos')}
            </motion.button>

            <AnimatePresence>
              {categorias.map((cat, index) => (
                <motion.button
                  key={cat}
                  variants={filterVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    categoria === cat
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {translateCategory(cat, language)}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex items-center justify-center py-20"
          >
            <PiSpinner className="animate-spin text-4xl text-primary-500" />
            <span className="ml-3 text-neutral-500">{t('trabajos.cargandoProyectos')}</span>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center py-20"
          >
            <p className="text-neutral-400 text-lg">
              {t('trabajos.noHayProyectos')}
            </p>
          </motion.div>
        )}

        {/* Works Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <WorkCard
                  key={item.id}
                  item={item}
                  index={index}
                  filteredItems={filteredItems}
                  setIsOpenModal={setIsOpenModal}
                  setItemId={setItemId}
                  setCurrentIndex={setCurrentIndex}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}