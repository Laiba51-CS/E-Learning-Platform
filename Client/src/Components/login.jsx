import React, { useState } from "react";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

export default function Login() {
  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      setSubmit(false);
      const responseData = response.data;
      if (responseData.message === "success") {
        Cookies.set("email", responseData.email, { expires: 2 });
        Cookies.set("token", responseData.token, { expires: 2 });
        Cookies.set("userId", responseData.userid, { expires: 2 });
        window.location.href = "http://localhost:3000/Home";
      } else if (responseData.message === "invalid") {
        document.getElementById("message").innerHTML =
          "INVALID USERNAME OR PASSWORD";
        document.getElementById("message").style.color = "red";
        document.getElementById("message").style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error.message);
      setSubmit(false);
    }
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
            <MDBCard
              className="my-5 bg-glass"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            >
              <MDBCardBody className="p-5">
                <form onSubmit={handleSubmit}>
                  <MDBInput
                    type="email"
                    label="Email address"
                    v-model="email"
                    wrapperClass="mb-4"
                    id="email"
                    name="email"
                    required
                  />
                  <MDBInput
                    type="password"
                    label="Password"
                    v-model="password"
                    id="password"
                    name="password"
                    wrapperClass="mb-4"
                    required
                  />
                  <span id="message"></span>
                  <MDBBtn
                    style={{ backgroundColor: "#786141" }}
                    block
                    className="my-4"
                  >
                    {submit ? (
                      <MDBSpinner style={{ color: "white" }}></MDBSpinner>
                    ) : (
                      <span>Login</span>
                    )}
                  </MDBBtn>
                  Don't have an account? <Link to="/">Register</Link>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
