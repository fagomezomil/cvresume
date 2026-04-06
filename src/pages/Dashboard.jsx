import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createItem, getItems, deleteItem, updateItem } from "../service/api";
import { auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "../service/firebase";
import LoginScreen from "../Components/LoginScreen";
import ModalAddWork from "../Components/ModalAddWork";
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiFolderSimple,
  PiCalendar,
  PiLink,
  PiCaretDown,
  PiSpinner,
  PiX,
  PiCheck,
  PiWarning,
  PiSignOut,
  PiNote
} from "react-icons/pi";
import { staggerContainer, staggerItem, fadeInUp } from "../utils/animations";
import { useLanguage } from "../context/LanguageContext";
import { getWorkTranslation, translateCategory } from "../utils/translations";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

const DashBoard = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const { t, language } = useLanguage();

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setUser(user);
        setAuthError(null);
      } else if (user && user.email !== ADMIN_EMAIL) {
        // User logged in but not authorized
        signOut(auth);
        setUser(null);
        setAuthError(t('login.accesoDenegado'));
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      showItems();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(t('login.errorLogin'));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const showItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error("Error loading works:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    const workName = getWorkTranslation(item, 'workName', language);
    setAlertConfig({
      type: 'delete',
      title: t('dashboard.confirmarEliminar'),
      message: `${t('dashboard.eliminarMensaje')} "${workName}"?`,
      confirmText: t('dashboard.eliminar'),
      cancelText: t('dashboard.cancelar'),
      onConfirm: async () => {
        try {
          await deleteItem(item.id);
          showItems();
          setAlertConfig(null);
        } catch (error) {
          console.error("Error deleting:", error);
        }
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleSaveWork = async (workData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, workData);
      } else {
        await createItem(workData);
      }
      showItems();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving work:", error);
    }
  };

  // Show login screen if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <PiSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} error={authError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 md:p-8 lg:p-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-600">
              {t('dashboard.titulo')}
            </h1>
            <p className="text-neutral-500 mt-2">
              {t('dashboard.subtitulo')}
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-teal text-white rounded-xl font-medium shadow-lg shadow-accent-teal/25 hover:bg-accent-teal-dark transition-all"
            >
              <PiPlus className="text-xl" />
              {t('dashboard.nuevoTrabajo')}
            </motion.button>

            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-medium hover:bg-neutral-200 transition-all"
              title={t('dashboard.cerrarSesion')}
            >
              <PiSignOut className="text-xl" />
              <span className="hidden sm:inline">{t('dashboard.salir')}</span>
            </motion.button>
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
            <span className="ml-3 text-neutral-500">{t('dashboard.cargando')}</span>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <PiFolderSimple className="text-4xl text-neutral-400" />
            </div>
            <p className="text-neutral-400 text-lg mb-4">
              {t('dashboard.noHayTrabajos')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              <PiPlus className="text-xl" />
              {t('dashboard.agregarPrimero')}
            </motion.button>
          </motion.div>
        )}

        {/* Works Grid */}
        {!isLoading && items.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const isExpanded = expandedId === item.id;
                const workName = getWorkTranslation(item, 'workName', language);
                const description = getWorkTranslation(item, 'description', language);
                const note = getWorkTranslation(item, 'nota', language);
                const category = translateCategory(item.type, language);

                return (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    custom={index}
                    layout
                    className="bg-white rounded-2xl shadow-soft overflow-hidden"
                  >
                    {/* Card Header - Clickable */}
                    <motion.div
                      layout
                      onClick={() => toggleExpand(item.id)}
                      className="cursor-pointer group"
                    >
                      <div className="flex items-stretch gap-4 p-4">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                          <img
                            src={`/images/works/${item.img?.[0] || 'placeholder.jpg'}`}
                            alt={workName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="font-bold text-lg text-neutral-700 truncate group-hover:text-primary-600 transition-colors">
                            {workName}
                          </h3>
                          <p className="text-sm text-primary-500 font-medium mt-0.5">
                            {item.client}
                          </p>
                          {item.type && (
                            <span className="inline-flex items-center gap-1 w-fit mt-2 px-2.5 py-0.5 bg-accent-teal/10 text-accent-teal rounded-full text-xs font-medium">
                              <PiFolderSimple className="text-sm" />
                              {category}
                            </span>
                          )}
                        </div>

                        {/* Expand Icon */}
                        <div className="flex items-center text-neutral-400">
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <PiCaretDown className="text-xl" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-neutral-100">
                            {/* Description */}
                            <p className="text-sm text-neutral-600 mt-4 line-clamp-3">
                              {description}
                            </p>

                            {/* Date & URL */}
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-500">
                              {item.date && (
                                <span className="flex items-center gap-1">
                                  <PiCalendar className="text-base" />
                                  {item.date}
                                </span>
                              )}
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-accent-teal hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <PiLink className="text-base" />
                                  {t('dashboard.verEnlace')}
                                </a>
                              )}
                            </div>

                            {/* Note */}
                            {note && (
                              <div className="flex items-start gap-2 mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
                                <PiNote className="text-amber-500 text-base flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700">
                                  {note}
                                </p>
                              </div>
                            )}

                            {/* Images Preview */}
                            {item.img && item.img.length > 1 && (
                              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                                {item.img.map((img, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100"
                                  >
                                    <img
                                      src={`/images/works/${img}`}
                                      alt={`${workName} - ${imgIndex + 1}`}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4 pt-3 border-t border-neutral-100">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                              >
                                <PiPencilSimple className="text-lg" />
                                {t('dashboard.editar')}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                              >
                                <PiTrash className="text-lg" />
                                {t('dashboard.eliminar')}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Modal Add/Edit Work */}
      <ModalAddWork
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveWork}
        editingItem={editingItem}
        t={t}
        language={language}
      />

      {/* Alert Dialog */}
      <AnimatePresence>
        {alertConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={alertConfig.onCancel}
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
                    alertConfig.type === 'delete'
                      ? 'bg-red-100'
                      : alertConfig.type === 'success'
                      ? 'bg-green-100'
                      : 'bg-amber-100'
                  }`}
                >
                  {alertConfig.type === 'delete' && (
                    <PiWarning className="text-3xl text-red-500" />
                  )}
                  {alertConfig.type === 'success' && (
                    <PiCheck className="text-3xl text-green-500" />
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={alertConfig.onCancel}
                  className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                >
                  {alertConfig.cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={alertConfig.onConfirm}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                    alertConfig.type === 'delete'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-accent-teal text-white hover:bg-accent-teal-dark'
                  }`}
                >
                  {alertConfig.confirmText}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashBoard;