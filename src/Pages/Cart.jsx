import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        `${process.env.REACT_APP_API_BASE_URL}/cart/${user.email}`
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
    const confirmDelete = window.confirm("Remove this item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/cart/remove/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        fetchCartItems();
      } else {
        alert("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
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

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 text-lg font-medium hover:underline"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            🛒 Your Cart
          </h1>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <p className="text-xl text-gray-500 mb-6">
              Your cart is empty
            </p>

            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Phones
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* CART ITEMS */}
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center gap-6 p-6 border-b"
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.phonename}
                  className="w-28 h-28 object-contain"
                />

                {/* DETAILS */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.phonename}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.phonedetails}
                  </p>

                  <p className="text-blue-600 font-bold mt-2">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>

                  <p className="text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* TOTAL SECTION */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-800">
                  Total
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  ₹{calculateTotal().toLocaleString("en-IN")}
                </span>
              </div>

              <button
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
                onClick={() => navigate("/orders")}
              >
                Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;