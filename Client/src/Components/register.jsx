import React, { useState } from "react";
import Header from "./header";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "./fotter";

export default function Register() {
  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const Cpassword = document.getElementById("cpassword").value;

    if (password !== Cpassword) {
      document.getElementById("error").innerHTML =
        "PASSWORD & CONFIRM PASSWORD MUST BE SAME";
      document.getElementById("error").style.color = "red";
      document.getElementById("error").style.display = "block";
    } else {
      setSubmit(true);
      const form = e.target;
      const formData = new FormData(form);

      try {
        const response = await axios.post(
          "http://localhost:5000/register",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );

        form.reset();
        const responseData = response.data;
        setSubmit(false);
        if (responseData.message == "already") {
          document.getElementById("error").innerHTML = "EMAIL ALREADY EXIST";
          document.getElementById("error").style.color = "red";
          document.getElementById("error").style.display = "block";
        } else {
          window.location.href = `/verification?email=${responseData.email}&auth=${responseData.code}`;
        }
      } catch (error) {
        console.error("Error:", error.message);
        setSubmit(false);
      }
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
                    label="Username"
                    v-model="Username"
                    id="username"
                    name="username"
                    wrapperClass="mb-4"
                    required
                  />
                  <MDBInput
                    type="email"
                    label="Email address"
                    v-model="email"
                    name="email"
                    id="email"
                    wrapperClass="mb-4"
                    required
                  />
                  <MDBInput
                    type="password"
                    label="Password"
                    id="password"
                    name="password"
                    v-model="password"
                    wrapperClass="mb-4"
                    required
                  />
                  <MDBInput
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    label="Confirm Password"
                    v-model="password"
                    wrapperClass="mb-4"
                    required
                  />
                  <span id="error"></span>
                  {submit ? (
                    <MDBBtn
                      style={{ backgroundColor: "#786141" }}
                      block
                      className="my-4"
                    >
                      <center>
                        <MDBSpinner style={{ color: "white" }}></MDBSpinner>
                      </center>
                    </MDBBtn>
                  ) : (
                    <MDBBtn
                      style={{ backgroundColor: "#786141" }}
                      block
                      className="my-4"
                    >
                      Register
                    </MDBBtn>
                  )}
                  Already have an account? <Link to="/login">Login</Link>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
