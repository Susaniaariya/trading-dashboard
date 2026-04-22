import React from "react";

const Apps = () => {
  const apps = [
    {
      name: "Market Pulse",
      description:
        "Real-time global market news and sentiment analysis using NLP.",
      status: "Coming Soon",
      icon: "📰",
    },
    {
      name: "Tax Planner",
      description:
        "Automatically calculate capital gains and P&L for tax filing.",
      status: "In Development",
      icon: "💰",
    },
    {
      name: "Sangini Academy",
      description:
        "Interactive lessons to improve your financial literacy score.",
      status: "Beta Live",
      icon: "🎓",
    },
    {
      name: "Risk Guard",
      description:
        "Analyze your portfolio's volatility and risk-to-reward ratio.",
      status: "Planned",
      icon: "🛡️",
    },
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#444", marginBottom: "10px" }}>
        Ecosystem Partners
      </h2>
      <p style={{ color: "#888", marginBottom: "30px" }}>
        Expand your trading experience with our integrated micro-services.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {apps.map((app, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ fontSize: "30px", marginBottom: "15px" }}>
              {app.icon}
            </div>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{app.name}</h4>
            <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
              {app.description}
            </p>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: app.status === "Beta Live" ? "#4caf50" : "#ff9800",
                textTransform: "uppercase",
              }}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  transition: "transform 0.2s",
  cursor: "default",
};

export default Apps;
