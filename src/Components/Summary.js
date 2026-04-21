import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [userBalance, setUserBalance] = useState(0); // This is your virtualBalance
  const { liveWatchlist } = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 1. Fetch Holdings
    axios
      .get("http://localhost:3002/allHoldings", {
        headers: { Authorization: token },
      })
      .then((res) => setAllHoldings(res.data));

    // 2. Fetch User Profile for Balance
    axios
      .get("http://localhost:3002/me", {
        headers: { Authorization: token },
      })
      .then((res) => {
        // We use virtualBalance here to match your backend
        setUserBalance(res.data.virtualBalance || 0);
      });
  }, []);

  // --- Logic to calculate the "Missing" variables ---

  // 1. Calculate Total Investment (What you paid)
  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0,
  );

  // 2. Calculate Total Current Value (What it's worth now)
  const totalCurrentValue = allHoldings.reduce((sum, stock) => {
    const livePrice =
      liveWatchlist?.find(
        (s) => s.name.trim().toUpperCase() === stock.name.trim().toUpperCase(),
      )?.price || stock.avg;
    return sum + livePrice * stock.qty;
  }, 0);

  // 3. Calculate P&L
  const totalPnL = totalCurrentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  // Helper to format large numbers to "k" format
  const formatK = (num) =>
    Math.abs(num) >= 1000 ? (num / 1000).toFixed(2) + "k" : num.toFixed(2);

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            {/* Displaying your actual trading balance */}
            <h3>{formatK(userBalance)}</h3>
            <p>Margin available</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Margins used <span>0</span>
            </p>
            <p>
              Opening balance <span>{formatK(userBalance)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>
        <div className="data">
          <div className="first">
            <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
              {formatK(totalPnL)} <small>{pnlPercent.toFixed(2)}%</small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Current Value <span>{formatK(totalCurrentValue)}</span>
            </p>
            <p>
              Investment <span>{formatK(totalInvestment)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
