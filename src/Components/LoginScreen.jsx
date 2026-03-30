import { motion } from "framer-motion";
import { PiGoogleLogo, PiShieldCheck } from "react-icons/pi";
import { useLanguage } from "../context/LanguageContext";

export default function LoginScreen({ onLogin, error }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
          {/* Header */}
          <div className="gradient-primary px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
            >
              <PiShieldCheck className="text-3xl text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              {t('dashboard.titulo')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 mt-2"
            >
              {t('login.subtitulo')}
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100"
              >
                <p className="text-red-600 text-sm text-center">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-neutral-200 rounded-xl font-medium text-neutral-700 hover:border-accent-teal hover:text-accent-teal transition-all shadow-soft"
            >
              <PiGoogleLogo className="text-2xl" />
              {t('login.iniciarConGoogle')}
            </motion.button>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-neutral-400">
                {t('login.notaSeguridad')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-neutral-400 mt-4"
        >
          {t('login.footer')}
        </motion.p>
      </motion.div>
    </div>
  );
}