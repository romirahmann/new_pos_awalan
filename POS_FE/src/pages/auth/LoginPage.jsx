/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FormLogin } from "../../components/auth/FormLogin";

export function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 text-gray-100"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl 
        rounded-3xl p-10 border border-white/20"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.img
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            src="/images/awalan.png"
            alt="Awalan Logo"
            className="w-24 mb-3 drop-shadow-lg"
          />
          <h2 className="text-2xl font-bold tracking-wide text-white">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-sm">Awalan Teams Portal</p>
        </div>

        <FormLogin />
      </motion.div>
    </div>
  );
}
