import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Images
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

// ✅ Static Data
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

  // ✅ Get user
  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  // 💰 Price Filter
  const checkPrice = (price, range) => {
    if (range === "10-20") return price >= 10000 && price <= 20000;
    if (range === "20-50") return price >= 20000 && price <= 50000;
    if (range === "50-70") return price >= 50000 && price <= 70000;
    if (range === "70-100") return price >= 70000 && price <= 100000;
    if (range === "100+") return price > 100000;
    return true;
  };

  // 🔍 Filter Logic
  let filtered = products.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (brand ? item.brand === brand : true) &&
      (ram ? item.ram === ram : true) &&
      (storage ? item.storage === storage : true) &&
      (priceRange ? checkPrice(item.price, priceRange) : true)
    );
  });

  // 🔃 Sorting
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  // 🛒 Add to Cart
  const handleAddToCart = async (item) => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        alert("✅ Added to cart!");
        navigate("/cart");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 Sidebar */}
      <div className="w-64 bg-white p-5 shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <input
          placeholder="Search..."
          className="w-full mb-4 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="w-full mb-3 p-2 border rounded" onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          <option>Apple</option>
          <option>Samsung</option>
          <option>Realme</option>
          <option>Google</option>
          <option>Motorola</option>
        </select>

        <select className="w-full mb-3 p-2 border rounded" onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">Price</option>
          <option value="10-20">₹10k - ₹20k</option>
          <option value="20-50">₹20k - ₹50k</option>
          <option value="50-70">₹50k - ₹70k</option>
          <option value="70-100">₹70k - ₹1L</option>
          <option value="100+">₹1L+</option>
        </select>

        <select className="w-full mb-3 p-2 border rounded" onChange={(e) => setRam(e.target.value)}>
          <option value="">RAM</option>
          <option>8GB</option>
          <option>12GB</option>
        </select>

        <select className="w-full mb-3 p-2 border rounded" onChange={(e) => setStorage(e.target.value)}>
          <option value="">Storage</option>
          <option>128GB</option>
          <option>256GB</option>
        </select>

        <select className="w-full mb-3 p-2 border rounded" onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setBrand("");
            setPriceRange("");
            setRam("");
            setStorage("");
            setSort("");
          }}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Clear Filters
        </button>

        {/* Back */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>

      {/* 📱 Products */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">📱 Phone Store</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow hover:shadow-xl transition p-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-contain mb-3"
                />

                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand}</p>

                <p className="text-lg font-bold text-blue-600 mt-2">
                  ₹{item.price}
                </p>

                <p className="text-sm text-gray-600">
                  {item.ram} | {item.storage}
                </p>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>

              </div>
            ))
          ) : (
            <p>No phones found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Phonefilter;
