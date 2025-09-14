
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [msalInstance, setMsalInstance] = useState(null);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initMSAL = async () => {
      const msal = await import("@azure/msal-browser");
      const { msalConfig } = await import("../src/msalconfig");

      const instance = new msal.PublicClientApplication(msalConfig);
      setMsalInstance(instance);

      try {
        // Initialize first
        await instance.initialize();   

        // Handle redirect response
        const response = await instance.handleRedirectPromise();

        if (response) {
          setUser(response.account);
        } else {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) setUser(accounts[0]);
        }
      } catch (err) {
        console.error("MSAL redirect error:", err);
      } finally {
        setInitialized(true);
      }
    };

    initMSAL();
  }, []);

  useEffect(() => {
    if (user) router.push("/dashboard"); // Redirect after login
  }, [user, router]);

  const handleLogin = async () => {
    if (!msalInstance || !initialized) return;

    await msalInstance.loginRedirect({ scopes: ["user.read"] });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 text-white px-4">
  {/* Title */}
  <motion.h2
    className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    Sales Analytics Portal
  </motion.h2>

  {/* Subtitle */}
  <p className="text-lg md:text-xl text-indigo-100 mb-10 text-center max-w-lg">
    Securely sign in with Microsoft to manage, track, and analyze your sales performance.
  </p>

  {/* Button */}
  <motion.button
    onClick={handleLogin}
    disabled={!initialized}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    Sign in with Microsoft
  </motion.button>
</div>

  );
}
