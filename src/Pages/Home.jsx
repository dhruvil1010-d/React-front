import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    { icon: "🏠", label: "Home", path: "/home" },
    { icon: "📱", label: "Phones", path: "/filter" },
    { icon: "🛒", label: "Cart", path: "/cart"},
    { icon: "📦", label: "Orders", path: "/orders" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  if (user && user.role === "admin") {
    menuItems.push({ icon: "🛡️", label: "Admin Panel", path: "/admin" });
  }

  const filteredPhones = phones.filter(phone =>
    phone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-900 to-purple-900 text-white transition-all duration-300 fixed h-full z-20`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ⭐ StarPhone
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-4 py-3 mb-2 hover:bg-white/10 rounded-lg transition text-left"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-lg transition"
          >
            <span className="text-xl">🔓</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search phones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 pl-12 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 ml-4">
              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <span>🔔</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "user@starphone.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl font-bold mb-4">Welcome to StarPhone</h1>
              <p className="text-xl mb-8">Discover the latest smartphones at the best prices</p>
           
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute top-40 right-40 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>

        {/* Featured Phones Section */}
        <div className="px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Phones</h2>
          </div>

          {/* Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhones.map((phone) => (
              <div
                key={phone._id || phone.id}
                onClick={() => handlePhoneClick(phone._id || phone.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Image Container */}
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{phone.name}</h3>
                  <div className="mt-1 flex items-center justify-between ">
                    <span className=" items-center text-xl font-bold text-blue-600  mb-20 ">₹{phone.price}</span>
                    <button 
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
                      }}
                      
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm whitespace-nowrap">
                      Add to Cart
                    </button>
                 
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPhones.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No phones found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="px-6 py-12 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose StarPhone?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Free Delivery</h3>
              <p className="text-gray-600">Fast and free delivery on all orders above ₹500</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment with multiple payment options</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day easy return policy on all products</p>
            </div>
          </div>
        </div>


        <footer className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">⭐ StarPhone</h3>
              <p className="text-gray-400">Your trusted destination for the latest smartphones</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-800 text-gray-400">
            © 2026 StarPhone. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;
