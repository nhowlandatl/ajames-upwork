// **NOTE**
// Logging into facebook works and it receives token credentials, but it won't provide permissions to access the Cognito user pool group. It seems  you must use the hosted Cognito UI for Federated logins to read the Cognito user pool info. This is a documented issue with no AWS resolution. See https://github.com/aws-amplify/amplify-js/issues/399

// Custom login page (facebook + local)
import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Link, useHistory, withRouter } from "react-router-dom";

// Components
import FacebookLogin from 'react-facebook-login';
import Button from "react-bootstrap/Button";
import "./Login.css";

// AWS
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

function Login(props) {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      await Auth.signIn(email, password);
      window.location.href="/"; 
    } catch (e) {
      alert(e.message);
    }
  }
  

  useEffect(() => {
    if (!window.FB) createScript();
    }, [])

    // Facebook Signin
    const signIn = () => {
        const fb = window.FB;
        fb.getLoginStatus(response => {
            if (response.status === 'connected') {
                getAWSCredentials(response.authResponse);
            } else {
                fb.login(
                    response => {
                        if (!response || !response.authResponse) {
                            return;
                        }
                        getAWSCredentials(response.authResponse);
                    },
                    {
                        // the authorized scopes
                        scope: 'public_profile,email'
                    }
                );
            }
        });
    }

    const getAWSCredentials = (response) => {
        const { accessToken, expiresIn } = response;
        const date =new Date();
        const expires_at = expiresIn * 1000 + date.getTime();
        if (!accessToken) {
            return;
        }

        const fb = window.FB;
        fb.api('/me', { fields: 'name,email' }, response => {
            const user = {
                name: response.name,
                email: response.email
            };
            console.log((user))
            Auth.federatedSignIn('facebook', { token: accessToken, expires_at }, user)
            .then(credentials => {
                console.log(credentials);
            });
        });
    }

    const initFB = () => {
        const fb = window.FB;
        console.log('FB SDK initialized');
    }

    const createScript = () => {
        // load the sdk
        window.fbAsyncInit = fbAsyncInit;
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.onload = initFB;
        document.body.appendChild(script);
    }

    const fbAsyncInit = () => {
        // init the fb sdk client
        const fb = window.FB;
        fb.init({
            appId   : '197530488546623',
            cookie  : true,
            xfbml   : true,
            version : 'v2.11'
        });
    }
    // End facebook login function

  return (
    <div className="Login">
        {props.loggedIn === true &&
        <div>
            You are already logged in
        </div>
        }
        {props.loggedIn === false &&
        <Container> 
            <Row className="justify-content-md-center">
                <Col xs={5.5}>
                    <div>Sign in with your social media account</div>
                    <FacebookLogin onClick={() => signIn()}></FacebookLogin>
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
        }
    </div>
  );
}

export default withRouter(Login)


// Facebook login testing
// import React, { useEffect } from 'react';
// import { Auth } from 'aws-amplify';
// // To federated sign in from Facebook
// const Login = () => {

//     useEffect(() => {
//         if (!window.FB) createScript();
//     }, [])

//     const signIn = () => {
//         const fb = window.FB;
//         fb.getLoginStatus(response => {
//             if (response.status === 'connected') {
//                 getAWSCredentials(response.authResponse);
//             } else {
//                 fb.login(
//                     response => {
//                         if (!response || !response.authResponse) {
//                             return;
//                         }
//                         getAWSCredentials(response.authResponse);
//                     },
//                     {
//                         // the authorized scopes
//                         scope: 'public_profile,email'
//                     }
//                 );
//             }
//         });
//     }

//      const getAWSCredentials = (response) => {
//             const { accessToken, expiresIn } = response;
//             const date =new Date();
//             const expires_at = expiresIn * 1000 + date.getTime();
//             if (!accessToken) {
//                 return;
//             }

//             const fb = window.FB;
//             fb.api('/me', { fields: 'name,email' }, response => {
//                 const user = {
//                     name: response.name,
//                     email: response.email
//                 };
//                 console.log((user))
//                 Auth.federatedSignIn('facebook', { token: accessToken, expires_at }, user)
//                 .then(credentials => {
//                     console.log(credentials);
//                 });
//             });
//         }

//     const initFB = () => {
//         const fb = window.FB;
//         console.log('FB SDK initialized');
//     }

//     const createScript = () => {
//       // load the sdk
//       window.fbAsyncInit = fbAsyncInit;
//       const script = document.createElement('script');
//       script.src = 'https://connect.facebook.net/en_US/sdk.js';
//       script.async = true;
//       script.onload = initFB;
//       document.body.appendChild(script);
//   }

//     const fbAsyncInit = () => {
//         // init the fb sdk client
//         const fb = window.FB;
//         fb.init({
//             appId   : '197530488546623',
//             cookie  : true,
//             xfbml   : true,
//             version : 'v2.11'
//         });
//     }

//     return (
//         <div>
//             <button onClick={signIn}>Sign in with Facebook</button>
//         </div>
//     );
// }

// export default Login;