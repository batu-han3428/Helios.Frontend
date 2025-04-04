import React from "react";
import { Link } from "react-router-dom";
import { Card, Row } from "reactstrap";

// import images
import bg from "../../../assets/images/bg.jpg";
import logoDark from "../../../assets/images/logo-dark.png";

const Register2 = () => {
  document.title = "Register 2 | Veltrix - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div
        className="accountbg"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${bg})`
        }}
      ></div>
      <div className="wrapper-page account-page-full">
        <Card className="shadow-none">
          <div className="card-block">
            <div className="account-box">
              <div className="card-box shadow-none p-4">
                <div className="p-2">
                  <div className="text-center mt-4">
                    <Link to="/index">
                      <img src={logoDark} height="22" alt="logo" />
                    </Link>
                  </div>

                  <h4 className="font-size-18 mt-5 text-center">
                    Free Register
                  </h4>
                  <p className="text-muted text-center">
                    Get your free Veltrix account now.
                  </p>

                  <form className="mt-4" action="#">
                    <div className="mb-3">
                      <label htmlFor="useremail">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="useremail"
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="userpassword">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="userpassword"
                        placeholder="Enter password"
                      />
                    </div>

                    <Row className="mb-3">
                      <div className="col-12 text-end">
                        <button
                          className="btn btn-primary w-md waves-effect waves-light"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                    </Row>

                    <Row className="mt-2 mb-0">
                      <div className="col-12 mt-3">
                        <p className="mb-0">
                          By registering you agree to the Veltrix{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Row>
                  </form>

                  <div className="mt-5 pt-4 text-center">
                    <p>
                      Already have an account ?{" "}
                      <Link
                        to="/pages-login-2"
                        className="fw-medium text-primary"
                      >
                        {" "}
                        Login{" "}
                      </Link>{" "}
                    </p>
                    <p>
                      © {new Date().getFullYear()} Veltrix. Crafted with{" "}
                      <i className="mdi mdi-heart text-danger"></i> by
                      Themesbrand
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Register2;
