import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiX,
  PiPlus,
  PiTrash,
  PiImage,
  PiCheck,
  PiSpinner,
  PiWarning
} from "react-icons/pi";

const inputVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

export default function ModalAddWork({ isOpen, onClose, onSave, editingItem, t, language }) {
  const [formData, setFormData] = useState({
    client: '',
    workName: '',
    workNameEn: '',
    description: '',
    descriptionEn: '',
    date: '',
    img: [''],
    type: '',
    url: ''
  });
  const [alertConfig, setAlertConfig] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      client: '',
      workName: '',
      workNameEn: '',
      description: '',
      descriptionEn: '',
      date: '',
      img: [''],
      type: '',
      url: ''
    });
  };

  useEffect(() => {
    if (editingItem) {
      setFormData({
        client: editingItem.client || '',
        workName: editingItem.workName || '',
        workNameEn: editingItem.workNameEn || '',
        description: editingItem.description || '',
        descriptionEn: editingItem.descriptionEn || '',
        date: editingItem.date || '',
        img: editingItem.img?.length > 0 ? editingItem.img : [''],
        type: editingItem.type || '',
        url: editingItem.url || ''
      });
    } else {
      resetForm();
    }
  }, [editingItem]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const newImg = [...prev.img];
      newImg[index] = value;
      return { ...prev, img: newImg };
    });
  };

  const handleAddImage = () => {
    setFormData(prev => ({ ...prev, img: [...prev.img, ''] }));
  };

  const handleRemoveImage = (index) => {
    if (formData.img.length > 1) {
      setFormData(prev => ({
        ...prev,
        img: prev.img.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.workName.trim() || !formData.client.trim()) {
      setAlertConfig({
        type: 'error',
        title: t('dashboard.errorTitulo'),
        message: t('dashboard.completarCampos'),
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    setAlertConfig({
      type: 'confirm',
      title: editingItem ? t('dashboard.confirmarEdicion') : t('dashboard.confirmarNuevo'),
      message: editingItem ? t('dashboard.edicionMensaje') : t('dashboard.nuevoMensaje'),
      confirmText: editingItem ? t('dashboard.guardarCambios') : t('dashboard.crearTrabajo'),
      cancelText: t('dashboard.cancelar'),
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          // Filter out empty image URLs
          const cleanData = {
            ...formData,
            img: formData.img.filter(img => img.trim() !== '')
          };
          await onSave(cleanData);
          setAlertConfig(null);
          resetForm();
          onClose();
        } catch (error) {
          console.error('Error saving:', error);
          setAlertConfig({
            type: 'error',
            title: t('dashboard.errorTitulo'),
            message: t('dashboard.errorGuardando'),
            onConfirm: () => setAlertConfig(null)
          });
        } finally {
          setIsSubmitting(false);
        }
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  if (!isOpen) return null;

  const categoryOptions = [
    'Afíches',
    'Branding',
    'Diseño Web',
    'Editorial',
    'Señaletica',
    'Identidad Visual',
    'Folletería',
    'Muestras'
  ];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: 40 }}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
        style={{ zIndex: 50 }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-neutral-800">
              {editingItem ? t('dashboard.editarTrabajo') : t('dashboard.nuevoTrabajo')}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <PiX className="text-xl text-neutral-600" />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Client */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.cliente')} *
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => handleChange('client', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all"
                placeholder={t('dashboard.clientePlaceholder')}
              />
            </motion.div>

            {/* Work Name - Spanish */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.nombreTrabajo')} (ES) *
              </label>
              <input
                type="text"
                value={formData.workName}
                onChange={(e) => handleChange('workName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all"
                placeholder={t('dashboard.nombreTrabajoPlaceholder')}
              />
            </motion.div>

            {/* Work Name - English */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.nombreTrabajo')} (EN)
              </label>
              <input
                type="text"
                value={formData.workNameEn}
                onChange={(e) => handleChange('workNameEn', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all"
                placeholder={t('dashboard.nombreTrabajoPlaceholderEn')}
              />
            </motion.div>

            {/* Category */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.categoria')}
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('dashboard.seleccionarCategoria')}</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </motion.div>

            {/* Description - Spanish */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.descripcion')} (ES)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all resize-none"
                placeholder={t('dashboard.descripcionPlaceholder')}
              />
            </motion.div>

            {/* Description - English */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.descripcion')} (EN)
              </label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => handleChange('descriptionEn', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all resize-none"
                placeholder={t('dashboard.descripcionPlaceholderEn')}
              />
            </motion.div>

            {/* Date */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.fecha')}
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all"
                placeholder={t('dashboard.fechaPlaceholder')}
              />
            </motion.div>

            {/* URL */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.url')}
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all"
                placeholder="https://..."
              />
            </motion.div>

            {/* Images */}
            <motion.div variants={inputVariants} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t('dashboard.imagenes')}
              </label>
              <div className="space-y-2">
                {formData.img.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex gap-2"
                  >
                    <div className="flex-1 relative">
                      <PiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all"
                        placeholder={`${t('dashboard.imagenPlaceholder')} ${index + 1}`}
                      />
                    </div>
                    {formData.img.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveImage(index)}
                        className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <PiTrash />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddImage}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
              >
                <PiPlus />
                {t('dashboard.agregarImagen')}
              </motion.button>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={inputVariants} initial="initial" animate="animate" className="pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-white transition-all ${
                  isSubmitting
                    ? 'bg-neutral-400 cursor-not-allowed'
                    : 'bg-accent-teal hover:bg-accent-teal-dark shadow-lg shadow-accent-teal/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <PiSpinner className="animate-spin text-xl" />
                    {t('dashboard.guardando')}
                  </>
                ) : (
                  <>
                    <PiCheck className="text-xl" />
                    {editingItem ? t('dashboard.guardarCambios') : t('dashboard.crearTrabajo')}
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Alert */}
      <AnimatePresence>
        {alertConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            onClick={alertConfig.type === 'error' ? alertConfig.onConfirm : undefined}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Alert Icon */}
              <div className="flex justify-center pt-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    alertConfig.type === 'error'
                      ? 'bg-red-100'
                      : alertConfig.type === 'confirm'
                      ? 'bg-amber-100'
                      : 'bg-green-100'
                  }`}
                >
                  {alertConfig.type === 'error' && (
                    <PiX className="text-3xl text-red-500" />
                  )}
                  {alertConfig.type === 'confirm' && (
                    <PiWarning className="text-3xl text-amber-500" />
                  )}
                </motion.div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 text-center">
                <h3 className="text-xl font-bold text-neutral-800">
                  {alertConfig.title}
                </h3>
                <p className="text-neutral-500 mt-2">
                  {alertConfig.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-2">
                {alertConfig.type === 'confirm' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={alertConfig.onCancel}
                    className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {alertConfig.cancelText}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={alertConfig.onConfirm}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                    alertConfig.type === 'error'
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-accent-teal text-white hover:bg-accent-teal-dark'
                  }`}
                >
                  {alertConfig.confirmText || t('dashboard.aceptar')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}