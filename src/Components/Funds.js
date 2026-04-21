import React, { useState, useEffect } from "react";
import axios from "axios";

const Funds = () => {
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [quizPoints, setQuizPoints] = useState(0);
  const [holdingsValue, setHoldingsValue] = useState(0);
  const [holdingsCount, setHoldingsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAll = () => {
      // Fetch wallet + quiz points
      axios
        .get("https://sangini-e893.onrender.com/me", {
          headers: { Authorization: token },
        })
        .then(({ data }) => {
          setVirtualBalance(data.virtualBalance ?? 0);
          setQuizPoints(data.points ?? 0);
        })
        .catch(console.error);

      // Fetch holdings for invested value
      axios
        .get("https://sangini-e893.onrender.com/allHoldings", {
          headers: { Authorization: token },
        })
        .then(({ data }) => {
          const total = data.reduce((sum, h) => sum + h.avg * h.qty, 0);
          setHoldingsValue(total);
          setHoldingsCount(data.length);
        })
        .catch(console.error);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPortfolio = virtualBalance + holdingsValue;
  const availablePct =
    totalPortfolio > 0
      ? Math.round((virtualBalance / totalPortfolio) * 100)
      : 0;
  const investedPct = 100 - availablePct;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "500", margin: 0 }}>
            कोष — Funds
          </h2>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
            Your virtual trading wallet • Earn more by learning
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/learn")
            }
            style={{
              background: "linear-gradient(135deg,#e91e63,#c2185b)",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            + Earn funds via Learn
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid #ddd",
              padding: "8px 20px",
              borderRadius: "50px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "10px",
          margin: "1.25rem 0",
        }}
      >
        {[
          {
            label: "Available cash",
            value: `₹${virtualBalance.toFixed(2)}`,
            sub: "Ready to invest",
            color: "#e91e63",
            valueColor: "#2e7d32",
          },
          {
            label: "Invested (used margin)",
            value: `₹${holdingsValue.toFixed(2)}`,
            sub: `Across ${holdingsCount} holdings`,
            color: "#f48fb1",
            valueColor: "#e91e63",
          },
          {
            label: "Total portfolio value",
            value: `₹${totalPortfolio.toFixed(2)}`,
            sub: "",
            color: "#ad1457",
            valueColor: "inherit",
          },
        ].map(({ label, value, sub, color, valueColor }) => (
          <div
            key={label}
            style={{
              background: "#fafafa",
              borderRadius: "8px",
              padding: "1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "3px",
                height: "100%",
                background: color,
                borderRadius: "3px 0 0 3px",
              }}
            />
            <p style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>
              {label}
            </p>
            <p
              style={{ fontSize: "20px", fontWeight: "500", color: valueColor }}
            >
              {value}
            </p>
            {sub && (
              <p style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                {sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "50px",
            height: "10px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg,#f48fb1,#e91e63)",
              borderRadius: "50px",
              height: "10px",
              width: `${availablePct}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#999" }}>
            Available — {availablePct}%
          </span>
          <span style={{ fontSize: "11px", color: "#999" }}>
            Invested — {investedPct}%
          </span>
        </div>
      </div>

      {/* Two Column */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "1rem",
        }}
      >
        {/* Left — Equity Breakdown */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #eee",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Equity breakdown
            </p>
            <span
              style={{
                background: "#fce4ec",
                color: "#c2185b",
                fontSize: "10px",
                padding: "2px 8px",
                borderRadius: "50px",
              }}
            >
              Live
            </span>
          </div>
          {[
            ["Available margin", `₹${virtualBalance.toFixed(2)}`, "#2e7d32"],
            ["Used margin", `₹${holdingsValue.toFixed(2)}`, "#e91e63"],
            ["Opening balance", `₹${totalPortfolio.toFixed(2)}`, "inherit"],
            ["Invested value", `₹${holdingsValue.toFixed(2)}`, "inherit"],
            ["Available cash", `₹${virtualBalance.toFixed(2)}`, "inherit"],
            ["SPAN margin", "₹0.00", "inherit"],
            ["Delivery margin", "₹0.00", "inherit"],
            ["Exposure", "₹0.00", "inherit"],
            ["Options premium", "₹0.00", "inherit"],
            ["Collateral (liquid)", "₹0.00", "inherit"],
            ["Collateral (equity)", "₹0.00", "inherit"],
            ["Total collateral", "₹0.00", "inherit"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
                borderBottom: "0.5px solid #f5f5f5",
              }}
            >
              <span style={{ fontSize: "12px", color: "#999" }}>{label}</span>
              <span style={{ fontSize: "12px", fontWeight: "500", color }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Learn Card */}
          <div
            style={{
              background: "linear-gradient(135deg,#fff0f3,#fce4ec)",
              border: "0.5px solid #f8bbd0",
              borderRadius: "12px",
              padding: "1.25rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "#c2185b",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            >
              सिक्नुहोस् र कमाउनुहोस्
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#ad1457",
                marginBottom: "12px",
                lineHeight: "1.5",
              }}
            >
              Low on funds? Complete lessons and quizzes to earn more virtual
              money to invest with.
            </p>
            <button
              onClick={() =>
                (window.location.href = "http://localhost:3000/learn")
              }
              style={{
                background: "#e91e63",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Go to Learn section
            </button>
          </div>

          {/* Quiz Points */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid #eee",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>
              Quiz points earned
            </p>
            <p
              style={{ fontSize: "24px", fontWeight: "500", color: "#e91e63" }}
            >
              {quizPoints} pts
            </p>
            <p style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
              Complete more lessons to earn ₹
            </p>
          </div>

          {/* Tips */}
          <div
            style={{
              background: "#fafafa",
              borderRadius: "12px",
              padding: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: "500",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px",
              }}
            >
              How to earn more
            </p>
            {[
              ["Easy quiz", "+₹50 per correct answer"],
              ["Medium quiz", "+₹150 per correct answer"],
              ["Hard quiz", "+₹300 per correct answer"],
              ["Finish a lesson", "+₹500 bonus"],
            ].map(([label, desc]) => (
              <div
                key={label}
                style={{
                  fontSize: "12px",
                  color: "#999",
                  padding: "6px 0",
                  borderBottom: "0.5px solid #eee",
                  lineHeight: "1.4",
                }}
              >
                <span style={{ color: "#e91e63", fontWeight: "500" }}>
                  {label}
                </span>{" "}
                — {desc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;
