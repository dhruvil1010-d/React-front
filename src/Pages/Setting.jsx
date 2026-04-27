import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Smartphone, 
  ShoppingCart, 
  Package, 
  Settings as SettingsIcon, 
  LogOut,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

function Settings() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Update Profile
  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!profileData.name.trim()) {
      setLoading(false);
      return setError("Full Name is required.");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(profileData.phonenumber)) {
      setLoading(false);
      return setError("Phone number must be exactly 10 digits.");
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...existingUser, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (passwordData.newPassword.length < 6) {
      setLoading(false);
      return setError("New Password must be at least 6 characters long.");
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        ...passwordData,
        email: user?.email,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setPasswordData({ oldPassword: "", newPassword: "" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message || "Password change failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { icon: <Home size={22} />, label: "Home", path: "/home" },
    { icon: <Smartphone size={22} />, label: "Phones", path: "/phonefilter" },
    { icon: <ShoppingCart size={22} />, label: "Cart", path: "/cart" },
    { icon: <Package size={22} />, label: "Orders", path: "/orders" },
    { icon: <SettingsIcon size={22} />, label: "Settings", path: "/settings" },
  ];

  // Animations
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    out: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-gray-900 text-white fixed h-full z-20 flex flex-col shadow-2xl hidden md:flex">
        {/* Logo Area */}
        <div className="p-8 pb-6">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
            <Smartphone size={28} className="text-blue-400" /> StarPhone
          </h1>
        </div>

        {/* User Profile Mini */}
        <div className="px-6 mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-4 flex items-center gap-4 border border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold shadow-lg">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-white truncate">{profileData.name}</h3>
              <p className="text-xs text-gray-400 truncate">{profileData.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = window.location.pathname === item.path || (item.path === "/settings" && window.location.pathname.includes("settings"));
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-left font-medium ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all duration-300 font-bold"
          >
            <LogOut size={20} />
            <span>Secure Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-6 lg:p-12 overflow-x-hidden relative">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3 mb-2">
              <SettingsIcon className="text-blue-600" size={36} /> Account Settings
            </h2>
            <p className="text-gray-500 text-lg">Manage your profile information and security preferences.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-50 text-red-600 px-6 py-4 mb-8 rounded-2xl flex items-center gap-3 border border-red-100 shadow-sm"
              >
                <AlertCircle size={20} /> {error}
              </motion.div>
            )}
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-green-50 text-green-700 px-6 py-4 mb-8 rounded-2xl flex items-center gap-3 border border-green-100 shadow-sm"
              >
                <CheckCircle2 size={20} /> {message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={staggerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PROFILE SECTION */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
              </div>

              <form onSubmit={updateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      readOnly
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                  <p className="text-xs text-gray-400 ml-1">Email cannot be changed.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="phonenumber"
                      placeholder="9876543210"
                      value={profileData.phonenumber}
                      onChange={handleProfileChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-70 mt-4"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </motion.button>
              </form>
            </motion.div>

            {/* SECURITY SECTION */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Security</h3>
              </div>

              <form onSubmit={changePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder="••••••••"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound size={18} className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 ml-1">Must be at least 6 characters long.</p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-purple-600/20 disabled:opacity-70 mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? "Updating..." : <><Lock size={18} /> Update Password</>}
                </motion.button>
              </form>
            </motion.div>

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default Settings;
