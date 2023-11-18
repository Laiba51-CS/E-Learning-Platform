import { useEffect, useState } from "react";
import { Col, Row, Form, Container, Button } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import { Card, CardBody, CardTitle } from "reactstrap";
import {
  MDBCardBody,
  MDBCard,
  MDBRipple,
  MDBCardTitle,
  MDBCol,
  MDBCardImage,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import LoginHeader from "./header";
import Footer from "./fotter";
import Header from "./header";
import Cookies from "js-cookie";
import axios from "axios";

function ReviewData() {
  const [data, setData] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [buySubmit, setBuysubmit] = useState(false);
  const [reviews, setReviews] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const [id,setid] = useState(urlParams.get("id"));

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    window.scrollTo(0, 0);
    getProducts();
  }, [id]);

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
        console.log(id)
        setData(data.data.filter((item) => item.id == id && item.active == 1));
        const filterId = data.data.filter((item) => item.id == id);
        setSimilar(
          data.data.filter(
            (item) =>
              // item.instructorName == filterId[0].instructorName &&
              item.id != filterId[0].id &&
              item.active == 1
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleBuy = async (image, price) => {
    if (Cookies.get("userId") == null || Cookies.get("userId") == "") {
      alert("Login to buy product");
    } else {
      setBuysubmit(true);
      const Data = {
        userId: Cookies.get("userId"),
        productId: id,
        image: image,
        price: price,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/buyProduct",
          Data,
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );

        const responseData = response.data;
        setBuysubmit(false);
        if (responseData.message == "outofstock") {
          alert("Product is out of stock");
        } else {
          window.location.href = responseData.sessionUrl;
        }
      } catch (error) {
        console.error("Error:", error.message);
        setSubmit(false);
      }
    }
  };

  function generateGoldenStars(num) {
    const goldenStar = "\u2B50";
    let stars = "";
    for (let i = 1; i <= parseInt(num); i++) {
      stars = (goldenStar + " ").repeat(i);
    }
    return stars;
  }

  return (
    <div>
      {Cookies.get("email") == null || Cookies.get("email") == "" ? (
        <Header />
      ) : (
        <LoginHeader />
      )}
      <section className="py-5">
        <div className="container">
          <div className="row gx-5">
            <Col lg={5}>
              <div class="container">
                <div class="row gx-4">
                  <div class=" mb-4">
                    <div class="border rounded-2 px-3 py-2 bg-white">
                    <Tabs defaultActiveKey="ex1-pills-2" id="ex1-content">
                        <Tab eventKey="ex1-pills-2" title="Similar Courses"  style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                            Similar Courses
                          </p>
                          <div className="header">
                            <MDBCardBody>
                              {similar.map((products, index) => (
                                <>
                                  {/* <MDBCol md="12" lg="3" className="mb-4"> */}
                                    <MDBCard>
                                      <Link
                                        to={`/productdetails?id=${products.id}`}
                                        onClick={()=>{setid(products.id);getProducts()}}
                                      >
                                        {console.log(`/productdetails?id=${products.id}`)}
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
                                              style={{
                                                backgroundColor:
                                                  "rgba(251, 251, 251, 0.15)",
                                              }}
                                            ></div>
                                          </div>
                                        </MDBRipple>
                                      </Link>

                                      <MDBCardBody>
                                        <MDBCardTitle>
                                          {products.name}
                                        </MDBCardTitle>
                                        <div className="text-reset">
                                          <h2 className="card-title mb-3 h4">
                                            Price: {products.price}
                                          </h2>
                                        </div>
                                      </MDBCardBody>
                                    </MDBCard>
                                  {/* </MDBCol> */}
                                </>
                              ))}
                            </MDBCardBody>
                          </div>
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={7}>
              <div className="rounded-4 mb-3 d-flex justify-content-center">
                {data.map((item, index) => (
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "500px",
                      width: "auto",
                      height: "auto",
                    }}
                    src={`http://localhost:5000/images/${item.image}`}
                  />
                ))}
              </div>
              {data.map((item, index) => (
                <div>
                  <h4 className="title text-dark"></h4>
                  <p>{item.instructorName}</p>
                  <h4 style={{ fontFamily: "bahnschrift", marginTop: "-13px" }}>
                    {item.name}
                  </h4>

                  <div className="mb-3">
                    <span className="h5">Rs. {item.price}.00</span>
                    <p style={{ textAlign: "justify" }}>{item.description}</p>
                  </div>
                </div>
              ))}

              <p style={{ textAlign: "justify" }}></p>

              <hr />
              {data.map((item, index) => (
                <a>
                  <Button
                    variant="success"
                    className="shadow-0"
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      handleBuy(item.image, item.price);
                    }}
                  >
                    {buySubmit ? (
                      <center>
                        <MDBSpinner style={{ color: "white" }}></MDBSpinner>
                      </center>
                    ) : (
                      <span>EnRoll</span>
                    )}
                  </Button>
                </a>
              ))}
            </Col>
          </div>
        </div>
      </section>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
export default ReviewData;
