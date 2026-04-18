import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
      });
    }
  }, []);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Update Profile
  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!profileData.name.trim()) {
      return setError("Full Name is required.");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(profileData.phonenumber)) {
      return setError("Phone number must be exactly 10 digits.");
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...existingUser, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage("Profile updated successfully!");
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  // Change Password
  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwordData.newPassword.length < 6) {
      return setError("New Password must be at least 6 characters long.");
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        ...passwordData,
        email: user?.email,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        setError(data.message || "Password change failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { icon: "🏠", label: "Home", path: "/home" },
    { icon: "📱", label: "Phones", path: "/phones" },
    { icon: "🛒", label: "Cart", path: "/cart" },
    { icon: "📦", label: "Orders", path: "/orders" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white fixed h-full z-20">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-2xl font-bold">⭐ StarPhone</h1>
        </div>

        <nav className="mt-6 px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg hover:bg-white/10 transition text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-500/20 text-red-300 rounded-lg transition"
          >
            <span className="text-xl">🔓</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Settings Content */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full ml-64">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            ⚙️ Settings
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">
              {message}
            </div>
          )}

          {/* Update Profile */}
          <form onSubmit={updateProfile}>
            <h3 className="font-bold mb-2 text-gray-700">Update Profile</h3>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="w-full p-2 mb-3 border rounded"
              required
            />

            <input
              type="email"
              name="email"
              value={profileData.email}
              readOnly
              className="w-full p-2 mb-3 border rounded bg-gray-100"
            />

            <input
              type="tel"
              name="phonenumber"
              placeholder="Phone Number"
              value={profileData.phonenumber}
              onChange={handleProfileChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />

            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Update Profile
            </button>
          </form>

          <hr className="my-6" />

          {/* Change Password */}
          <form onSubmit={changePassword}>
            <h3 className="font-bold mb-2 text-gray-700">Change Password</h3>

            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 mb-3 border rounded"
              required
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />

            <button className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
              Change Password
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            🔓 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
