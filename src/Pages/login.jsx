import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import bgImage from "../assets/images/reacthome.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        toast.success("Login Successful 🎉");

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster position="top-right" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Animated Background Circles */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl top-10 left-10"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 bg-pink-500/30 rounded-full blur-3xl bottom-10 right-10"
      ></motion.div>

      {/* Login Card */}
      <motion.form
        variants={containerVariants}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            ⭐ StarPhone
          </h2>
          <p className="text-gray-300">Welcome back! Please login.</p>
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants} className="relative mb-6 group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full p-3 pt-5 bg-white/10 text-white rounded-xl outline-none border border-white/10 focus:border-purple-400 focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 placeholder-transparent backdrop-blur-md"
            placeholder="Email Address"
          />
          <label
            className={`absolute left-3 text-gray-300 text-sm transition-all duration-300 
            ${email ? "-top-2.5 text-xs text-purple-400" : "top-3.5"} 
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 
            bg-black/40 px-2 rounded-md backdrop-blur-md`}
          >
            Email Address
          </label>
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants} className="relative mb-8 group">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full p-3 pt-5 bg-white/10 text-white rounded-xl outline-none border border-white/10 focus:border-pink-400 focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-pink-500/50 placeholder-transparent backdrop-blur-md"
            placeholder="Password"
          />
          <label
            className={`absolute left-3 text-gray-300 text-sm transition-all duration-300 
            ${password ? "-top-2.5 text-xs text-pink-400" : "top-3.5"} 
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-pink-400 
            bg-black/40 px-2 rounded-md backdrop-blur-md`}
          >
            Password
          </label>
        </motion.div>

        {/* Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-70 flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center text-gray-300 mt-6 text-sm">
          Not registered yet?{" "}
          <Link
            to="/register"
            className="text-purple-400 font-bold hover:text-purple-300 transition-colors hover:underline"
          >
            Create an Account
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
}

export default Login;