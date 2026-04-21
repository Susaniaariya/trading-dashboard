import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      window.location.href = "http://localhost:3000/login";
    }
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(160deg, #fff0f3 0%, #fce4ec 100%)",
      }}
    />
  );
};

export default Home;
