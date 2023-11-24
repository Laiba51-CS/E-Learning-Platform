import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import {
  MDBBtn,
} from "mdb-react-ui-kit";

export default function ManageOrders() {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getData();
  }, []);

  async function getData() {
    await fetch(`http://localhost:5000/getAllOrders`, {
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
              Manage Orders
            </h1>
            <MDBBtn
              style={{
                height: "50px",
                marginTop: "3%",
                backgroundColor: "#e8eaf1",
                color: "#313a50",
                borderRadius: "0",
              }}
            >
              Export PDF
            </MDBBtn>
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
                    Buyer
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Product
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Dated
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((item, index) => (
                  <tr class="border-b">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium whitespace-nowrap "
                    >
                      1
                    </th>
                    <td class="px-6 py-4">{item.username}</td>
                    <td class="px-6 py-4">{item.name}</td>
                    <td class="px-6 py-4">{item.quantity}</td>
                    <td class="px-6 py-4">
                      {new Date(item.dated).toLocaleString()}
                    </td>
                    <td class="px-6 py-4">{item.price} Rs</td>
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
