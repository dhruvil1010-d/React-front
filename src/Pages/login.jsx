import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import bgImage from "../assets/images/reacthome.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data and token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        toast.success("Login Successful! 🎉");

        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
      
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Please try again!");
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
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

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
            Login to your account
          </p>

          {/* Error (optional keep) */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Inputs */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-300 mt-5 text-sm">
            Not registered yet?{" "}
            <Link
              to="/register"
              className="text-purple-400 font-semibold hover:underline"
            >
              Register
            </Link>
          

          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
