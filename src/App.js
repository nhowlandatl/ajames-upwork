import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';

// Components
import Admin from './Components/Admin.jsx' // Admin user dashboard view
import Regular from './Components/Regular.jsx' // Regular user dashboard view
// import Routes from './Routes.jsx' 
import NotFound from './Components/NotFound.jsx'

// AWS
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "", 
      loggedIn: false,
      admin: false,
      regular: false,
      userInfo: null,
      IsAuthenticating: true
    };
  }

  async onLoad() {
    // Auth.currentSession will retreive JWT and which Cognito group the user belongs to immediately when page loads
    try {
      await Auth.currentSession()
      .then(user => {
        this.setState({
          loggedIn: true,
          currentUser: user
        })
        console.log(user.accessToken.payload)
        // Set to Regular state if Cognito group is "Regular"
        // Need to change logic to sort through "groups" array and choose the highest status group and not just position[0] in array
        if(user.accessToken.payload['cognito:groups'][0] === "Regular") {
          this.setState({ 
            regular: true 
          });
          console.log(this.state.loggedIn)
          // Set to Admin state if Cognito group is "Admin"
        } else if(user.accessToken.payload['cognito:groups'][0] === "Admin") {
          this.setState({ 
            admin: true 
          });
          console.log(this.state.loggedIn)
        }
        else (console.log("auth failed"))
      })
      Auth.currentUserInfo()
      .then(currentUser => {
          console.log(currentUser)
          this.setState({
              userInfo: currentUser 
          })
      })
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    this.setState({
      IsAuthenticating: false
    })
  }

  componentDidMount() {
    // Check AWS login status upon load
    this.onLoad();
  }

  render() {
    return ( 
      !this.state.isAuthenticating && (
        <div className="App">
          {/* Navbar component */}
          <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
            <Navbar.Brand href="/" className="font-weight-bold text-muted">
              Management Console
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                {this.state.loggedIn !== true &&
                <Nav.Link href="https://ajamesamplify5e38b46e-5e38b46e-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=1noet1mlcvhpi2dhb3i6h6gpum&redirect_uri=http://localhost:3000/">Signup or Login</Nav.Link>
                }
                {this.state.loggedIn === true &&
                  <div>Sign out</div>
                }
              </Nav>
            </Navbar.Collapse>
        </Navbar>
          <Switch>
            {/* Default homepage after login/register redirect */}
            <Route exact path ="/">
              {/* Admin is the admin dashboard for now */}
              <Admin 
                loggedIn={this.state.loggedIn}
                admin={this.state.admin}
                currentUser={this.state.currentUser}
                userInfo={this.state.userInfo}
              />
              {/* Regular is the non-admin dashboard for now */}
              <Regular
                loggedIn={this.state.loggedIn}
                regular={this.state.regular}
                currentUser={this.state.currentUser}
                userInfo={this.state.userInfo}
              />
            </Route>
            {/* Catch-all route for error */}
            <Route>
            <NotFound />
            </Route>
          </Switch>
            {/* Passes in the state of Cognito user as props */}
            {/* Likely can re-factor to reduce redundancy */}
        </div>
      )
    );
  }
}

export default App;