import React from "react";

function Masthead() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center home-gradient">
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ flexDirection: "column" }}
      >
        <div className="col-lg-7 text-white font-weight-bold display-1 text-center">
          Welcome to GDGC ggv sign!
        </div>
        <div className="col-lg-4 divider my-4" />
        <div
          className="col-lg-7 container text-white-50 lead text-center"
          style={{ fontSize: "5rem !important" }}
        >
          The complete application for Indian Sign Language. Explore our all of the
          features which have been designed keeping in mind the
          specific needs of people related to the sign language that is spoken in india.
        </div>
        <div className="d-flex justify-content-center mt-5">
          <a className="btn btn-info btn-lg px-3" href="#intro">
            Get Started <i className="fa fa-angle-down" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Masthead;
