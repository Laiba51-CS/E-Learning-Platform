import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";

function Login() {
  const [submit, setSubmit] = useState(false);
  const [valid, setValid] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
  }, []);

  const handleEmail = (event) => {
    setEmail(event.target.value);
    if (event.target.value.length == 0) {
      event.target.style.backgroundColor = "#f6eacf";
      event.target.style.border = "1px solid #daa93e";
    } else {
      event.target.style.backgroundColor = "#d1e4df";
      event.target.style.border = "1px solid #579c89";
    }
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length == 0) {
      event.target.style.backgroundColor = "#f6eacf";
      event.target.style.border = "1px solid #daa93e";
    } else {
      event.target.style.backgroundColor = "#d1e4df";
      event.target.style.border = "1px solid #579c89";
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmit(true);
    const data = {
      email: email,
      password: password,
    };

    await fetch(`http://localhost:5000/adminlogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          Cookies.set("email", data.email, { expires: 2 });
          Cookies.set("username", data.username, { expires: 2 });
          Cookies.set("token", data.token, { expires: 2 });
          window.location.href = process.env.REACT_APP_URL;
        } else {
          setSubmit(false);
          setValid(true);
          setTimeout(() => {
            setValid(false);
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="backlogin">
      <MDBContainer
        fluid
        className="login p-4 background-radial-gradient overflow-hidden"
      >
        <MDBRow className="vh-100 align-items-center">
          <MDBCol
            md="6"
            className="text-center text-md-start d-flex flex-column justify-content-center"
          >
            <h1
              className="my-5 display-3 fw-bold ls-tight px-3"
              style={{ color: "hsl(218, 81%, 95%)" }}
            >
              The best offer <br />
              <span style={{ color: "#673f22" }}>for your business</span>
            </h1>
            <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
              Unlock endless possibilities with our innovative learning
              platform. Elevate your knowledge, gain new skills, and embark on a
              journey of continuous growth. Join us in shaping a brighter, more
              informed future today!
            </p>
          </MDBCol>
          <MDBCol md="6" className="position-relative">
            <form onSubmit={handleLogin}>
              <div
                id="radius-shape-1"
                className="position-absolute rounded-circle shadow-5-strong"
              ></div>
              <div
                id="radius-shape-2"
                className="position-absolute shadow-5-strong"
              ></div>
              <MDBCard
                className="my-5 bg-glass"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
              >
                <MDBCardBody className="p-5">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email"
                    id="form3"
                    type="email"
                    placeholder="Email"
                    onChange={handleEmail}
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="form4"
                    type="password"
                    placeholder="Password"
                    onChange={handlePassword}
                  />
                  <MDBBtn
                    style={{ backgroundColor: "#673f22" }}
                    className="w-100 mb-4"
                    size="md"
                  >
                    {submit ? (
                      <MDBSpinner color="info" />
                    ) : valid ? (
                      <span>Incorrect Login</span>
                    ) : (
                      <span>Login</span>
                    )}
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Login;
