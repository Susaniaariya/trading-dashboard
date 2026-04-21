import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext"; // ✅ Import your context
import "./Positions.css";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const { liveWatchlist } = useContext(GeneralContext); // ✅ Get live prices

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3002/allPositions", {
        headers: { Authorization: token },
      })
      .then((res) => setAllPositions(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="positions-container">
      <h3 className="title">Positions ({allPositions.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              // ✅ FIND THE LIVE PRICE
              const liveData = liveWatchlist?.find(
                (s) =>
                  s.name.trim().toUpperCase() ===
                  stock.name.trim().toUpperCase(),
              );

              // Use live price if available, otherwise fallback to database price
              const currentPrice = liveData ? liveData.price : stock.price;

              const qty = Number(stock.qty);
              const avg = Number(stock.avg);

              // ✅ LIVE CALCULATION
              const pnl = (currentPrice - avg) * qty;
              const isProfit = pnl >= 0;

              return (
                <tr key={index} className="table-row">
                  <td>
                    <span className="product-badge">{stock.product}</span>
                  </td>
                  <td className="instrument-name">{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td className={liveData ? "price-flash" : ""}>
                    {currentPrice.toFixed(2)}
                  </td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {isProfit ? "+" : ""}
                    {pnl.toFixed(2)}
                  </td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {liveData ? liveData.day : stock.day}
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

export default Positions;
