// React
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

// Components
import { useFormFields } from "../libs/hooksLib";
import LoaderButton from './LoaderButton'
import "./Signup.css";

// AWS
import Amplify, { Auth } from "aws-amplify";
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);


function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    confirmationCode: ""
  });

  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.firstName.length > 0 &&
      fields.lastName.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
            family_name: fields.lastName,
            name: fields.firstName
        }
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      history.push("/");
    } catch (e) {
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
        <div>
            {props.loggedIn === true &&
            <div>
                You are already logged in
            </div>
             }
            {props.loggedIn === false &&
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" size="lg">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    autoFocus
                    type="email"
                    value={fields.email}
                    onChange={handleFieldChange}
                />
                </Form.Group>
                <Form.Group controlId="firstName" size="lg">
                <Form.Label>First name</Form.Label>
                <Form.Control
                    autoFocus
                    type="firstName"
                    value={fields.firstName}
                    onChange={handleFieldChange}
                />
                </Form.Group>
                <Form.Group controlId="lastName" size="lg">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    autoFocus
                    type="lastName"
                    value={fields.lastName}
                    onChange={handleFieldChange}
                />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={fields.password}
                    onChange={handleFieldChange}
                />
                </Form.Group>
                <Form.Group controlId="confirmPassword" size="lg">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.confirmPassword}
                />
                </Form.Group>
                <LoaderButton
                block
                size="lg"
                type="submit"
                variant="success"
                isLoading={isLoading}
                disabled={!validateForm()}
                >
                Signup
                </LoaderButton>
                <Link to="/login">Already have an account? Sign in</Link>
            </Form>
            }
        </div>
    );
  }
  

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}

export default Signup