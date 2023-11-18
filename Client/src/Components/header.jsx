import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  MDBNavbarToggler,
  Collapse,
  MDBIcon,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  MDBInput,
} from "mdbreact";
import { Nav } from "react-bootstrap";
// import Smallheader from "./smallheader";
import Cookies from "js-cookie";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar
        light
        expand="md"
        style={{ marginTop: "-10px", backgroundColor: "#786141" }}
      >
        <NavbarBrand>
          <img
            src="./assets/logo.png"
            height="80"
            width="80"
            alt="Wise Way"
            style={{ marginLeft: "30px" }}
          />
          <h4
            className="font-weight-bold text-uppercase mb-0 ml-2"
            style={{ color: "#54b5be", fontWeight: "bold" }}
          >
            Wise <span style={{ color: "black" }}>Way</span>
          </h4>
        </NavbarBrand>
        <Nav className="mx-auto align-items-center">
          <Nav.Link href="/Home" style={{ color: "black", fontWeight: "bold" }}>
            Home
          </Nav.Link>
          <Nav.Link
            href="/support"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Support
          </Nav.Link>
          <Nav.Link
            href="/ordershistory"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Enrollment
          </Nav.Link>
        </Nav>
        <MDBNavbarToggler
          type="button"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={toggleCollapse}
        >
          <MDBIcon icon="bars" fas style={{ color: "white" }} />
        </MDBNavbarToggler>
        <Collapse isOpen={isOpen} navbar>
          <NavbarNav left></NavbarNav>
          <NavbarNav className="mx-auto" style={{ marginTop: "30px" }}>
            <form className="form-inline my-2 my-lg-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-white border-0">
                    <i className="fa fa-search" onClick={()=>{window.location.href=`/search?brand=${document.getElementById('text').value}`}}></i>
                  </span>
                </div>
                <MDBInput
                  hint="Search"
                  type="text"
                  id='text'
                  containerClass="mt-0 border-0"
                  style={{ backgroundColor: "#786141" }}
                />
              </div>
            </form>
          </NavbarNav>
          <NavbarNav className="ml-auto" right>
            <NavItem style={{ marginRight: "20px" }}>
              <Dropdown>
                <DropdownToggle
                  nav
                  caret
                  style={{ color: "black", marginRight: "20px" }}
                >
                  My Account
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      window.location.href = "/profile";
                    }}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      Cookies.remove("email");
                      Cookies.remove("token");
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </NavbarNav>
        </Collapse>
      </Navbar>
      {/* header navbar */}
      {/* <Smallheader /> */}
    </div>
  );
}
