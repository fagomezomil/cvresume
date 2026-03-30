import { useState } from "react";
import { motion } from "framer-motion";
import {
  PiEnvelope,
  PiPhone,
  PiMapPin,
  PiPaperPlane,
  PiCheckCircle,
  PiSpinner
} from "react-icons/pi";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { staggerContainer, staggerItem, fadeInUp } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";

const inputVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  focus: { scale: 1.02 }
};

export default function Contacto() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const contactInfo = [
    {
      icon: PiEnvelope,
      label: t('contacto.email'),
      value: "contacto@activodigital.com",
      href: "mailto:contacto@activodigital.com"
    },
    {
      icon: PiPhone,
      label: t('contacto.telefono'),
      value: "+54 9 381 XXX XXXX",
      href: "tel:+549381XXXXXXX"
    },
    {
      icon: PiMapPin,
      label: t('contacto.ubicacion'),
      value: "Tucumán, Argentina",
      href: null
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate sending (replace with actual API call)
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div
      ref={ref}
      className="min-h-screen bg-white p-6 md:p-8 lg:p-12"
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
          <PiEnvelope className="text-3xl text-primary-500" />
          <span className="text-xl md:text-2xl font-semibold text-neutral-600">{t('contacto.titulo')}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div variants={staggerItem} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                {t('contacto.tituloProyecto')}
              </h2>
              <p className="text-neutral-500">
                {t('contacto.descripcionProyecto')}
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon className="text-xl text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-neutral-700 font-medium hover:text-accent-teal transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-neutral-700 font-medium">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Links placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="pt-6 border-t border-neutral-100"
            >
              <p className="text-sm text-neutral-400 mb-4">{t('contacto.seguimeRedes')}</p>
              <div className="flex gap-3">
                {/* LinkedIn */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* Behance */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label="Behance"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.334 1.485.612.41.282.733.658.963 1.13.225.47.34 1.05.34 1.746 0 .746-.166 1.386-.5 1.915-.33.533-.856.938-1.57 1.214.95.272 1.652.733 2.11 1.387.46.654.688 1.44.688 2.36 0 .754-.14 1.41-.427 1.965-.288.553-.68 1.01-1.173 1.376-.497.363-1.066.636-1.707.815-.636.177-1.31.267-2.02.267H0v-13h6.938v-.003zm-.424 5.44c.595 0 1.087-.14 1.475-.42.39-.28.58-.7.58-1.273 0-.32-.058-.585-.178-.798-.12-.213-.287-.384-.5-.508-.217-.126-.465-.215-.746-.268-.28-.058-.58-.085-.9-.085H3.23v3.35h3.284v.002zm.2 5.614c.34 0 .66-.033.96-.1.3-.066.564-.178.785-.34.222-.16.395-.375.523-.64.126-.268.19-.6.19-.995 0-.79-.224-1.356-.673-1.693-.452-.335-1.05-.504-1.8-.504H3.23v4.272h3.483zM21.058 19.335H14.58v-2.16h6.478v2.16zM22.864 11.532c-.278-.49-.686-.89-1.22-1.2-.533-.31-1.19-.47-1.962-.47-.48 0-.93.06-1.347.18-.416.12-.78.3-1.093.55-.31.247-.56.56-.745.93-.19.37-.28.81-.28 1.32h2.19c.02-.35.14-.64.36-.86.22-.22.52-.33.89-.33.35 0 .62.08.81.25.19.17.28.4.28.68 0 .27-.1.5-.3.67-.2.17-.46.3-.78.39-.31.09-.67.18-1.06.27-.47.1-.93.23-1.38.4-.46.17-.87.4-1.24.69-.36.3-.65.67-.87 1.12-.22.45-.33 1-.33 1.67 0 .67.12 1.25.36 1.73.24.49.57.88.98 1.19.42.31.9.53 1.45.66.55.13 1.13.19 1.74.19.74 0 1.4-.1 1.98-.29.58-.19 1.07-.48 1.48-.86.41-.38.72-.85.93-1.4.22-.56.32-1.19.32-1.9v-1.04c0-.65-.11-1.22-.33-1.71zm-2.15 2.93c-.01.4-.07.74-.18 1.02-.11.28-.28.51-.51.68-.22.17-.52.26-.88.26-.33 0-.6-.08-.82-.24-.22-.16-.33-.41-.33-.75 0-.24.05-.45.14-.62.09-.17.23-.31.4-.43.17-.12.38-.22.62-.3.24-.09.5-.17.78-.24.27-.07.55-.15.85-.24l-.07 1.86z"/>
                  </svg>
                </a>
                {/* GitHub */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={staggerItem}>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Name */}
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  {t('contacto.nombre')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder={t('contacto.nombrePlaceholder')}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  {t('contacto.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder={t('contacto.emailPlaceholder')}
                />
              </motion.div>

              {/* Subject */}
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  {t('contacto.asunto')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder={t('contacto.asuntoPlaceholder')}
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  {t('contacto.mensaje')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="textarea"
                  placeholder={t('contacto.mensajePlaceholder')}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  status === 'success'
                    ? 'bg-green-500 text-white'
                    : status === 'sending'
                    ? 'bg-primary-300 text-white cursor-wait'
                    : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                }`}
              >
                {status === 'sending' ? (
                  <>
                    <PiSpinner className="animate-spin text-xl" />
                    {t('contacto.enviando')}
                  </>
                ) : status === 'success' ? (
                  <>
                    <PiCheckCircle className="text-xl" />
                    {t('contacto.mensajeEnviado')}
                  </>
                ) : (
                  <>
                    <PiPaperPlane className="text-xl" />
                    {t('contacto.enviarMensaje')}
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}