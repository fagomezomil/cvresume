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
      value: "fagomezomil@gmail.com",
      href: "mailto:fagomezomil@gmail.com"
    },
    {
      icon: PiPhone,
      label: t('contacto.telefono'),
      value: "+54 9 381 6411 590",
      href: "tel:+5493816411590"
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
                  href="http://www.linkedin.com/in/federico-álvarez-gómez-omil-739768215"
                  className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* GitHub */}
                <a
                  href="https://github.com/fagomezomil"
                  className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${status === 'success'
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