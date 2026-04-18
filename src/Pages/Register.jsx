import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import bgImage from "../assets/images/reacthome.png";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phonenumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Success Toast
        toast.success("Registration Successful 🎉", {
          duration: 3000,
        });

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

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ✅ Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1f2937",
            color: "#fff",
          },
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl"
        >
          {/* Logo */}
          <h2 className="text-4xl font-extrabold text-center text-white mb-2 tracking-wide">
            ⭐ StarPhone
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Create your account
          </p>

          {/* Inputs */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="tel"
            name="phonenumber"
            placeholder="Phone Number"
            value={formData.phonenumber}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-300 mt-5 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;