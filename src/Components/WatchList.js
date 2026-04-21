import React, { useState, useContext, useEffect } from "react";
import { watchlist } from "../data/data";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@material-ui/core";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import BarChartOutlined from "@material-ui/icons/BarChartOutlined";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import { DoughnutChart } from "./DoughnutChart";

// ✅ 1. FIRST: WatchListActions
const WatchListActions = ({ uid, price }) => {
  const { openBuyWindow } = useContext(GeneralContext);

  return (
    <span className="actions">
      <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
        <button
          className="buy"
          onClick={() => openBuyWindow(uid, "BUY", price)}
        >
          Buy
        </button>
      </Tooltip>
      <Tooltip
        title="Sell (S)"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >
        <button
          className="sell"
          onClick={() => openBuyWindow(uid, "SELL", price)}
        >
          Sell
        </button>
      </Tooltip>
      <Tooltip
        title="Analytics (A)"
        placement="top"
        arrow
        TransitionComponent={Grow}
      >
        <button className="action">
          <BarChartOutlined className="icon" />
        </button>
      </Tooltip>
      <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
        <button className="action">
          <MoreHoriz className="icon" />
        </button>
      </Tooltip>
    </span>
  );
};

// ✅ 2. SECOND: WatchListItem
const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown style={{ color: "red" }} />
          ) : (
            <KeyboardArrowUp style={{ color: "green" }} />
          )}
          <span className="price">{stock.price.toFixed(2)}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <WatchListActions uid={stock.name} price={stock.price} />
      )}
    </li>
  );
};

// ✅ 3. THIRD: WatchList
const WatchList = () => {
  const { liveWatchlist } = useContext(GeneralContext);
  const [prevPrices, setPrevPrices] = useState({});

  useEffect(() => {
    if (liveWatchlist.length === 0) return;

    setPrevPrices((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const snap = {};
      liveWatchlist.forEach((s) => (snap[s.name] = s.price));
      return snap;
    });

    const timer = setTimeout(() => {
      setPrevPrices(() => {
        const snap = {};
        liveWatchlist.forEach((s) => (snap[s.name] = s.price));
        return snap;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [liveWatchlist]);

  const data = {
    labels: liveWatchlist.map((s) => s.name),
    datasets: [
      {
        label: "Price",
        data: liveWatchlist.map((s) => s.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>
      <ul className="list">
        {watchlist.map((staticStock, index) => {
          const liveStock = liveWatchlist.find(
            (s) =>
              s.name.trim().toUpperCase() ===
              staticStock.name.trim().toUpperCase(),
          );
          const currentPrice = liveStock?.price ?? staticStock.price;
          const previousPrice = prevPrices[staticStock.name] ?? currentPrice;

          const stockToRender = {
            ...staticStock,
            price: currentPrice,
            isDown: currentPrice < previousPrice,
            percent:
              previousPrice > 0
                ? `${(((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2)}%`
                : staticStock.percent,
          };

          return <WatchListItem key={index} stock={stockToRender} />;
        })}
      </ul>
      <DoughnutChart data={data} />
    </div>
  );
};

// ✅ 4. LAST: export
export default WatchList;
