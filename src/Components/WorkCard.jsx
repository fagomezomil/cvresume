import { forwardRef } from "react";
import { motion } from "framer-motion";
import { PiArrowRight } from "react-icons/pi";
import { useLanguage } from "../context/LanguageContext";
import { getWorkTranslation, translateCategory } from "../utils/translations";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }),
  hover: {
    y: -8,
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.98 }
};

const imageVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.4 }
  }
};

const WorkCard = forwardRef(function WorkCard({ item, index, filteredItems, setIsOpenModal, setItemId, setCurrentIndex }, ref) {
  const { t, language } = useLanguage();

  const handleClick = () => {
    setItemId(item.id);
    setCurrentIndex(index);
    setIsOpenModal(true);
  };

  // Get translated work name and description
  const workName = getWorkTranslation(item, 'workName', language);
  const description = getWorkTranslation(item, 'description', language);
  const category = translateCategory(item.type, language);

  return (
    <motion.article
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      layout
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <motion.img
            variants={imageVariants}
            src={`/images/works/${item.img?.[0] || 'placeholder.jpg'}`}
            alt={workName}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-primary-700/90 via-primary-700/50 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex items-center gap-2 text-white font-medium">
              <span>{t('workCard.verProyecto')}</span>
              <PiArrowRight className="text-lg" />
            </div>
          </motion.div>

          {/* Category Badge */}
          {item.type && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700 shadow-sm">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-neutral-700 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
            {workName}
          </h3>

          {/* Client */}
          <p className="text-sm font-medium text-accent-slate mt-1">
            {item.client}
          </p>

          {/* Description */}
          <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
            {description}
          </p>

          {/* View More Link */}
          <div className="flex items-center gap-1 mt-3 text-sm font-medium text-primary-500 group-hover:text-accent-teal transition-colors duration-200">
            <span>{t('workCard.verMas')}</span>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <PiArrowRight />
            </motion.span>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default WorkCard;