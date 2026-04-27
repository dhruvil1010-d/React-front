import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Users, 
  Package, 
  Home, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    ram: "",
    storage: "",
    image: "",
    details: "",
    description: "",
    features: ""
  });

  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/home");
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products") {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/all`);
        setProducts(await res.json());
      } else if (activeTab === "users") {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
        setUsers(await res.json());
      } else if (activeTab === "orders") {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`);
        setOrders(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const productToSave = {
      ...newProduct,
      price: Number(newProduct.price),
      features: typeof newProduct.features === "string"
        ? newProduct.features.split(",").map(f => f.trim()).filter(Boolean)
        : Array.isArray(newProduct.features)
          ? newProduct.features
          : []
    };

    const url = editingProductId
      ? `${import.meta.env.VITE_API_BASE_URL}/products/${editingProductId}`
      : `${import.meta.env.VITE_API_BASE_URL}/products`;

    const method = editingProductId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave)
      });

      if (res.ok) {
        setEditingProductId(null);
        setNewProduct({
          name: "", brand: "", price: "", ram: "", storage: "", image: "", details: "", description: "", features: ""
        });
        fetchData();
      }
    } catch (err) {
      alert(editingProductId ? "Error updating product" : "Error adding product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price || "",
      ram: product.ram || "",
      storage: product.storage || "",
      image: product.image || "",
      details: product.details || "",
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : product.features || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "", brand: "", price: "", ram: "", storage: "", image: "", details: "", description: "", features: ""
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // ================= PRODUCTS TAB =================
  const renderProducts = () => (
    <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-8">
      {/* ADD / EDIT PRODUCT FORM */}
      <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {editingProductId ? <Edit2 className="text-blue-600" /> : <Plus className="text-blue-600" />}
          {editingProductId ? "Update Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Phone Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />

          <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Brand" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} required />

          <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Price (₹)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />

          <div className="flex gap-4">
            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="RAM (e.g. 8GB)" value={newProduct.ram} onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} required />
            <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Storage (e.g. 128GB)" value={newProduct.storage} onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })} required />
          </div>

          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer md:col-span-2 group">
            <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {newProduct.image ? (
              <div className="flex items-center gap-4">
                <img src={newProduct.image} alt="Preview" className="h-16 object-contain rounded" />
                <span className="text-sm font-bold text-blue-600">Change Image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <ImageIcon size={32} className="mb-2 text-gray-400 group-hover:text-blue-500 transition" />
                <span className="font-medium text-sm">Click or drag image to upload</span>
              </div>
            )}
          </div>

          <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Short Details" value={newProduct.details} onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })} />

          <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Features (comma separated)" value={newProduct.features} onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })} />

          <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 md:col-span-2 h-32 resize-none"
            placeholder="Full Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />

          <div className="md:col-span-2 flex gap-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/20">
              {editingProductId ? "Save Changes" : "Create Product"}
            </motion.button>
            {editingProductId && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition">
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{products.length} Products</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Specs</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="hidden" animate="show" className="divide-y divide-gray-100">
              {products.map((p) => (
                <motion.tr variants={itemFade} key={p._id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                        <div className="text-gray-500 text-xs">{p.brand || "Unbranded"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{p.ram}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{p.storage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">₹{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEditProduct(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // ================= USERS TAB =================
  const renderUsers = () => (
    <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="text-blue-600" /> Users & Admins</h2>
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{users.length} Users</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody variants={staggerContainer} initial="hidden" animate="show" className="divide-y divide-gray-100">
            {users.map((u) => (
              <motion.tr variants={itemFade} key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{u.phonenumber || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {u.role !== "admin" && (
                    <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );

  // ================= ORDERS TAB =================
  const renderOrders = () => (
    <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Package className="text-blue-600" /> Order History</h2>
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{orders.length} Orders</span>
      </div>

      <div className="p-8 space-y-6">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6">
          {orders.map((o) => (
            <motion.div variants={itemFade} key={o._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:border-blue-100 transition-colors">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900">{o.username}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{o.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{o.email} • {new Date(o.date).toLocaleString()}</div>
                </div>
                <div className="text-xl font-black text-gray-900">₹{o.total.toLocaleString()}</div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 bg-white">
                <div className="space-y-3">
                  {o.items && o.items.length > 0 ? (
                    o.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.phonename} className="w-10 h-10 object-contain mix-blend-multiply" />
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{item.phonename}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No items found.</p>
                  )}
                </div>
              </div>

              {/* Order Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <select 
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
                  value={o.status}
                  onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gray-900 text-white fixed h-full shadow-2xl flex flex-col z-20 hidden md:flex">
        <div className="p-8 border-b border-gray-800">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
            <LayoutDashboard size={28} className="text-blue-400" /> Admin
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab("products")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === "products" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            <Smartphone size={20} /> Inventory
          </button>
          
          <button 
            onClick={() => setActiveTab("users")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            <Users size={20} /> Users
          </button>

          <button 
            onClick={() => setActiveTab("orders")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === "orders" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            <Package size={20} /> Orders
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={() => navigate("/home")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-bold transition-colors">
            <Home size={20} /> Public Site
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl font-bold transition-colors">
            <LogOut size={20} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Mobile Topbar Placeholder */}
      <div className="md:hidden fixed top-0 w-full bg-gray-900 text-white p-4 z-30 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard size={20} className="text-blue-400" /> Admin</h1>
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
          <LogOut size={20} />
        </button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-gray-900 text-white z-30 flex shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab("products")} className={`flex-1 p-4 flex flex-col items-center gap-1 ${activeTab === "products" ? "text-blue-400" : "text-gray-400"}`}>
          <Smartphone size={20} />
          <span className="text-xs font-bold">Products</span>
        </button>
        <button onClick={() => setActiveTab("users")} className={`flex-1 p-4 flex flex-col items-center gap-1 ${activeTab === "users" ? "text-blue-400" : "text-gray-400"}`}>
          <Users size={20} />
          <span className="text-xs font-bold">Users</span>
        </button>
        <button onClick={() => setActiveTab("orders")} className={`flex-1 p-4 flex flex-col items-center gap-1 ${activeTab === "orders" ? "text-blue-400" : "text-gray-400"}`}>
          <Package size={20} />
          <span className="text-xs font-bold">Orders</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-6 pt-20 md:pt-10 pb-24 md:pb-10 max-w-7xl relative overflow-x-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {loading ? (
          <div className="h-full min-h-[50vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "products" && <motion.div key="products">{renderProducts()}</motion.div>}
            {activeTab === "users" && <motion.div key="users">{renderUsers()}</motion.div>}
            {activeTab === "orders" && <motion.div key="orders">{renderOrders()}</motion.div>}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
