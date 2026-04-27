import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Package, 
  Download, 
  CreditCard,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";

function Orders() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    address: "",
  });

  const userData = localStorage.getItem("user");
  const user =
    userData && userData !== "undefined" ? JSON.parse(userData) : null;

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phonenumber: user.phonenumber || "",
      address: user.address || "",
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cartRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cart/${user.email}`
      );
      const cartData = await cartRes.json();
      setCartItems(cartData);

      const totalPrice = cartData.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity,
        0
      );
      setTotal(totalPrice);

      const orderRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orders/user/${user.email}`
      );
      const orderData = await orderRes.json();
      setOrders(orderData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= PDF GENERATION =================
  const generatePDF = (order) => {
    try {
      const items = order?.items || [];

      if (items.length === 0) {
        alert("No items found in this order ");
        return;
      }

      const doc = new jsPDF();
      const date = new Date().toLocaleString();

      // ================= HEADER =================
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // blue-600
      doc.text("StarPhone", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Premium Smartphones & Accessories", 14, 28);

      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("INVOICE", 160, 20);

      // ================= USER INFO =================
      doc.setFontSize(10);
      doc.setTextColor(50);
      doc.text("BILLED TO:", 14, 45);
      doc.setTextColor(0);
      doc.text(`${order.username}`, 14, 52);
      doc.text(`${order.email}`, 14, 58);
      doc.text(`${order.phonenumber}`, 14, 64);
      
      const splitAddress = doc.splitTextToSize(order.address, 80);
      doc.text(splitAddress, 14, 70);

      doc.setTextColor(50);
      doc.text("ORDER DETAILS:", 120, 45);
      doc.setTextColor(0);
      doc.text(`Order ID: ${order._id || "N/A"}`, 120, 52);
      doc.text(`Date: ${date}`, 120, 58);

      // ================= TABLE =================
      autoTable(doc, {
        startY: 90,
        head: [["Product Description", "Quantity", "Unit Price", "Amount"]],
        body: items.map((item) => [
          item.phonename,
          item.quantity,
          `Rs. ${item.price}`,
          `Rs. ${Number(item.price) * item.quantity}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      // ================= TOTAL =================
      const finalY = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: Rs. ${order.total.toLocaleString("en-IN")}`, 130, finalY);

      // ================= FOOTER =================
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150);
      doc.text(
        "Thank you for shopping with StarPhone! For any queries, contact support@starphone.com",
        105,
        280,
        null,
        null,
        "center"
      );

      doc.save(`Invoice_${order._id || "order"}.pdf`);

    } catch (error) {
      console.error("PDF ERROR:", error);
      alert("PDF generation failed ");
    }
  };

  // ================= PAYMENT =================
  const placeOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (!formData.address.trim()) {
      alert("Address required!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_SSgktsfWdE04E2",
        amount: order.amount,
        currency: "INR",
        name: "StarPhone",
        description: "Premium Smartphone Purchase",
        order_id: order.id,
        theme: {
          color: "#2563eb",
        },
        handler: async function (response) {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                userData: {
                  username: formData.name,
                  email: formData.email,
                  phonenumber: formData.phonenumber,
                  address: formData.address,
                  total,
                  items: cartItems,
                },
              }),
            }
          );

          const data = await verifyRes.json();

          if (data.success) {
            alert("Payment Successful 🎉");

            const orderDetails = {
              username: formData.name,
              email: formData.email,
              phonenumber: formData.phonenumber,
              address: formData.address,
              total,
              items: cartItems,
            };

            //  Download PDF
            generatePDF(orderDetails);

            //  Clear cart
            setCartItems([]);

            //  Refresh order list
            fetchData();
          } else {
            alert("Payment Failed ");
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phonenumber,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Error in payment");
    }
  };

  // ================= ANIMATION VARIANTS =================
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50/50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen bg-gray-50/50 py-12 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-500 font-medium hover:text-blue-600 transition-colors text-lg flex items-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="text-blue-600" /> Orders
          </h1>
        </div>

        {/* CHECKOUT SECTION */}
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 mb-12 overflow-hidden"
            >
              <h2 className="text-2xl font-black mb-8 flex items-center gap-2 text-gray-900">
                <CreditCard className="text-blue-600" /> Secure Checkout
              </h2>

              <div className="grid lg:grid-cols-3 gap-10">
                {/* LEFT - FORM */}
                <div className="lg:col-span-2">
                  <form onSubmit={placeOrder} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input value={formData.name} readOnly className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed focus:outline-none" />
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input value={formData.email} readOnly className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed focus:outline-none" />
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input value={formData.phonenumber} readOnly className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed focus:outline-none" />
                    </div>

                    <div className="relative group">
                      <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                        <MapPin size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete delivery address"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-h-[120px] resize-none"
                        required
                      />
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-blue-600 text-white py-4.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      Pay ₹{total.toLocaleString("en-IN")} Securely
                    </motion.button>
                  </form>
                </div>

                {/* RIGHT - SUMMARY */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    {cartItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600 line-clamp-1 max-w-[150px]">{item.phonename} <span className="text-gray-400">x{item.quantity}</span></span>
                        <span className="text-gray-900">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                    <span className="text-gray-500 font-medium">Total</span>
                    <span className="text-2xl font-black text-blue-600">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ORDER HISTORY */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Clock className="text-gray-400" /> Order History
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-300" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No orders yet</p>
            <p className="text-gray-500">When you place an order, it will appear here.</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {orders.map((order) => (
              <motion.div 
                variants={itemVariant}
                key={order._id} 
                className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-10 hover:border-blue-100 hover:shadow-[0_20px_60px_rgba(37,99,235,0.05)] transition-all duration-300 group"
              >
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-200/50 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Paid
                    </span>
                    <p className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">ID: {order._id}</p>
                  </div>

                  <p className="font-black text-2xl text-gray-900 mb-6">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>

                  <div className="space-y-4">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm">
                          <img src={item.image} className="max-h-full object-contain" alt={item.phonename} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{item.phonename}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-10 min-w-[200px]">
                  <p className="text-sm text-gray-500 mb-4 text-left md:text-right w-full">
                    Invoice available for download
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generatePDF(order)}
                    className="w-full md:w-auto bg-white border-2 border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download size={18} /> Invoice
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Orders;
