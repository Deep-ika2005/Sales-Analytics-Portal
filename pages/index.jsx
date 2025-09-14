
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const text = "Welcome";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
      <h1 className="text-5xl font-extrabold mb-3 drop-shadow-xl flex">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <motion.h2
        className="text-2xl font-semibold mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}  
        transition={{ delay: text.length * 0.2, duration: 0.7 }}
      >
        Sales Analytics Portal
      </motion.h2>
      <Link href="/login">
        <motion.button
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to Login
        </motion.button>
      </Link>
    </div>
  );
}
