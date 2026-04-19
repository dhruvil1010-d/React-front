import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    doc.setFontSize(18);
    doc.text("Star Phone", 14, 15);

    doc.setFontSize(12);
    doc.text("INVOICE", 150, 15);

    // ================= USER INFO =================
    doc.setFontSize(10);
    doc.text(`Name: ${order.username}`, 14, 30);
    doc.text(`Email: ${order.email}`, 14, 36);
    doc.text(`Phone: ${order.phonenumber}`, 14, 42);
    doc.text(`Address: ${order.address}`, 14, 48);

    doc.text(`Order ID: ${order._id || "N/A"}`, 140, 30);
    doc.text(`Date: ${date}`, 140, 36);

    // ================= TABLE =================
    autoTable(doc, {
      startY: 60,
      head: [["Product", "Quantity", "Price"]],
      body: items.map((item) => [
        item.phonename,
        item.quantity,
        `Rs. ${item.price}`,
      ]),
    });

    // ================= TOTAL =================
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total Amount: Rs. ${order.total}`, 14, finalY);

    // ================= FOOTER =================
    doc.setFontSize(10);
    doc.text(
      "Thank you for shopping with Star Phone!",
      14,
      finalY + 15
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
        name: "Star Phone",
        description: "Phone Purchase",
        order_id: order.id,

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
            alert("Payment Successful ");

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

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Error in payment");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🛒 Orders</h1>
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* CHECKOUT */}
        {cartItems.length > 0 && (
          <div className="bg-white border-2 border-green-400 rounded-2xl p-6 shadow-lg mb-8">

            <h2 className="text-2xl font-bold mb-6">
              🛒 Current Checkout
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="md:col-span-2">
                <form onSubmit={placeOrder} className="space-y-4">

                  <input value={formData.name} readOnly className="w-full border p-3 rounded bg-gray-100" />
                  <input value={formData.email} readOnly className="w-full border p-3 rounded bg-gray-100" />
                  <input value={formData.phonenumber} readOnly className="w-full border p-3 rounded bg-gray-100" />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Address"
                    className="w-full border p-3 rounded"
                    required
                  />

                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                    Pay ₹{total.toLocaleString("en-IN")}
                  </button>
                </form>
              </div>

              {/* RIGHT */}
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="font-bold mb-3">Cart</h3>

                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm mb-2">
                    <span>{item.phonename}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}

                <div className="border-t pt-2 font-bold">
                  ₹{total.toLocaleString("en-IN")}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ORDER HISTORY */}
        <h2 className="text-2xl font-bold mb-6">📦 Order History</h2>

      {orders.length === 0 ? (
  <div className="bg-white p-6 rounded-xl text-center">
    No orders yet
  </div>
) : (
  <div className="space-y-6">
    {orders.map((order) => (
      <div key={order._id} className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-3">
          <p>{order._id}</p>
          <span className="text-green-600">Paid</span>
        </div>

        <p className="font-bold text-blue-600 mb-2">
          ₹{order.total}
        </p>

        {/*  SAFE ITEMS MAP */}
        {(order.items || []).map((item, i) => (
          <div key={i} className="flex gap-3 mb-2">
            <img src={item.image} className="w-12 h-12" />
            <div>
              <p>{item.phonename}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        ))}

        {/*  BUTTON INSIDE SAME CARD */}
        <button
          onClick={() => generatePDF(order)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📄 Download Invoice
        </button>

      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}

export default Orders;
