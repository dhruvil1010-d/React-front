import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products`);
        setProducts(await res.json());
      } else if (activeTab === "users") {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`);
        setUsers(await res.json());
      } else if (activeTab === "orders") {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders`);
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
      ? `${process.env.REACT_APP_API_BASE_URL}/products/${editingProductId}`
      : `${process.env.REACT_APP_API_BASE_URL}/products`;

    const method = editingProductId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave)
      });

      if (res.ok) {
        alert(editingProductId ? "Product updated successfully!" : "Product added successfully!");
        setEditingProductId(null);
        setNewProduct({
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
      features: Array.isArray(product.features)
        ? product.features.join(", ")
        : product.features || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({
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
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`, {
        method: "DELETE"
      });
      fetchData();
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`, {
        method: "DELETE"
      });
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}`, {
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

  // ================= PRODUCTS =================
  const renderProducts = () => (
    <div className="space-y-10">

      {/* ADD PRODUCT */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-2xl font-semibold mb-6">
          {editingProductId ? "Update Phone" : "Add New Phone"}
        </h2>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required />

          <input className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            required />

          <input type="number" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required />

          <input className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="RAM"
            value={newProduct.ram}
            onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })}
            required />

          <input className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Storage"
            value={newProduct.storage}
            onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })}
            required />

          <input type="file" onChange={handleImageChange} />

          <input className="p-3 border rounded-xl"
            placeholder="Details"
            value={newProduct.details}
            onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })} />

          <textarea className="p-3 border rounded-xl md:col-span-2"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />

          <input className="p-3 border rounded-xl md:col-span-2"
            placeholder="Features"
            value={newProduct.features}
            onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })} />

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
            {editingProductId && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-2xl font-semibold mb-6">Products</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">RAM</th>
                <th className="p-4">Storage</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, i) => (
                <tr key={p._id}
                  className={`border-b hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>

                  <td className="p-4">
                    <img src={p.image} className="w-14 h-14 object-contain border rounded" />
                  </td>

                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.brand || "-"}</td>
                  <td className="p-4 text-blue-600 font-semibold">₹{p.price}</td>
                  <td className="p-4">{p.ram || "-"}</td>
                  <td className="p-4">{p.storage || "-"}</td>

                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="px-4 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="px-4 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
// ================= USERS =================
const renderUsers = () => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
      <span className="text-sm text-gray-500">
        Total: {users.length}
      </span>
    </div>

    {/* USER LIST */}
    <div className="space-y-3">
      {users.map((u, index) => (
        <div
          key={u._id}
          className={`flex items-center justify-between p-4 rounded-xl border transition hover:shadow-sm ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {u.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-gray-800">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* ROLE */}
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                u.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {u.role}
            </span>

            {/* DELETE */}
            {u.role !== "admin" && (
              <button
                onClick={() => handleDeleteUser(u._id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            )}

          </div>

        </div>
      ))}
    </div>
  </div>
);

    //============ ORDER LIST ============
const renderOrders = () => (
   <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
      <span className="text-sm text-gray-500">
        Total: {orders.length}
      </span>
    </div>

    {/* ORDER LIST */}
     <div className="space-y-4">
      {orders.map((o, index) => (
        <div
          key={o._id}
          className={`p-5 rounded-xl border transition hover:shadow-sm ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >

          {/* TOP ROW */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800 text-lg">
                {o.username}
              </p>
              <p className="text-sm text-gray-500">
                {o.email}
              </p>
            </div>

            <div className="text-xl font-bold text-blue-600">
              ₹{o.total}
            </div>
          </div>

          {/* DATE */}
          <p className="text-sm text-gray-500 mt-2">
            {new Date(o.date).toLocaleDateString()}
          </p>

      
          {/* ITEMS */}
          <div className="mt-4 border-t pt-3 space-y-2">
            <p className="text-sm font-semibold text-gray-700">Items:</p>

            {o.items && o.items.length > 0 ? (
              o.items.map((item, i) => (
                <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">

                  <div className="flex gap-2 items-center">
                    <img src={item.image} className="w-10 h-10" />
                    <div>
                      <p>{item.phonename}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <p>₹{item.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No items</p>
            )}

          </div>

        </div>
      ))}
    </div>
  </div>
);
   

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">Admin Panel</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab("products")} className="w-full p-3 hover:bg-slate-800 rounded">📱 Products</button>
          <button onClick={() => setActiveTab("users")} className="w-full p-3 hover:bg-slate-800 rounded">👥 Users</button>
          <button onClick={() => setActiveTab("orders")} className="w-full p-3 hover:bg-slate-800 rounded">📦 Orders</button>
          <button onClick={() => navigate("/home")} className="w-full p-3 hover:bg-slate-800 rounded">🏠 Home</button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-64 p-8">
        {loading ? <p>Loading...</p> : (
          <>
            {activeTab === "products" && renderProducts()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "orders" && renderOrders()}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;