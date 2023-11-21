import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBRipple,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import LoginHeader from "./header";
import React, { useEffect, useState } from "react";
import Footer from "./fotter";
import Header from "./header";
import Cookies from "js-cookie";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    try {
      const response = await fetch(
        `http://localhost:5000/getOrders?id=${Cookies.get("userId")}`,
        {
          method: "GET",
          headers: {
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Request failed.");
      }

      const data = await response.json();

      setOrders(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <>
      {Cookies.get("email") === null || Cookies.get("email") === "" ? (
        <Header />
      ) : (
        <LoginHeader />
      )}
      <section className="h-100 gradient-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="12" xl="12">
              {orders.length !== 0 ? (
                <>
                  <center>
                    <h1>Your Enrollment History</h1>
                  </center>
                  {orders.map((order, index) => (
                    
                    <MDBRow className="justify-content-center mb-0">
                      <MDBCol md="12" xl="10">
                      <Link to={`/productdetails?id=${order.course_id}`}>
                        <MDBCard className="shadow-0 border rounded-3 mt-5 mb-3">
                          <MDBCardBody>
                            <MDBRow>
                              <MDBCol md="12" lg="3" className="mb-4 mb-lg-0">
                                <MDBRipple
                                  rippleColor="light"
                                  rippleTag="div"
                                  className="bg-image rounded hover-zoom hover-overlay"
                                >
                                  <MDBCardImage
                                    src={`http://localhost:5000/images/${order.image}`}
                                    fluid
                                    className="w-100"
                                  />
                                  <a href={`/productdetails?id=${order.course_id}`}>
                                    <div
                                      className="mask"
                                      style={{
                                        backgroundColor:
                                          "rgba(251, 251, 251, 0.15)",
                                      }}
                                    ></div>
                                  </a>
                                </MDBRipple>
                              </MDBCol>
                              <MDBCol md="6">
                                <h5 style={{color:'black'}}>{order.name}</h5>
                                {order.description.length < 200 ? (
                                  <p style={{color:'black'}}>
                                    {order.description.substring(0, 200)}
                                  </p>
                                ) : (
                                  <p style={{color:'black'}}>
                                    {order.description.substring(0, 200)}...
                                  </p>
                                )}
                              </MDBCol>
                              <MDBCol
                                md="6"
                                lg="3"
                                className="border-sm-start-none border-start"
                              >
                                <div className="d-flex flex-row align-items-center mb-1">
                                  <h4 className="mb-1 me-1" style={{color:'black'}}>RS{order.price}.00</h4>
                                  <span className="text-danger">
                                    {/* <s>$20.99</s> */}
                                  </span>
                                </div>
                                <h6 className="text-success">{order.instructorName}</h6>
                                <div className="d-flex flex-column mt-4">
                                  <MDBBtn color="primary" size="sm">
                                    Enrolled
                                  </MDBBtn>
                                  {/* <MDBBtn
                                    outline
                                    color="primary"
                                    size="sm"
                                    className="mt-2"
                                  >
                                    Enrolled
                                  </MDBBtn> */}
                                </div>
                              </MDBCol>
                            </MDBRow>
                          </MDBCardBody>
                        </MDBCard>
                    </Link>
                      </MDBCol>
                    </MDBRow>
                  ))}
                </>
              ) : (
                <center>
                  <h1>No Enrollment Yet</h1>
                </center>
              )}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <Footer />
    </>
  );
}
