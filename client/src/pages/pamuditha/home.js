import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div style={{ backgroundColor: "#E8ECEF", height: "100vh" }}>
      <div className="jumbotron centered">
        <div className="container">
          <h1 className="display-3">Project 2-2</h1>
          <p className="lead">Home page !</p>
          <hr />
          <Link className="btn btn-light btn-lg" to="/register" role="button">
            Register
          </Link>
          <Link className="btn btn-dark btn-lg" to="/login" role="button">
            Login
          </Link>
          <Link className="btn btn-dark btn-lg" to="/crud" role="button">
            CRUD
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
