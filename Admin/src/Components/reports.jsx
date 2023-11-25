import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import "jspdf-autotable";

// Your code here

export default function Reports() {
  const [pdfUrl, setpdfUrl] = useState("http://localhost:5000/images/cv.pdf");
  const [Product, setProduct] = useState();
  const [Title, setTitle] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Select an item"); // State to store the selected item in the ComboBox

  useEffect(() => {
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    console.log(Title.toString());
    if (Title === true) {
      downloadPDF(Product);
      setTitle(false);
    }
  }, [Title, Product]);

  const downloadPDF = (data, options) => {
    // Create a new instance of jsPDF
    const doc = new jsPDF();

    const headers = [];
    const headerTitles = Object.keys(data[0]);
    for (let i = 0; i < headerTitles.length; i++) {
      headers.push({ title: headerTitles[i], dataKey: headerTitles[i] });
    }

    // Define the table rows as an array of objects
    const newData = data.map(function (item) {
      const newRow = {};
      headers.forEach(function (header) {
        newRow[header.dataKey] = item[header.dataKey];
      });
      return newRow;
    });

    // Define the table options
    const defaultOptions = {
      margin: { top: 50 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
      },
      columnStyles: {
        id: { fillColor: 255 },
      },
      didDrawPage: function (newData) {
        doc.addImage("./Assets/logo.png", "PNG", 20, 23, 20, 20);

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        const titleText = localStorage.getItem("Report");
        const titleWidth =
          (doc.getStringUnitWidth(titleText) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const titleXPos = (doc.internal.pageSize.width - titleWidth) / 2;
        doc.text(titleText, titleXPos, 35);
      },
    };

    // Merge defaultOptions and user-defined options
    options = Object.assign({}, defaultOptions, options);

    // Log the newData for debugging
    console.log("new data", newData);
    const twoDArray = newData.map(item => Object.values(item));

    console.log(twoDArray);
    // Generate the table using autoTable
    doc.autoTable({
      head: [headers.map((header) => header.title)],
      body: twoDArray,
      ...options,
    });

    // Get the PDF buffer as a Blob object
    const pdfBlob = doc.output("blob");

    // Create a URL for the Blob object
    setpdfUrl(URL.createObjectURL(pdfBlob));
  };

  const handleSelect = (event) => {
    setSelectedItem(event.target.value);
    localStorage.setItem(
      "Report",
      document.getElementById("selectedItem").value
    );
    console.log("local", localStorage.getItem("Report"));
    console.log(selectedItem);
    console.log(event.target.value);
  };

  async function fetchData() {
    setProduct([]);
    if (document.getElementById("selectedItem").value === "Enrollment Report") {
      try {
        const response = await fetch(`http://localhost:5000/enrollmentReport`);
        const data = await response.json();
        console.log();
        // downloadPDF(data.data);
        setProduct(data.data);
        console.log(data.data, Product);
        setTitle(true);
        console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (document.getElementById("selectedItem").value === "Comprehensive Weekly Enrollment Report") {
      try {
        const response = await fetch(`http://localhost:5000/daywiseEnrollmentReport`);
        const data = await response.json();
        console.log();
        // downloadPDF(data.data);
        setProduct(data.data);
        console.log(data.data, Product);
        setTitle(true);
        console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        {/* <div className={`welcome-animation ${show ? "show" : ""}`}> */}
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            Reports
          </h1>

          <div style={{ width: "100%", display: "flex" }}>
            <div style={{ width: "10%" }}></div>
            <div style={{ width: "80%" }}>
              {/* <Adminnavbar /> */}
              <div style={{ margin: "35px" }}>
                <div style={{ marginTop: "25px" }}>
                  <InputGroup>
                    <FormControl
                      as="select"
                      value={selectedItem}
                      onChange={handleSelect}
                      id="selectedItem"
                    >
                      <option>Select an item</option>
                      <option>Enrollment Report</option>
                      <option>Comprehensive Weekly Enrollment Report</option>
                    </FormControl>
                  </InputGroup>

                  <Button
                    className="btnsc"
                    style={{marginTop:'20px'}}
                    onClick={() => {
                      fetchData();
                    }}
  
                  >
                    Generate Report
                  </Button>
                </div>
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <embed
                    type="text/html"
                    src={pdfUrl}
                    width="900"
                    height="500"
                  ></embed>
                </div>
              </div>
            </div>
          </div>
          {/* </MDBCard> */}
      </div>
    </div>
  );
}
