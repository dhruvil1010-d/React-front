import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Trash2, 
  ShoppingCart,
  CreditCard,
  PackageX
} from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    fetchCartItems();
  }, []);

  // ================= FETCH CART =================
  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cart/${user.email}`
      );

      if (!response.ok) {
        setCartItems([]);
      } else {
        const data = await response.json();
        console.log("Cart Data:", data);
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (id) => {
    try {
      // Optimistic UI update
      setCartItems(prev => prev.filter(item => item._id !== id));
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cart/remove/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        // Revert if failed
        fetchCartItems();
        alert("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      fetchCartItems();
    }
  };

  // ================= TOTAL FIX =================
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let price = item.price;

      // Handle both number and string (old data safety)
      if (typeof price === "string") {
        price = Number(price.replace(/[^0-9]/g, ""));
      }

      return total + (price || 0) * (item.quantity || 1);
    }, 0);
  };

  // ================= ANIMATIONS =================
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.3 } }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50/50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen bg-gray-50/50 py-12 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-500 font-medium hover:text-blue-600 transition-colors text-lg flex items-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <ShoppingCart className="text-blue-600" /> Your Cart
          </h1>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageX size={40} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any smartphones to your cart yet. Discover our premium collection!
            </p>

            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20"
            >
              Browse Phones
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* CART ITEMS LIST */}
            <div className="lg:col-span-2">
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      key={item._id}
                      className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group"
                    >
                      {/* IMAGE */}
                      <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center p-4">
                        <img
                          src={item.image}
                          alt={item.phonename}
                          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.phonename}
                        </h3>

                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                          {item.phonedetails}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-sm text-gray-400 font-medium">Price</p>
                            <p className="text-xl font-black text-blue-600">
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-400 font-medium">Qty</p>
                            <p className="font-bold text-gray-900">{item.quantity}</p>
                          </div>
                        </div>
                      </div>

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors sm:self-start"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* ORDER SUMMARY */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm font-medium">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{calculateTotal().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Estimate</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax Estimate</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      ₹{calculateTotal().toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2"
                  onClick={() => navigate("/orders")}
                >
                  <CreditCard size={20} /> Proceed to Checkout
                </motion.button>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Cart;
