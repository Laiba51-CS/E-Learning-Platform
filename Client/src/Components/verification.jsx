import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import axios from "axios";
import Footer from "./fotter";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

export default function Verification() {
  const [submit, setSubmit] = useState(false);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const email = urlParams.get("email");
  const code = urlParams.get("auth");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post(
        `http://localhost:5000/verify?email=${email}&auth=${code}`,
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
      if (responseData.message == "invalid") {
        setSubmit(false);
        document.getElementById("error").innerHTML =
          "INVALID VERIFICATION CODE";
        document.getElementById("error").style.color = "red";
        document.getElementById("error").style.display = "block";
      } else if (responseData.message == "verified") {
        setSubmit(false);
        document.getElementById("error").innerHTML = "EMAIL VERIFIED";
        document.getElementById("error").style.color = "green";
        document.getElementById("error").style.display = "block";
        setTimeout(() => {
          window.location.href = `/login`;
        }, 2000);
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
                  <p style={{ textAlign: "left" }}>
                    Verification Code sent on your email
                  </p>
                  <MDBInput
                    type="password"
                    label="Verification Code"
                    v-model="password"
                    wrapperClass="mb-4"
                    id="code"
                    name="code"
                    required
                  />
                  <span id="error"></span>
                  <MDBBtn
                    style={{ backgroundColor: "#786141" }}
                    block
                    className="my-4"
                  >
                    {submit ? (
                      <MDBSpinner style={{ color: "white" }}></MDBSpinner>
                    ) : (
                      <span>Verify</span>
                    )}
                  </MDBBtn>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
