import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import {
  PiPhone,
  PiMapPin,
  PiLinkedinLogo,
  PiGithubLogo,
} from "react-icons/pi";
import { staggerContainer, staggerItem } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";
import { translateCategory } from "../utils/translations";

const socialLinks = [
  { icon: PiLinkedinLogo, href: "http://www.linkedin.com/in/federico-álvarez-gómez-omil-739768215", label: "LinkedIn" },
  { icon: PiGithubLogo, href: "https://github.com/fagomezomil", label: "GitHub" },
];

export default function Footer({ items = [], onNavigate, onOpenCategory }) {
  const { t, language } = useLanguage();

  // Get unique categories from items and pick 4 random ones
  const randomCategories = useMemo(() => {
    if (items.length === 0) return [];

    const uniqueCategories = [...new Set(items.map(item => item.type).filter(Boolean))];
    // Shuffle and take 4
    const shuffled = uniqueCategories.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [items]);

  const contactInfo = {
    phone: "+54 9 381 6411590",
    address: "San Miguel de Tucumán, Argentina",
  };

  const navigationItems = [
    { label: t('footer.perfil'), id: 'Perfil' },
    { label: t('footer.trabajos'), id: 'Trabajos' },
    { label: 'Descargar CV', id: 'Descargar CV' },
    { label: t('footer.contacto'), id: 'Contacto' },
  ];

  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category) => {
    if (onOpenCategory) {
      onOpenCategory(category);
    }
  };

  return (
    <footer className="bg-slate-900 text-white px-8">
      {/* Main Footer Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-12 md:py-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Navigation */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-300">
              {t('footer.navegacion')}
            </h3>
            <ul className="space-y-2">
              {navigationItems.map((link, index) => (
                <li key={`nav-${index}-${link.id}`}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services - Categories */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-300">
              {t('footer.servicios')}
            </h3>
            <ul className="space-y-2">
              {randomCategories.length > 0 ? (
                randomCategories.map((category, index) => (
                  <li key={`cat-${index}-${category}`}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {translateCategory(category, language)}
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <span className="text-sm text-slate-500">{t('footer.disenoEditorial')}</span>
                  </li>
                  <li>
                    <span className="text-sm text-slate-500">{t('footer.branding')}</span>
                  </li>
                  <li>
                    <span className="text-sm text-slate-500">{t('footer.desarrolloWeb')}</span>
                  </li>
                  <li>
                    <span className="text-sm text-slate-500">{t('footer.disenoUIUX')}</span>
                  </li>
                </>
              )}
            </ul>
          </motion.div>

          {/* Map */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-300">
              {t('footer.ubicacion')}
            </h3>
            <div className="rounded-lg overflow-hidden h-40 bg-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113927.39428003296!2d-65.2723859!3d-26.8082849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c1c22c6e6e5%3A0x7e3f3d3e3d3e3d3e!2sSan%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses!2sar!4v1699999999999!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(90%)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación en San Miguel de Tucumán"
              />
            </div>
          </motion.div>

          {/* Brand & Contact */}
          <motion.div variants={staggerItem} className="lg:col-span-1 flex flex-col lg:items-end">

            {/* Contact Info */}
            <div className="space-y-3 text-right flex lg:flex-col lg:items-end">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex gap-3 text-sm text-slate-300 hover:text-white transition-colors "
              >
                {contactInfo.phone}
                <PiPhone className="text-lg" />
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-300 text-right">
                {contactInfo.address}
                <PiMapPin className="text-lg" />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                  >
                    <Icon className="text-xl" />
                  </a>
                );
              })}
            </div>
            <img
              src="/images/adlogoW.svg"
              alt="Activo Digital"
              className="h-12 my-4"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Activo Digital. {t('footer.derechosReservados')}
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}