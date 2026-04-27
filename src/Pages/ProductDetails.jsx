import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  CheckCircle,
  Star
} from "lucide-react";

// Phone data will be fetched from backend database

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.name,
          email: user.email,
          phonenumber: user.phonenumber || "",
          address: user.address || "",
          phonename: product.name,
          phonedetails: product.details,
          price: product.price,
          quantity: 1,
          image: product.image
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
    } finally {
      setAddingToCart(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

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

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50/50">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! {error}</h1>
        <p className="text-gray-600 mb-8">The phone you are looking for might have been removed.</p>
        <button onClick={() => navigate("/home")} className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold transition flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </button>
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
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/home")} 
          className="text-gray-500 font-medium hover:text-blue-600 transition-colors text-lg flex items-center gap-2 mb-10 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        {/* Product Details Section */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Image Container */}
          <div className="lg:w-1/2 bg-[#f8fafc] flex items-center justify-center p-12 relative overflow-hidden h-[500px] lg:h-auto group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-purple-50/50 to-transparent opacity-50 z-0"></div>
            
            {/* Decorative background blob */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 bg-blue-200/40 rounded-full blur-3xl z-0"
            ></motion.div>

            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              src={product.image} 
              alt={product.name} 
              className="w-full h-full max-w-md object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details Container */}
          <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-1.5 bg-green-50 text-green-700 font-bold text-sm rounded-full border border-green-200/50 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle size={14} /> In Stock
                </span>
                <span className="px-4 py-1.5 bg-gray-50 text-gray-600 font-bold text-sm rounded-full border border-gray-200/50 flex items-center gap-1.5 shadow-sm">
                  <Star size={14} className="fill-gray-400 text-gray-400" /> Premium Device
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 inline-block">
                ₹{product.price}
              </div>

              <div className="mb-10 bg-gray-50/80 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Key Specifications
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                  {product.details}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4.5 rounded-2xl text-lg transition shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <ShoppingCart size={22} /> Add to Cart
                    </>
                  )}
                </motion.button>
              </div>

              {/* Extra Info */}
              <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Free Delivery</h4>
                    <p className="text-sm text-gray-500 font-medium">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">1 Year Warranty</h4>
                    <p className="text-sm text-gray-500 font-medium">Brand authorized</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetails;
