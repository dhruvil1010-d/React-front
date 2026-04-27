import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import bgImage from "../assets/images/reacthome.png";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phonenumber: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validations ---
    if (!formData.name.trim()) {
      toast.error("Full Name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Enter valid email");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phonenumber)) {
      toast.error("Phone must be 10 digits");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration Successful 🎉", { duration: 3000 });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center justify-center min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster position="top-right" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Animated Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl top-10 right-20 z-0"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl bottom-10 left-10 z-0"
      ></motion.div>

      {/* Card */}
      <motion.div variants={containerVariants} className="relative z-10 w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
              ⭐ StarPhone
            </h2>
            <p className="text-gray-300">Create your account to get started.</p>
          </motion.div>

          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 outline-none backdrop-blur-md"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 outline-none backdrop-blur-md"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <input
                type="tel"
                name="phonenumber"
                placeholder="Phone Number (10 digits)"
                value={formData.phonenumber}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 outline-none backdrop-blur-md"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <input
                type="password"
                name="password"
                placeholder="Password (6+ chars)"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-indigo-400 focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 outline-none backdrop-blur-md"
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 disabled:opacity-70 relative overflow-hidden group flex justify-center items-center"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.div>

          <motion.p variants={itemVariants} className="text-center text-gray-300 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors hover:underline"
            >
              Sign In
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Register;
