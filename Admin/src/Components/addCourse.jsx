import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { MDBCardBody, MDBCardImage, MDBSpinner } from "mdb-react-ui-kit";
import { Col, Row, Form, Container, Button } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBBtn, MDBModalBody } from "mdb-react-ui-kit";
import axios from "axios";

const AddCredentials = () => {
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getBrands();
  }, []);

  async function handleSubmitInstructor(event) {
    event.preventDefault();
    setSubmit(true);
    const Data = {
      name: name,
    };
    console.log(Data);

    try {
      const response = await fetch(`http://localhost:5000/addInstructor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(Data),
      });

      if (!response.ok) {
        throw new Error("Request failed.");
      }

      const data = await response.json();

      if (data.message === "added") {
        setName("");
        setSubmit(false);
        // setBasicModal(false);
        // getData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
      //   getCourses();
      setSubmit(false);
      //   setBasicModal(false);
    } catch (error) {
      console.error("Error:", error.message);
      setSubmit(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post(
        "http://localhost:5000/addUser",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      form.reset();
      setSubmit(true);
      const responseData = response.data;
      if (responseData.message == "already") {
        document.getElementById("email-error").innerHTML =
          "EMAIL ALREADY EXIST";
        document.getElementById("email-error").style.color = "red";
        document.getElementById("email-error").style.display = "block";
      } else {
        // getData();
        // setBasicModal(false);
        setSubmit(false);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setSubmit(false);
    }
  };

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>

      <div className="sidecol2">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            Add Credentials
          </h1>
        </div>

        <section className="py-5">
          <div className="container">
            <div className="row gx-5">
              <div class="container">
                <div class="row gx-4">
                  <div class=" mb-4">
                    <div class="border rounded-2 px-3 py-2 bg-white">
                      <Tabs defaultActiveKey="ex1-pills-2" id="ex1-content">
                        <Tab eventKey="ex1-pills-2" title="Add Users">
                          <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                            Add Users
                          </p>
                          <div className="header">
                            <MDBCardBody>
                              <form onSubmit={handleAdd}>
                                <MDBModalBody>
                                  <Form.Group className="mb-3">
                                    <Form.Control
                                      type="text"
                                      placeholder="Username"
                                      size="lg"
                                      id="card"
                                      name="username"
                                      required
                                      style={{ borderRadius: 5 }}
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Form.Control
                                      type="email"
                                      placeholder="Email"
                                      name="email"
                                      size="lg"
                                      id="card"
                                      required
                                      style={{ borderRadius: 5 }}
                                    />
                                    <span id="email-error"></span>
                                  </Form.Group>
                                  <MDBBtn
                                    type="submit"
                                    style={{
                                      width: "100%",
                                      borderRadius: 5,
                                    }}
                                    className="btnsc"
                                  >
                                    {submit ? (
                                      <MDBSpinner color="info" />
                                    ) : (
                                      <span>Add User</span>
                                    )}
                                  </MDBBtn>
                                </MDBModalBody>
                              </form>
                            </MDBCardBody>
                          </div>
                        </Tab>
                        <Tab eventKey="ex1-pills-3" title="Add Courses">
                          <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                            Add Courses
                          </p>
                          <div className="header">
                            <MDBCardBody>
                              <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                                id="Coursesform"
                              >
                                <MDBModalBody>
                                  <Form.Group className="mb-3">
                                    <Form.Control
                                      type="text"
                                      placeholder="Course Name"
                                      size="lg"
                                      name="name"
                                      id="card"
                                      required
                                      style={{
                                        borderRadius: 0,
                                        color: "black",
                                        flex: 1,
                                      }}
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <p
                                      style={{
                                        marginBottom: "0px",
                                        textAlign: "left",
                                      }}
                                    >
                                      Image
                                    </p>
                                    <Form.Control
                                      type="file"
                                      size="lg"
                                      id="card"
                                      name="image"
                                      required
                                      style={{
                                        borderRadius: 0,
                                        color: "black",
                                        flex: 1,
                                      }}
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <select
                                      class="form-select"
                                      aria-label="Default select example"
                                      id="card"
                                      name="brand"
                                      style={{ color: "black" }}
                                    >
                                      <option selected>
                                        Choose Instructor
                                      </option>
                                      {data.map((item, index) => (
                                        <option
                                          value={item.instructorName}
                                          style={{ color: "white" }}
                                        >
                                          {item.instructorName}
                                        </option>
                                      ))}
                                    </select>
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Form.Control
                                      type="number"
                                      name="price"
                                      placeholder="Price (Rs)"
                                      size="lg"
                                      id="card"
                                      required
                                      style={{
                                        borderRadius: 0,
                                        color: "black",
                                        flex: 1,
                                      }}
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Form.Control
                                      as="textarea"
                                      placeholder="Description (Write something)"
                                      rows={3}
                                      size="lg"
                                      id="card"
                                      name="description"
                                      required
                                      style={{
                                        borderRadius: 0,
                                        color: "black",
                                        flex: 1,
                                      }}
                                    />
                                  </Form.Group>
                                </MDBModalBody>

                                <MDBBtn
                                  type="submit"
                                  style={{ width: "100%" }}
                                  className="btnsc"
                                >
                                  {submit ? (
                                    <MDBSpinner color="info" />
                                  ) : (
                                    <span>Add Course</span>
                                  )}
                                </MDBBtn>
                              </form>
                            </MDBCardBody>
                          </div>
                        </Tab>
                        <Tab eventKey="ex1-pills-4" title="Add Instructors">
                          <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                            Add Instructors
                          </p>
                          <div className="header">
                            <MDBCardBody>
                              <form onSubmit={handleSubmitInstructor}>
                                <MDBModalBody>
                                  <Form.Group className="mb-3">
                                    {/* <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Name
                  </p> */}
                                    <Form.Control
                                      type="text"
                                      placeholder="Instructor Name"
                                      size="lg"
                                      name="name"
                                      id="card"
                                      value={name}
                                      onChange={(event) => {
                                        setName(event.target.value);
                                      }}
                                      required
                                      style={{
                                        borderRadius: 0,
                                        color: "black",
                                        flex: 1,
                                      }}
                                    />
                                  </Form.Group>
                                </MDBModalBody>

                                <MDBBtn
                                  type="submit"
                                  className="btnsc"
                                  style={{width:'100%'}}
                                >
                                  {submit ? (
                                    <MDBSpinner color="info" />
                                  ) : (
                                    <span>Add Instructor</span>
                                  )}
                                </MDBBtn>
                              </form>
                            </MDBCardBody>
                          </div>
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddCredentials;
