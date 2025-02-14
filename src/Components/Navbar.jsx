import React from "react";
import { useNavigate } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const onClickLogout = async () => {
    const logoutRequest = new Request(
      "https://frontend-take-home-service.fetch.com/auth/logout",
      {
        method: "POST",
        credentials: "include",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }
    );
    try {
      const response = await fetch(logoutRequest);
      if (response.status !== 200) {
        console.error("Error");
        navigate("/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand text-white">Doggy Match Maker</a>
          <button className="logout-button" onClick={() => onClickLogout()}>
            Logout
          </button>
        </div>
      </nav>
      <div className="test"></div>
    </>
  );
}

export default Navbar;
