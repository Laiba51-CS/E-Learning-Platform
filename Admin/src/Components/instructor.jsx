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
  MDBSwitch,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";

export default function Instructor() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [id, setId] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [switchState, setSwitchState] = useState(false);

  const [name, setName] = useState("");
  const toggleShow = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getData();
  }, []);

  async function getData() {
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
        setData(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await fetch(`http://localhost:5000/deleteInstructor?id=${id}`, {
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
            getData();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  async function handleSubmit(event) {
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
        setBasicModal(false);
        getData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setSubmit(true);
    const Data = {
      name: updatename,
      id: id,
    };

    try {
      const response = await fetch(`http://localhost:5000/updateInstructor`, {
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

      if (data.message === "updated") {
        setSubmit(false);
        setUpdateModal(false);
        getData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
      const response = await fetch(`http://localhost:5000/changeStatus`, {
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

      if (data.message === "updated") {
        getData();
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
              Instructor
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
              Add Instructor
            </MDBBtn> */}
          </div>

          <div
            class="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{ borderRadius: 0, marginTop: "30px" }}
          >
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                class="uppercase"
                id="tablehead"
                style={{ padding: "10px", color: "#313a50" }}
              >
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Sr
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Instructor Name
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Action
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Edit
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((brand, index) => (
                  <tr class="border-b">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium whitespace-nowrap "
                    >
                      {index + 1}
                    </th>
                    <td class="px-6 py-4">{brand.instructorName}</td>
                    <td class="px-6 py-4">
                      {brand.active == 1 ? "Active" : "InActive"}
                    </td>
                    <td class="px-6 py-4">
                      <MDBSwitch
                        checked={brand.active === 1}
                        onChange={() =>
                          handleSwitchChange(brand.active, brand.id)
                        }
                        style={{
                          backgroundColor:
                            brand.status === 1 ? "white" : "lightgrey",
                          borderColor:
                            brand.status === 1 ? "white" : "lightgrey",
                          color: brand.status === 1 ? "black" : "white",
                        }}
                      />
                    </td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          setId(brand.id);
                          setUpdatename(brand.instructorName);
                          setUpdateModal(true);
                        }}
                      >
                        <i
                          className="fa fa-edit"
                          style={{ color: "green" }}
                        ></i>
                      </a>
                    </td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          handleDelete(brand.id);
                        }}
                      >
                        <i className="fa fa-trash" style={{ color: "red" }}></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        {/* </div> */}
      </div>

     
    </div>
  );
}
