import React, { useState, useEffect } from "react";
import axios from "axios";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, mode) => {},
  closeBuyWindow: () => {},
  isBuyMode: true,
  liveWatchlist: [], // Initialize as an empty array
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [isBuyMode, setIsBuyMode] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(0.0);

  // ✅ 1. Move the Live Data state here
  const [liveWatchlist, setLiveWatchlist] = useState([]);

  // ✅ 2. The "Market Heartbeat" - runs every 2 seconds globally
  useEffect(() => {
    const fetchMarketPrices = () => {
      axios
        .get("https://sangini-e893.onrender.com/allMarketPrices")
        .then((res) => {
          setLiveWatchlist(res.data);
        })
        .catch((err) => console.error("Global Market Fetch Error:", err));
    };

    fetchMarketPrices();
    const interval = setInterval(fetchMarketPrices, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBuyWindow = (uid, mode = "BUY", price = 0.0) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setIsBuyMode(mode === "BUY");
    setSelectedPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        isBuyMode: isBuyMode,
        setIsBuyMode: setIsBuyMode,
        selectedPrice: selectedPrice,
        liveWatchlist: liveWatchlist, // ✅ 3. Share this with the whole app
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
