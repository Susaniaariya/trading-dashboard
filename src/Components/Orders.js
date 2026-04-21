import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://sangini-e893.onrender.com/allOrders", {
        headers: { Authorization: token },
      })
      .then((res) => {
        // Ensure res.data is an array before reversing
        const orders = Array.isArray(res.data) ? res.data : [];
        setAllOrders(orders.reverse());
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, []);

  if (allOrders.length === 0) {
    return (
      <div
        className="orders"
        style={{ textAlign: "center", padding: "100px 20px" }}
      >
        <div className="no-orders">
          {/* ✅ Clean, modern empty state icon */}
          <div style={{ fontSize: "50px", marginBottom: "20px", opacity: 0.5 }}>
            📑
          </div>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            You haven't placed any orders today
          </p>
          <Link
            to={"/"}
            className="btn"
            style={{
              display: "inline-block",
              marginTop: "20px",
              background: "#ad1457",
              color: "#fff",
              padding: "10px 25px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3 className="title" style={{ marginBottom: "20px", color: "#333" }}>
        Orders ({allOrders.length})
      </h3>
      <div className="order-table">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "1px solid #eee",
                color: "#9b9b9b",
              }}
            >
              <th style={{ padding: "12px" }}>Time</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => {
              // ✅ FIX: Check multiple possible date fields or fallback to current time
              const rawDate = order.createdAt || order.date || new Date();
              const dateObj = new Date(rawDate);

              // Validate the date object
              const isValid = !isNaN(dateObj.getTime());

              const time = isValid
                ? dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--";

              return (
                <tr key={index} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td
                    style={{
                      color: "#9b9b9b",
                      fontSize: "0.85rem",
                      padding: "15px 12px",
                    }}
                  >
                    {time}
                  </td>
                  <td style={{ fontWeight: "600", color: "#444" }}>
                    {order.name}
                  </td>
                  <td>
                    <span
                      className={order.mode === "BUY" ? "buy-tag" : "sell-tag"}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background:
                          order.mode === "BUY" ? "#e3f2fd" : "#fbe9e7",
                        color: order.mode === "BUY" ? "#1e88e5" : "#d84315",
                      }}
                    >
                      {order.mode}
                    </span>
                  </td>
                  <td>{order.qty}</td>
                  <td style={{ fontWeight: "500" }}>
                    ₹
                    {Number(order.price).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <span
                      style={{
                        color: "#4caf50",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background: "#e8f5e9",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      COMPLETE
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
