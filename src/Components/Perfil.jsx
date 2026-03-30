import {
  PiBriefcaseLight,
  PiClock,
  PiFlagLight,
  PiGraduationCapLight,
  PiHandPeaceLight,
  PiHouseLine,
  PiPencilLight,
  PiUserListFill
} from "react-icons/pi";
import { motion } from "framer-motion";
import Grafico from "./Grafico";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { staggerContainer, staggerItem } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";

const softSkillColors = [
  'bg-accent-teal',
  'bg-primary-400',
  'bg-accent-gold',
  'bg-green-500',
  'bg-accent-coral',
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
];

const experience = [
  {
    year: '2008',
    title: 'Diseñador Gráfico',
    institution: 'UNSTA - Universidad del Norte Santo Tomás de Aquino',
    type: 'education'
  },
  {
    year: '2021',
    title: 'Full Stack Developer',
    institution: 'Rolling Code School',
    type: 'education'
  },
  {
    year: '2024',
    title: 'React Avanzado',
    institution: 'Rolling Code School',
    type: 'education'
  },
];

const skillVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3 }
  }),
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

export default function Perfil({ items = [] }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t } = useLanguage();
  const clientesUnicos = [...new Set(items.map(item => item.client))];

  const softSkills = [
    { nombre: t('perfil.trabajoEnEquipo'), color: 'bg-accent-teal' },
    { nombre: t('perfil.comunicacionAsertiva'), color: 'bg-primary-400' },
    { nombre: t('perfil.liderazgo'), color: 'bg-accent-gold' },
    { nombre: t('perfil.adaptabilidad'), color: 'bg-green-500' },
    { nombre: t('perfil.creatividad'), color: 'bg-accent-coral' },
    { nombre: t('perfil.compromiso'), color: 'bg-blue-400' },
    { nombre: t('perfil.responsabilidad'), color: 'bg-purple-400' },
    { nombre: t('perfil.empatia'), color: 'bg-pink-400' },
  ];

  return (
    <div
      ref={ref}
      className="min-h-screen bg-white p-6 md:p-8 lg:p-12"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? "animate" : "initial"}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-3 pb-4 mb-6 border-b border-neutral-200"
        >
          <PiUserListFill className="text-3xl text-primary-500" />
          <span className="text-xl font-semibold text-neutral-600">{t('perfil.titulo')}</span>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Personal Info */}
          <motion.div variants={staggerItem} className="lg:col-span-3 space-y-8">
            {/* Name */}
            <div>
              <p className="text-sm uppercase tracking-wider text-neutral-900 mb-2">{t('perfil.nombre')}</p>
              <h1 className="text-2xl 2xl:text-4xl font-bold text-neutral-700">
                Federico Alvarez Gomez Omil
              </h1>
              <div className="h-1 w-20 bg-accent-teal rounded mt-4" />
            </div>

            {/* Location & Time */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-neutral-900">
                  <PiHouseLine className="text-xl" />
                  <span className="text-sm uppercase tracking-wider">{t('perfil.residencia')}</span>
                </div>
                <p className="text-[18px] font-semibold text-neutral-600">Tucumán, Argentina</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-neutral-900">
                  <PiClock className="text-xl" />
                  <span className="text-sm uppercase tracking-wider">{t('perfil.zonaHoraria')}</span>
                </div>
                <p className="text-[18px] font-semibold text-neutral-600">GMT-3 (Bs. As.)</p>
              </div>
            </div>

            {/* Education Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PiGraduationCapLight className="text-2xl text-primary-500" />
                <span className="text-sm uppercase tracking-wider text-neutral-900">{t('perfil.educacion')}</span>
              </div>

              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex flex-col my-1">
                      <span className="text-[16px] font-extrabold text-cyan-700 whitespace-nowrap">
                        {exp.year}
                      </span>
                      <div className="w-px h-full bg-neutral-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <h3 className="text-[24px] font-extrabold text-cyan-950">{exp.title}</h3>
                      <p className="text-neutral-500">{exp.institution}</p>
                      <hr className="border-neutral-200 mt-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PiFlagLight className="text-2xl text-primary-500" />
                <span className="text-sm uppercase tracking-wider text-neutral-900">{t('perfil.idiomas')}</span>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <img src="/images/espanol.png" className="h-6" alt="Español" />
                  <div>
                    <p className="font-semibold text-neutral-600">Español</p>
                    <p className="text-sm text-neutral-900">{t('perfil.nativo')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/images/ingles.png" className="h-6" alt="English" />
                  <div>
                    <p className="font-semibold text-neutral-600">Inglés</p>
                    <p className="text-sm text-neutral-900">{t('perfil.b2Intermedio')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Skills Card */}
          <motion.div
            variants={staggerItem}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-soft-lg p-6 sticky top-8">
              {/* Soft Skills */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <PiHandPeaceLight className="text-2xl text-primary-500" />
                  <span className="text-sm uppercase tracking-wider text-neutral-900">
                    {t('perfil.habilidadesBlandas')}
                  </span>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {softSkills.map((skill, index) => (
                    <motion.span
                      key={skill.nombre}
                      custom={index}
                      variants={skillVariants}
                      whileHover="hover"
                      className={`${skill.color} text-white text-sm px-3 py-1 rounded-full cursor-default`}
                    >
                      {skill.nombre}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Technical Skills */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PiPencilLight className="text-2xl text-primary-500" />
                  <span className="text-sm uppercase tracking-wider text-neutral-900">
                    {t('perfil.softwareTecnologias')}
                  </span>
                </div>
                <Grafico />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Work Experience Section */}
        <motion.div variants={staggerItem} className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <PiBriefcaseLight className="text-2xl text-primary-500" />
            <span className="text-sm uppercase tracking-wider text-neutral-900">
              {t('perfil.experienciaLaboral')}
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-green-700">{t('perfil.openToWork')}</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-6 border border-neutral-100"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div>
                <p className="text-sm uppercase tracking-wider text-neutral-900 mb-1">{t('perfil.actual')}</p>
                <h3 className="text-xl font-bold text-neutral-700">Ente Tucumán Turismo</h3>
                <p className="text-neutral-500">Gobierno de Tucumán</p>
              </div>

              <div className="flex-1">
                <p className="text-sm uppercase tracking-wider text-neutral-900 mb-3">
                  {t('perfil.clientesDestacados')}
                </p>
                {clientesUnicos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {clientesUnicos.map((cliente, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="bg-white px-3 py-1.5 rounded-lg text-sm text-neutral-600 shadow-sm border border-neutral-100"
                      >
                        {cliente}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-900 text-sm">{t('perfil.cargandoClientes')}</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}