import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home as HomeIcon, 
  Smartphone, 
  ShoppingCart, 
  Package, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Bell, 
  Menu,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCcw,
  Star
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [phones, setPhones] = useState([]);
  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/all`);
      const data = await response.json();
      if (data && data.length > 0) {
        setPhones(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePhoneClick = (phoneId) => {
    navigate(`/product/${phoneId}`);
  };

  const menuItems = [
    { icon: <HomeIcon size={20} />, label: "Home", path: "/home" },
    { icon: <Smartphone size={20} />, label: "Phones", path: "/filter" },
    { icon: <ShoppingCart size={20} />, label: "Cart", path: "/cart"},
    { icon: <Package size={20} />, label: "Orders", path: "/orders" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  if (user && user.role === "admin") {
    menuItems.push({ icon: <ShieldCheck size={20} />, label: "Admin Panel", path: "/admin" });
  }

  const filteredPhones = phones.filter(phone =>
    phone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.5 } },
    out: { opacity: 0, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex min-h-screen bg-gray-50/50 selection:bg-blue-200"
    >
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.4, ease: "anticipate" }}
        className="bg-[#0f172a] text-white fixed h-full z-30 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, position: "absolute" }}
                className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight flex items-center gap-2"
              >
                <Star className="text-yellow-400 fill-yellow-400" size={24}/> StarPhone
              </motion.h1>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-3 flex-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-4 py-3.5 mb-2 hover:bg-blue-500/10 text-gray-400 hover:text-white rounded-xl transition-all duration-300 group"
            >
              <div className="group-hover:scale-110 group-hover:text-blue-400 transition-transform">
                {item.icon}
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: "absolute" }}
                    className="font-semibold"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform"/>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, position: "absolute" }}
                  className="font-semibold"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      <main 
        className="flex-1 transition-all duration-400 ease-anticipate flex flex-col min-h-screen" 
        style={{ marginLeft: sidebarOpen ? 260 : 80 }}
      >
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-20 transition-colors">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for smartphones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 pl-12 py-3 bg-gray-100/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white border border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6 ml-6">
              <button className="p-2.5 hover:bg-gray-100 rounded-xl relative transition-colors text-gray-600">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              <div className="h-8 w-px bg-gray-200"></div>

              {/* User Profile */}
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-bold text-gray-900 leading-tight">{user?.name || "User"}</p>
                  <p className="text-gray-500 text-xs">{user?.email || "user@starphone.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative h-[450px] bg-[#020617] overflow-hidden m-6 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 z-0"></div>
          <motion.div 
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 z-0 mix-blend-overlay"
          ></motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-white px-4 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium mb-6 text-blue-200">
                  ✨ The Future of Mobile is Here
                </span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">StarPhone</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
                  Discover the latest smartphones with cutting-edge technology at the best prices.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                  onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Collection
                </motion.button>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-64 h-64 bg-blue-500/30 rounded-full blur-[100px]"
          ></motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"
          ></motion.div>
        </div>

        {/* Featured Phones Section */}
        <div id="featured" className="px-8 py-12 flex-1">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Featured Collection</h2>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition flex items-center gap-1 group">
              View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          {/* Phone Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredPhones.map((phone) => (
              <motion.div
                variants={itemVariants}
                key={phone._id || phone.id}
                onClick={() => handlePhoneClick(phone._id || phone.id)}
                className="bg-white rounded-3xl border border-gray-100 hover:border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="h-60 bg-gray-50/50 flex items-center justify-center p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    transition={{ duration: 0.4 }}
                    src={phone.image}
                    alt={phone.name}
                    className="max-h-full object-contain relative z-10 drop-shadow-xl"
                  />
                  {/* Quick Add Button Overlay */}
                  <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button className="bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{phone.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{phone.details || "Experience the next level of mobile technology."}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Starting at</p>
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">₹{phone.price}</span>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!user) {
                          alert("Please login to add items to cart");
                          navigate("/login");
                          return;
                        }

                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-to-cart`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              username: user.name,
                              email: user.email,
                              phonenumber: user.phonenumber || "",
                              address: user.address || "",
                              phonename: phone.name,
                              phonedetails: phone.details || phone.name,
                              price: phone.price,
                              quantity: 1,
                              image: phone.image
                            })
                          });
                          
                          if (response.ok) {
                            navigate("/cart");
                          } else {
                            const errorData = await response.json();
                            alert(errorData.message || "Failed to add to cart");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Error connecting to server");
                        }
                      }}
                      className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors font-bold text-sm"
                    >
                      Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredPhones.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-gray-100"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-bold text-xl mb-2">No phones found</p>
              <p className="text-gray-500">We couldn't find any phones matching "{searchQuery}"</p>
            </motion.div>
          )}
        </div>

        {/* Features Section */}
        <div className="px-8 py-16 bg-white/50 border-y border-gray-100 mt-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-12 tracking-tight">The StarPhone Experience</h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div variants={itemVariants} className="text-center p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                  <Truck className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Free Express Delivery</h3>
                <p className="text-gray-500 leading-relaxed">Fast and free delivery on all orders above ₹500 across the country.</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                  <Shield className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Secure Payment</h3>
                <p className="text-gray-500 leading-relaxed">Your transactions are protected with military-grade encryption.</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                  <RefreshCcw className="text-pink-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">30-Day Easy Returns</h3>
                <p className="text-gray-500 leading-relaxed">Not satisfied? Return it within 30 days for a full refund, no questions asked.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#0f172a] text-white py-16 px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={28}/> StarPhone
              </h3>
              <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
                Elevating your mobile experience with the world's most premium smartphones and unmatched customer service.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="text-gray-400 space-y-3 font-medium">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/home" className="hover:text-blue-400 transition-colors">Shop</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 tracking-wide">Support</h4>
              <ul className="text-gray-400 space-y-3 font-medium">
                <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-blue-400 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-blue-400 transition-colors">Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-16 pt-8 border-t border-white/10 text-gray-500 font-medium relative z-10">
            © {new Date().getFullYear()} StarPhone. All rights reserved.
          </div>
        </footer>
      </main>
    </motion.div>
  );
}

export default Home;
