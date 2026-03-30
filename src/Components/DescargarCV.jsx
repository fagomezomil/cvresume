import { motion } from "framer-motion";
import {
  PiDownloadSimple,
  PiFilePdf,
  PiSparkle
} from "react-icons/pi";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { staggerContainer, staggerItem } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";

export default function DescargarCV() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t, language } = useLanguage();

  const cvVersions = [
    {
      id: 'es',
      title: t('descargarCV.cvEspanol'),
      description: t('descargarCV.cvEspanolDesc'),
      flag: '/images/espanol.png',
      language: t('descargarCV.espanol'),
      file: '/cv/CV_Federico_Alvarez_ES.pdf'
    },
    {
      id: 'en',
      title: t('descargarCV.cvEnglish'),
      description: t('descargarCV.cvEnglishDesc'),
      flag: '/images/ingles.png',
      language: t('descargarCV.english'),
      file: '/cv/CV_Federico_Alvarez_EN.pdf'
    }
  ];

  const highlights = [
    t('descargarCV.highlight1'),
    t('descargarCV.highlight2'),
    t('descargarCV.highlight3'),
    t('descargarCV.highlight4')
  ];

  return (
    <div
      ref={ref}
      className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-6 md:p-8 lg:p-12"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? "animate" : "initial"}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-3 pb-4 mb-6 border-b border-neutral-200"
        >
          <PiFilePdf className="text-3xl text-primary-500" />
          <span className="text-xl md:text-2xl font-semibold text-neutral-600">{t('descargarCV.titulo')}</span>
        </motion.div>

        {/* Intro */}
        <motion.div variants={staggerItem} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            {t('descargarCV.tituloPregunta')}
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            {t('descargarCV.descripcion')}
          </p>
        </motion.div>

        {/* CV Cards */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {cvVersions.map((cv, index) => (
            <motion.a
              key={cv.id}
              href={cv.file}
              download
              custom={index}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.15, duration: 0.4 }
                })
              }}
              initial="initial"
              animate={isVisible ? "animate" : "initial"}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral-100 overflow-hidden"
            >

              {/* Flag & Language */}
              <div className="flex items-center gap-3 mb-4">
                <img src={cv.flag} alt={cv.language} className="h-6" />
                <span className="text-sm font-medium text-neutral-400">
                  {cv.language}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                {cv.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-500 text-sm mb-6">
                {cv.description}
              </p>

              {/* Download Button */}
              <div className="flex items-center gap-2 text-primary-500 font-medium group-hover:text-accent-teal transition-colors">
                <PiDownloadSimple className="text-xl" />
                <span>{t('descargarCV.descargarPDF')}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Highlights */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-6">
            <PiSparkle className="text-2xl text-accent-gold" />
            <span className="text-lg font-semibold text-neutral-700">
              {t('descargarCV.loQueVasAEncontrar')}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-3 bg-primary-50 rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-accent-teal" />
                <span className="text-sm font-medium text-neutral-700">
                  {highlight}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={staggerItem}
          className="mt-8 text-center"
        >
          <p className="text-neutral-400 text-sm">
            {t('descargarCV.necesitaMasInfo')}{" "}
            <a
              href="#"
              className="text-primary-500 hover:text-accent-teal transition-colors font-medium"
            >
              {t('descargarCV.contactame')}
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}