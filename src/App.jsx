import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import About from "./Pages/About";
import AdminLogin from "./Pages/AdminLogin";
import Settings from "./Pages/Setting";
import Orders from "./Pages/Orders";
import AdminDashboard from "./Pages/AdminDashboard";
import Phonefilter from "./Pages/Phonefilter";


// ProtectedRoute - only logged-in users can access
function ProtectedRoute({ children }) {
  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  return user ? children : <Navigate to="/login" />;
}

// AuthRoute - prevent logged-in users from opening login/register
function AuthRoute({ children }) {
  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  if (user) {
    return user.role === "admin"
      ? <Navigate to="/admin" />
      : <Navigate to="/home" />;
  }

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        
        <Route path="/admin-login" element={<AuthRoute><AdminLogin /></AuthRoute>} />

        {/* User Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/filter" element={<ProtectedRoute><Phonefilter /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
