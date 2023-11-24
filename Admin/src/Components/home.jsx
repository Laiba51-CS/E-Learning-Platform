import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import ChartsPage from "./DoughnutChart";
import Linechart from "./lineChart";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";


export default function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(0);
  const [Grapgdata, setGrapgdata] = useState(0);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }

    async function getAdminDashboard() {
      await fetch(`http://localhost:5000/getDashboard`, {
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
          console.log(data);
          setData(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    async function getgraphdata() {
      await fetch(`http://localhost:5000/daywiseEnrollmentReport`, {
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
          console.log(data);
          setGrapgdata(data);
          console.log(Grapgdata);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    getAdminDashboard();
    getgraphdata();
  }, []);


// Create an object to store counts for each course
const courseCounts = {};
if (Grapgdata.data && Grapgdata.data.length > 0) {
// Iterate over the input data and populate the counts
Grapgdata.data.forEach(entry => {
    const { Day, Course, Count } = entry;

    // Initialize course entry if not present
    if (!courseCounts[Course]) {
        courseCounts[Course] = { name: Course, data: [0, 0, 0, 0, 0, 0, 0] };
    }

    // Update count for the corresponding day
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(Day);
    courseCounts[Course].data[dayIndex] = Count;
});
}

// Convert the object into an array
const resultArray = Object.values(courseCounts);

console.log(resultArray);

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        {/* <div className={`welcome-animation ${show ? "show" : ""}`}> */}
          <MDBRow style={{ margin: "5px", marginTop: "30px" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Dashboard
            </h1>
            <MDBCol md="4">
              {data.instructor && <ChartsPage users={data.instructor} color={['#1d9cfb','#00e396']} />}
              <h4>Instructors </h4>
            </MDBCol>

            <MDBCol md="4">
              {data.course && <ChartsPage users={data.course} color={['#00FF00','#FFA500']} />}
              <h4>Courses </h4>

            </MDBCol>

            <MDBCol md="4">
              {data.users && <ChartsPage users={data.users} color={['#FF0000','#0000FF']}/>}
              <h4>Users </h4>

            </MDBCol>


          </MDBRow>
          <MDBRow>
          <Linechart product = {resultArray}/>
          </MDBRow>
        {/* </div> */}
      </div>
    </div>
  );
}
