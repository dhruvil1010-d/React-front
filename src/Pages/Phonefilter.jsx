import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  X, 
  ShoppingCart,
  Smartphone,
  Cpu,
  HardDrive
} from "lucide-react";

//  Images
import i15pro from "../assets/images/i15pro.jpg";
import i17pro from "../assets/images/i17pro.jpeg";
import s24 from "../assets/images/Galaxy S24 FE (8GB).jpg";
import s26ultra from "../assets/images/s26.webp";
import realme from "../assets/images/realme12 Pro+5G.jpg";
import pixel from "../assets/images/Google Pixel 8 Pro (128GB).jpg";
import moto from "../assets/images/motoedge50pro.jpg";
import iphone16 from "../assets/images/iphone16pro.webp";
import iphone14 from "../assets/images/iPhone 14 (128GB).jpg";
import realme11 from "../assets/images/realme11x 5G.jpg";
import realmeNarzo from "../assets/images/realmeNarzo70Pro.jpg";
import motoG84 from "../assets/images/MotoG84.jpeg"; 
import motoEdge40 from "../assets/images/motorazr40ultra.jpg";
import pixel7 from "../assets/images/Google Pixel 7 (128GB).jpg";
import pixel8 from "../assets/images/Google Pixel 8 (128GB).jpg";
import samsungS23 from "../assets/images/Galaxy S23 FE (8GB).jpg";
import samsungS24 from "../assets/images/Galaxy S24 FE (8GB).jpg"; 

//  Static Data
const phonesData = [
  { id: 1, name: "iPhone 15 Pro", brand: "Apple", price: 80000, ram: "8GB", storage: "128GB", image: i15pro },
  { id: 2, name: "iPhone 17 Pro", brand: "Apple", price: 120000, ram: "12GB", storage: "256GB", image: i17pro },
  { id: 3, name: "Samsung S24", brand: "Samsung", price: 75000, ram: "8GB", storage: "128GB", image: s24 },
  { id: 4, name: "Samsung S26 Ultra", brand: "Samsung", price: 110000, ram: "12GB", storage: "256GB", image: s26ultra },
  { id: 5, name: "Realme 12 Pro+", brand: "Realme", price: 30000, ram: "8GB", storage: "128GB", image: realme },
  { id: 6, name: "Pixel 8 Pro", brand: "Google", price: 90000, ram: "12GB", storage: "256GB", image: pixel },
  { id: 7, name: "Moto Edge 50 Pro", brand: "Motorola", price: 40000, ram: "8GB", storage: "256GB", image: moto },
  { id: 8, name: "iPhone 16", brand: "Apple", price: 90000, ram: "8GB", storage: "128GB", image: iphone16 },
  { id: 9, name: "iPhone 14", brand: "Apple", price: 70000, ram: "6GB", storage: "128GB", image: iphone14 },
  { id: 10, name: "Realme 11 Pro+", brand: "Realme", price: 28000, ram: "8GB", storage: "256GB", image: realme11 },
  { id: 11, name: "Realme Narzo 60", brand: "Realme", price: 18000, ram: "6GB", storage: "128GB", image: realmeNarzo },
  { id: 12, name: "Moto G84", brand: "Motorola", price: 20000, ram: "8GB", storage: "128GB", image: motoG84 },
  { id: 13, name: "Moto Edge 40", brand: "Motorola", price: 30000, ram: "8GB", storage: "256GB", image: motoEdge40 },
  { id: 14, name: "Pixel 7", brand: "Google", price: 60000, ram: "8GB", storage: "128GB", image: pixel7 },
  { id: 15, name: "Pixel 8", brand: "Google", price: 75000, ram: "8GB", storage: "256GB", image: pixel8 },
  { id: 16, name: "Samsung Galaxy S23", brand: "Samsung", price: 70000, ram: "8GB", storage: "128GB", image: samsungS23 },
  { id: 17, name: "Samsung Galaxy S24", brand: "Samsung", price: 75000, ram: "8GB", storage: "128GB", image: samsungS24 }
];

function Phonefilter() {
  const navigate = useNavigate();

  const [products] = useState(phonesData);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [sort, setSort] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  const checkPrice = (price, range) => {
    if (range === "10-20") return price >= 10000 && price <= 20000;
    if (range === "20-50") return price >= 20000 && price <= 50000;
    if (range === "50-70") return price >= 50000 && price <= 70000;
    if (range === "70-100") return price >= 70000 && price <= 100000;
    if (range === "100+") return price > 100000;
    return true;
  };

  let filtered = products.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (brand ? item.brand === brand : true) &&
      (ram ? item.ram === ram : true) &&
      (storage ? item.storage === storage : true) &&
      (priceRange ? checkPrice(item.price, priceRange) : true)
    );
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const handleAddToCart = async (item) => {
    if (!user) {
      alert("Please login first");
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
          phonename: item.name,
          phonedetails: `${item.brand} | ${item.ram} | ${item.storage}`,
          price: item.price,
          quantity: 1,
          image: item.image,
        }),
      });

      if (response.ok) {
        navigate("/cart");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // Animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex flex-col md:flex-row min-h-screen bg-gray-50/50"
    >
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => navigate("/home")} className="text-gray-500 hover:text-blue-600 transition p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Phones</h1>
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="p-2 bg-blue-50 text-blue-600 rounded-xl"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* 🔥 Sidebar Filters */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 bg-white shadow-[10px_0_40px_rgba(0,0,0,0.03)] border-r border-gray-100 z-40 transform transition-transform duration-300 flex flex-col
        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="text-blue-600" size={20} /> Filters
            </h2>
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-900" onClick={() => setIsMobileFiltersOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative group">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  placeholder="Find a phone..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Brand</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none" 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Realme">Realme</option>
                <option value="Google">Google</option>
                <option value="Motorola">Motorola</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Price Range</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none" 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="10-20">₹10k - ₹20k</option>
                <option value="20-50">₹20k - ₹50k</option>
                <option value="50-70">₹50k - ₹70k</option>
                <option value="70-100">₹70k - ₹1L</option>
                <option value="100+">₹1L+</option>
              </select>
            </div>

            {/* RAM */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">RAM</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none" 
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              >
                <option value="">Any RAM</option>
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
                <option value="12GB">12GB</option>
              </select>
            </div>

            {/* Storage */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Storage</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none" 
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              >
                <option value="">Any Storage</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Sort By</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none" 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <button
            onClick={() => {
              setSearch(""); setBrand(""); setPriceRange(""); setRam(""); setStorage(""); setSort("");
            }}
            className="w-full bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
          >
            Clear Filters
          </button>
          <button
            onClick={() => navigate("/home")}
            className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}

      {/* 📱 Products Grid */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Our Collection</h1>
            <p className="text-gray-500 mt-1">Showing {filtered.length} premium smartphones</p>
          </div>
        </div>

        {filtered.length > 0 ? (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div 
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={item.id} 
                  className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden group hover:border-blue-100 hover:shadow-[0_20px_60px_rgba(37,99,235,0.05)] transition-all duration-300 flex flex-col"
                >
                  <div 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="h-64 bg-gray-50/50 p-8 flex items-center justify-center relative cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col bg-white z-10 relative">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{item.brand}</p>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{item.name}</h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
                        <Cpu size={12} /> {item.ram}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
                        <HardDrive size={12} /> {item.storage}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-xl font-black text-gray-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition"
                      >
                        <ShoppingCart size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Smartphone size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No phones found</h2>
            <p className="text-gray-500">Try adjusting your filters or search term to find what you're looking for.</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

export default Phonefilter;
