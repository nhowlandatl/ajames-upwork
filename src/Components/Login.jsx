import React, { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

// Components
import FacebookLogin from 'react-facebook-login';
import Button from "react-bootstrap/Button";
import "./Login.css";

// AWS
import { Auth } from "aws-amplify";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      await Auth.signIn(email, password);
      alert("Logged in");
    } catch (e) {
      alert(e.message);
    }
  }
  
  return (
    <div className="Login">
        <Container> 
            <Row className="justify-content-md-center">
                <Col xs={5.5}>
                    <div>Sign in with your social media account</div>
                    <FacebookLogin onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}></FacebookLogin>
                    <div>We won't post to any of your accounts without asking first</div>
                </Col>
                <Col xs={1} className="my-auto">
                    Or
                </Col>
                <Col xs={5.5}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            Forgot your password? Click here to reset
                        </Form.Group>
                        <Button block size="lg" type="submit" disabled={!validateForm()}>
                        Login
                        </Button>
                        <Link to="/signup">Need an account? Sign up</Link>
                    </Form>
                </Col>
            </Row>
        
        </Container>
      
    </div>
  );
}
