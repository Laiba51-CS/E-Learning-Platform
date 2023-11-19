import React, { useEffect, useState } from "react";
import Header from "./header";
import LoginHeader from "./header";
import { MDBCardImage, MDBRow, MDBCol, MDBCard, MDBRipple, MDBCardBody, MDBCardTitle } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import Footer from "./fotter";
import Cookies from "js-cookie";

export default function Search() {
  const [data, setData] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get("brand");

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    getProducts();
  });

  async function getProducts() {
    await fetch(`http://localhost:5000/getCourse`, {
      method: "GET",
      headers: {
        "api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed.");
        }
        return response.json();
      })
      .then((data) => {
        setData(
          data.data.filter(
            (item) =>
              item.active === 1 &&
              (item.instructorName.toLowerCase().includes(brand.toLowerCase()) || item.name.toLowerCase().includes(brand.toLowerCase()) || item.description.toLowerCase().includes(brand.toLowerCase()))
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      {Cookies.get("email") === null || Cookies.get("email") === "" ? (
        <Header />
      ) : (
        <LoginHeader />
      )}
      {/* Carousel */}
      {/* <MDBCarousel showControls>
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={1}
          src="./Assets/image2.png"
          alt="Collection"
        />
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={2}
          src="./Assets/image1.png"
          alt="Collection"
        />
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={3}
          src="./Assets/image3.png"
          alt="Collection"
        />
      </MDBCarousel> */}

      {/* Products */}
      <h1
        className="mainheadings"
        style={{ marginLeft: "4%", marginTop: "30px" }}
      >
        Courses
      </h1>

      <MDBRow
        className="row-cols-1 row-cols-md-4 g-4"
        style={{ margin: "30px", marginTop: "-10px" }}
      >
        {data.map((products, index) => (
          <>
            <MDBCol md="4" lg="3" className="mb-4">
              <MDBCard>
                <Link to={`/productdetails?id=${products.id}`}>
                  <MDBRipple
                    rippleColor="light"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom"
                  >
                    <MDBCardImage
                      src={`http://localhost:5000/images/${products.image}`}
                      fluid
                      style={{ height: "200px" }}
                      className="w-100"
                    />
                    {/* </a> */}
                    <div className="mask">
                      <div className="d-flex justify-content-start align-items-end h-100">
                        <h5>
                          <span className="badge bg-success ms-2">
                            {products.instructorName}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="hover-overlay">
                      <div
                        className="mask"
                        style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                      ></div>
                    </div>
                  </MDBRipple>
                </Link>

                <MDBCardBody>
                  <MDBCardTitle>{products.name}</MDBCardTitle>
                  <div className="text-reset">
                    <h2 className="card-title mb-3 h4">
                      Price: {products.price}
                    </h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </>
        ))}
      </MDBRow>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
