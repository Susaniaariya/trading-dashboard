import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { useEffect } from "react";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  // 1. Add an error state
  const [errorMessage, setErrorMessage] = useState("");

  const { closeBuyWindow, isBuyMode, setIsBuyMode, selectedPrice } =
    useContext(GeneralContext);
  useEffect(() => {
    setStockPrice(selectedPrice);
  }, [selectedPrice]);
  const handleOrderClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "https://sangini-frontend-tau.vercel.app/login";
      return;
    }

    const endpoint = "https://sangini-e893.onrender.com/newOrder"; // ✅ always use this

    axios
      .post(
        endpoint,
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: isBuyMode ? "BUY" : "SELL",
        },
        { headers: { Authorization: token } },
      )
      .then((res) => {
        closeBuyWindow();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Order failed";
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(""), 4000);
      });
  };

  return (
    <div
      className={`container ${isBuyMode ? "buy-theme" : "sell-theme"}`}
      id="buy-window"
    >
      <div className="tab-header">
        <button
          className={isBuyMode ? "active-buy" : ""}
          onClick={() => {
            setIsBuyMode(true);
            setErrorMessage(""); // Clear errors when switching tabs
          }}
        >
          BUY {uid}
        </button>
        <button
          className={!isBuyMode ? "active-sell" : ""}
          onClick={() => {
            setIsBuyMode(false);
            setErrorMessage("");
          }}
        >
          SELL {uid}
        </button>
      </div>

      <div className="regular-order">
        {/* 3. The Error Message Display Area */}
        {errorMessage && (
          <div className="error-banner">
            <i className="fa-solid fa-triangle-exclamation"></i> {errorMessage}
          </div>
        )}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price (Live)</legend>
            <input
              type="number"
              step="0.05"
              value={stockPrice.toFixed(2)}
              disabled
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <button
            className={`btn ${isBuyMode ? "btn-blue" : "btn-red"}`}
            onClick={handleOrderClick}
          >
            {isBuyMode ? "Buy" : "Sell"}
          </button>
          <button className="btn btn-grey" onClick={closeBuyWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
