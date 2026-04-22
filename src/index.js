import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Dashboard from "./Components/Dashboard";
import { GeneralContextProvider } from "./Components/GeneralContext"; // ✅ import this

// ✅ 1. FIRST: grab token from URL and save it
const params = new URLSearchParams(window.location.search);
const urlToken = params.get("token");
if (urlToken) {
  localStorage.setItem("token", urlToken);
  window.history.replaceState({}, document.title, window.location.pathname);
}

// ✅ 2. THEN: check if token exists
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "https://sangini-frontend-tau.vercel.app/login";
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GeneralContextProvider>
        {" "}
        {/* ✅ wrap everything here */}
        <Routes>
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </GeneralContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
