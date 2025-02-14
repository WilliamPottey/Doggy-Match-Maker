import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validLogin, setValidLogin] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
    inputRef.current.focus();
  }, [navigate]);

  const onClickLogin = async () => {
    const loginRequest = new Request(
      "https://frontend-take-home-service.fetch.com/auth/login",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name, email: email }),
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }
    );
    try {
      const response = await fetch(loginRequest);
      if (response.status !== 200) {
        setValidLogin(false);
        console.error("Error");
      } else {
        navigate("/dogs", { state: { name: name, email: email } });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="login-body">
        <span className="title-style">Doggy Match Maker</span>
        <br />
        <div className="login-box">
          <div className="login-box-items">
            <label>Name:</label>
            <br />
            <input
              type="text"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-style"
            ></input>{" "}
            <br />
            <label>Email:</label>
            <br />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-style"
            ></input>
            <br />
            {!validLogin ? (
              <span className="invalid-login-text">
                {" "}
                *Invalid Login! Please Try Again.
              </span>
            ) : (
              <span></span>
            )}
            <br />
            <button className="login-button" onClick={() => onClickLogin()}>
              Sign-In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
