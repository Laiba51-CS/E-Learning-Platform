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
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
} from "mdb-react-ui-kit";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import axios from "axios";
import Form from "react-bootstrap/Form";

export default function Manageusers() {
  const [submit, setSubmit] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const toggleShow = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);

  useEffect(() => {
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getData();
  }, []);

  async function getData() {
    await fetch(`http://localhost:5000/getusers`, {
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
        setUsers(data.data.filter((item) => item.role === "User"));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete user?")) {
      await fetch(`http://localhost:5000/deleteuser?id=${id}`, {
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
          if (data.message === "deleted") {
            getData();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post(
        `http://localhost:5000/updateUser?id=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      form.reset();
      setSubmit(false);
      setUpdateModal(false);
      const responseData = response.data;
      if (responseData.message === "already") {
        document.getElementById("email-error").innerHTML =
          "EMAIL ALREADY EXIST";
        document.getElementById("email-error").style.color = "red";
        document.getElementById("email-error").style.display = "block";
      } else {
        getData();
        setUpdateModal(false);
      }
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
      if (responseData.message === "already") {
        document.getElementById("email-error").innerHTML =
          "EMAIL ALREADY EXIST";
        document.getElementById("email-error").style.color = "red";
        document.getElementById("email-error").style.display = "block";
      } else {
        getData();
        setBasicModal(false);
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
              Manage Users
            </h1>
            {/* <MDBBtn
              style={{
                height: "50px",
                marginTop: "3%",
                backgroundColor: "#e8eaf1",
                color: "#ABB2C5",
                borderRadius: "0",
              }}
              className="btn btn-primary mb-2"
              onClick={() => {
                setBasicModal(true);
              }}
            >
              Add User
            </MDBBtn> */}
          </div>
          <MDBRow
            className="row-cols-1 row-cols-md-4 g-4"
            style={{ margin: "20px" }}
          >
            {users.map((user, index) => (
              <MDBCol>
                <MDBCard className="h-100" id="card">
                  <center>
                    <MDBCardImage
                      src="../Assets/user.png"
                      position="top"
                      style={{
                        borderRadius: "0",
                        height: "200px",
                        width: "200px",
                        padding: "10px",
                      }}
                    />
                  </center>
                  <MDBCardBody className="p-3">
                    <MDBCardTitle style={{ fontSize: "18px", color: "white" }}>
                      {user.username}
                    </MDBCardTitle>
                    <MDBCardText style={{ color: "white" }}>
                      {user.email}
                    </MDBCardText>
                    <MDBRow>
                      <MDBCol lg="6" className="md-6">
                        <MDBBtn
                          style={{ backgroundColor: "green", color: "white" }}
                          onClick={() => {
                            setId(user.id);
                            setUsername(user.username);
                            setEmail(user.email);
                            setUpdateModal(true);
                          }}
                        >
                          Update
                        </MDBBtn>
                      </MDBCol>
                      <MDBCol lg="6" className="md-6">
                        <MDBBtn
                          style={{ marginLeft: "5px", backgroundColor: "red" }}
                          className="btn btn-danger btn-block mb-4"
                          onClick={() => {
                            handleDelete(user.id);
                          }}
                        >
                          Delete
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                  {/* <MDBCardFooter>
                        Created At: {new Date(user.createdAt).toLocaleString()}
                        <br />
                        Updated At: {new Date(user.createdAt).toLocaleString()}
                    </MDBCardFooter> */}
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        {/* </div> */}
      </div>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Add User</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
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
                  style={{ borderRadius: 5 }}
                  className="btn btn-primary btn-block mb-4"
                >
                  {submit ? <MDBSpinner color="info" /> : <span>Add User</span>}
                </MDBBtn>
              </MDBModalBody>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal show={updateModal} setShow={setUpdateModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Update User</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleUpdate}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdate}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    size="lg"
                    id="card"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                    style={{ borderRadius: 5 }}
                  />
                  <span id="email-error"></span>
                </Form.Group>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  style={{ borderRadius: 5 }}
                >
                  {submit ? (
                    <MDBSpinner color="info" />
                  ) : (
                    <span>Update User</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
