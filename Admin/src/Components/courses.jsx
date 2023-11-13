import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBCardTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
  MDBCardFooter,
  MDBCol,
  MDBRow,
  MDBCardText,
  MDBCardBody,
  MDBRipple,
  MDBCardImage,
  MDBCard,
  MDBSwitch,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import axios from "axios";

export default function Courses() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [Courses, setCourses] = useState([]);

  // update Course
  const [id, setId] = useState("");
  const [showUpdate, setshowUpdate] = useState("");
  const [Uname, setUName] = useState("");
  const [Ubrand, setUbrand] = useState("");
  const [Uprice, setUprice] = useState("");
  const [Ustock, setUstock] = useState("");
  const [Udescription, setUdescription] = useState("");

  const toggleShow = () => setBasicModal(!basicModal);
  const toogleUpdate = () => setshowUpdate(!showUpdate);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getCourses();
    getBrands();
  }, []);

  async function getBrands() {
    await fetch(`http://localhost:5000/getInstructor`, {
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
        setData(data.data.filter((item) => item.active == 1));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function getCourses() {
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
        console.log(data.data);
        setCourses(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await fetch(`http://localhost:5000/deleteCourse?id=${id}`, {
        method: "DELETE",
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
          if (data.message == "deleted") {
            getCourses();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/addCourse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      form.reset();
      getCourses();
      setSubmit(false);
      setBasicModal(false);
    } catch (error) {
      console.error("Error:", error.message);
      setSubmit(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    const data = {
      name: Uname,
      image: formData.get("image"),
      brand: Ubrand,
      price: Uprice,
      stock: Ustock,
      description: Udescription,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/updateCourse?id=${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      console.log("Response:", response.data);
      form.reset();
      getCourses();
      setSubmit(false);
      setshowUpdate(false);
    } catch (error) {
      console.error("Error:", error.message);
      setSubmit(false);
    }
  };

  async function handleSwitchChange(active, Id) {
    let Data = {};
    if (active == 1) {
      Data = {
        status: false,
        id: Id,
      };
    } else {
      Data = {
        status: true,
        id: Id,
      };
    }
    try {
      const response = await fetch(
        `http://localhost:5000/changeStatusCourses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(Data),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed.");
      }

      const data = await response.json();

      if (data.message === "updated") {
        getCourses();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>

      <div className="sidecol2">
        {/* <div className={`welcome-animation ${show ? "show" : ""}`}> */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Courses
            </h1>
            {/* <MDBBtn
              style={{
                height: "50px",
                marginTop: "3%",
                backgroundColor: "#e8eaf1",
                color: "#313a50",
                borderRadius: "0",
              }}
              onClick={() => {
                setBasicModal(true);
              }}
            >
              Add Course
            </MDBBtn> */}
          </div>

          <MDBRow>
            {Courses.map((item, index) => (
              <MDBCol md="6" lg="4" className="mb-4">
                <MDBCard>
                  <MDBRipple
                    rippleColor="dark"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom"
                  >
                    {/* <a href={`/courses`}> */}
                    <MDBCardImage
                      src={`http://localhost:5000/images/${item.image}`}
                      fluid
                      style={{ height: "250px" }}
                      className="w-100"
                    />
                    {/* </a> */}
                    <div className="mask">
                      <div className="d-flex justify-content-start align-items-end h-100">
                        <h5>
                          <span className="badge bg-success ms-2">
                            {item.instructorName}
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
                  <MDBCardBody>
                    <MDBCardTitle>{item.name}</MDBCardTitle>
                    {item.description.length < 100 ? (
                      <MDBCardText>
                        {item.description.substring(0, 100)}
                      </MDBCardText>
                    ) : (
                      <MDBCardText>
                        {item.description.substring(0, 100)}...
                      </MDBCardText>
                    )}

                    <div className="text-reset">
                      <h2 className="card-title mb-3 h4">
                        Price: {item.price}
                      </h2>
                    </div>

                    <div>
                      <span style={{ fontWeight: "bold" }}>Created At: </span>
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>Updated At: </span>
                      {new Date(item.updatedAt).toLocaleString()}
                    </div>

                    <MDBRow style={{ marginBottom: "-30px" }}>
                      <MDBCol
                        md="6"
                        lg="6"
                        className="mb-4 d-flex align-items-center justify-content-center"
                      >
                        <MDBSwitch
                          checked={item.active === 1}
                          onChange={() =>
                            handleSwitchChange(item.active, item.id)
                          }
                          style={{
                            backgroundColor:
                              item.status === 1 ? "white" : "lightgrey",
                            borderColor:
                              item.status === 1 ? "white" : "lightgrey",
                            color: item.status === 1 ? "black" : "white",
                          }}
                        />
                      </MDBCol>
                      <MDBCol
                        md="6"
                        lg="6"
                        className="mb-4 d-flex align-items-center justify-content-center"
                      >
                        <h5>
                          {item.active ? (
                            <span className="badge bg-success ms-2">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-danger ms-2">
                              InActive
                            </span>
                          )}
                        </h5>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                  <MDBCardFooter>
                    <MDBRow style={{ marginBottom: "-30px" }}>
                      <MDBCol
                        md="6"
                        lg="6"
                        className="mb-4 d-flex align-items-center justify-content-center"
                      >
                        <MDBBtn
                          style={{ marginLeft: "5px" }}
                          className="btn btn-success btn-block mb-4"
                          onClick={() => {
                            setshowUpdate(true);
                            setUName(item.name);
                            setUbrand(item.instructorName);
                            setUprice(item.price);
                            setUstock(item.stock);
                            setUdescription(item.description);
                            setId(item.id);
                            console.log("done");
                          }}
                        >
                          Update{" "}
                        </MDBBtn>
                      </MDBCol>
                      <MDBCol
                        md="6"
                        lg="6"
                        className="mb-4 d-flex align-items-center justify-content-center"
                      >
                        <MDBBtn
                          style={{ marginLeft: "5px" }}
                          className="btn btn-danger btn-block mb-4"
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                        >
                          Delete{" "}
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardFooter>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        {/* </div> */}
        {/* </div> */}
      </div>

     
    </div>
  );
}
