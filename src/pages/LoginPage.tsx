import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import { login } from "../services/auth";
import { LoginCredentials } from "../@types/types";

const LoginPage = () => {
  const [loginCreds, setLoginCreds] = useState<LoginCredentials>({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>({ show: false, message: "" });
  const [formErrors, setFormErrors] = useState<any>({
    name: { isInvalid: false, message: "" },
    email: { isInvalid: false, message: "" },
  });
  const navigate = useNavigate();

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    if (validateForm()) {
      const response = await login(loginCreds);
      setTimeout(() => {
        setIsLoading(false);
        if (response.isSuccess) {
          navigate("/home");
        } else {
          setError({ show: true, message: response.error.message });
        }
      }, 1500);
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    let isValid = true;
    const errObj = { ...formErrors };
    if (!loginCreds.name) {
      isValid = false;
      errObj.name = { isInvalid: true, message: "Field cannot be empty" };
    }
    if (!loginCreds.email) {
      isValid = false;
      errObj.email = { isInvalid: true, message: "Field cannot be empty" };
    }
    if (
      !loginCreds.email.match(
        new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")
      )
    ) {
      isValid = false;
      errObj.email = { isInvalid: true, message: "Enter valid email address" };
    }
    setFormErrors(errObj);
    return isValid;
  };

  console.log(formErrors);

  return (
    <Container
      fluid
      className="m-auto d-flex justify-content-center align-items-center mt-5"
    >
      <Row className="">
        <Col className="m-auto" xxl={6} lg={6} md={8} sm={9} xs={10}>
          <Col className="m-auto" xxl={6} xl={5} lg={4} md={4} sm={4} xs={6}>
            <Image src={require("../assets/pawmatch-hub-logo.png")} fluid />
          </Col>
          <Form className="d-flex flex-column">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="primary-font font-weight-bold">
                Name
              </Form.Label>
              <Form.Control
                value={loginCreds.name}
                type="text"
                placeholder=""
                required
                isInvalid={formErrors.name.isInvalid}
                onFocus={() => {
                  setError({ show: false, message: "" });
                  setFormErrors({
                    ...formErrors,
                    name: { isInvalid: false, message: "" },
                  });
                }}
                onChange={(e: React.ChangeEvent<any>) =>
                  setLoginCreds({ ...loginCreds, name: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label className="primary-font font-weight-bold">
                Email address
              </Form.Label>
              <Form.Control
                value={loginCreds.email}
                type="email"
                placeholder=""
                required
                isInvalid={formErrors.email.isInvalid}
                onFocus={() => {
                  setError({ show: false, message: "" });
                  setFormErrors({
                    ...formErrors,
                    email: { isInvalid: false, message: "" },
                  });
                }}
                onChange={(e: React.ChangeEvent<any>) =>
                  setLoginCreds({ ...loginCreds, email: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mt-5 text-center">
              {error.show && (
                <div className="text-center text-danger p-3">
                  <strong className="">{error.message}</strong>
                </div>
              )}
              <Button
                className="primary-btn mt-1"
                variant="primary"
                type="submit"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  handleLogin(e)
                }
              >
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
