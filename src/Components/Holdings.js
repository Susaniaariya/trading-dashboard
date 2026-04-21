import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

// --- SUB-COMPONENT FOR THE "WIGGLE" ---
// Using useRef fixes the "missing dependency" ESLint warning
// and prevents infinite loops during live price updates.
const PriceCell = ({ price }) => {
  const [flashClass, setFlashClass] = useState("");
  const prevPriceRef = useRef(price);

  useEffect(() => {
    const prevPrice = prevPriceRef.current;

    if (price > prevPrice) {
      setFlashClass("price-up");
    } else if (price < prevPrice) {
      setFlashClass("price-down");
    }

    // Reset the flash after 800ms
    const timer = setTimeout(() => setFlashClass(""), 800);

    // Update the ref so the next render knows what the "old" price was
    prevPriceRef.current = price;

    return () => clearTimeout(timer);
  }, [price]);

  return <td className={flashClass}>{price.toFixed(2)}</td>;
};

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const { liveWatchlist } = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchHoldings = () => {
      axios
        .get("https://sangini-e893.onrender.com/allHoldings", {
          headers: { Authorization: token },
        })
        .then((res) => {
          setAllHoldings(res.data);
        })
        .catch((err) => console.error("Error fetching holdings:", err));
    };

    fetchHoldings();
    const intervalId = setInterval(fetchHoldings, 5000); // Polling every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // --- Calculations ---
  const totalInvestment = allHoldings.reduce(
    (sum, s) => sum + (Number(s.avg) || 0) * (Number(s.qty) || 0),
    0,
  );

  const totalCurrentValue = allHoldings.reduce((sum, s) => {
    const liveData = liveWatchlist?.find(
      (m) => m.name.trim().toUpperCase() === s.name.trim().toUpperCase(),
    );
    const livePrice = liveData ? liveData.price : s.avg;
    return sum + (Number(livePrice) || 0) * (Number(s.qty) || 0);
  }, 0);

  const totalPnL = totalCurrentValue - totalInvestment;
  const pnlPercentage =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  // --- Graph Data ---
  const graphData = {
    labels: allHoldings.map((s) => s.name),
    datasets: [
      {
        label: "Current Price",
        data: allHoldings.map((s) => {
          const liveData = liveWatchlist?.find(
            (m) => m.name.trim().toUpperCase() === s.name.trim().toUpperCase(),
          );
          return liveData ? liveData.price : s.avg;
        }),
        backgroundColor: "rgba(233, 30, 99, 0.5)", // Pink theme
      },
    ],
  };

  return (
    <div className="holdings-container">
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const liveData = liveWatchlist?.find(
                (s) =>
                  s.name.trim().toUpperCase() ===
                  stock.name.trim().toUpperCase(),
              );
              const currentLivePrice = liveData ? liveData.price : stock.avg;
              const curValue = currentLivePrice * stock.qty;
              const pnl = curValue - stock.avg * stock.qty;

              return (
                <tr key={stock._id || index}>
                  <td className="instrument-name">{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>

                  {/* ✅ THE WIGGLING CELL (Warning Fixed) */}
                  <PriceCell price={currentLivePrice} />

                  <td>{curValue.toFixed(2)}</td>
                  <td className={pnl >= 0 ? "profit" : "loss"}>
                    {pnl.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="row stats-row"
        style={{ marginTop: "30px", display: "flex", gap: "2rem" }}
      >
        <div className="col">
          <h5>
            ₹
            {totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </h5>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Total investment</p>
        </div>
        <div className="col">
          <h5>
            ₹
            {totalCurrentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </h5>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? "+" : ""}
            {totalPnL.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
          </h5>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Total P&L</p>
        </div>
      </div>

      <div style={{ marginTop: "40px", height: "300px" }}>
        <VerticalGraph data={graphData} />
      </div>
    </div>
  );
};

export default Holdings;
