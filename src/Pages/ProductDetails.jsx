import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Phone data will be fetched from backend database

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`);
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

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/add-to-cart`, {
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
        alert("Added to cart!");
        navigate("/cart");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-xl font-bold bg-gray-50">Loading product...</div>;

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! {error}</h1>
        <p className="text-gray-600 mb-8">The phone you are looking for might have been removed.</p>
        <button onClick={() => navigate("/home")} className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 font-bold transition">← Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => navigate("/home")} className="text-blue-600 font-medium hover:underline text-lg flex items-center gap-2 mb-8">
          <span>←</span> Back to Home
        </button>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Image Container */}
          <div className="md:w-1/2 bg-white flex items-center justify-center p-12 relative group h-96 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 opacity-50"></div>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full max-w-sm object-contain z-10 transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>

          {/* Details Container */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-bold text-sm rounded-full w-max mb-4 border border-blue-200">
              In Stock
            </span>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm">
              {product.name}
            </h1>
            
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 drop-shadow-sm">
              {product.price}
            </div>

            <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>✨</span> Key Features
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.details}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <span>🛒</span> Add to Cart
              </button>
            </div>

            {/* Extra Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                  🚚
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Free Delivery</h4>
                  <p className="text-xs text-gray-500">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-2xl">
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">1 Year Warranty</h4>
                  <p className="text-xs text-gray-500">Brand authorized</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
