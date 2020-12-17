import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Spinner } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap"; 

// Components
import Admin from './Components/Admin.jsx' // Admin user dashboard view
import Regular from './Components/Regular.jsx' // Regular user dashboard view
import Alert from './Components/Alert.jsx'
// import Routes from './Routes.jsx' Modify to use a Routes file and add validation to them
import NotFound from './Components/NotFound.jsx'
import Settings from './Components/Settings.jsx' 
import ChangeEmail from './Components/ChangeEmail.jsx'
import ChangePassword from './Components/ChangePassword.jsx'
import ChangeName from './Components/ChangeName.jsx'
import Signup from './Components/Signup.jsx'
import Login from './Components/Login.jsx'

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
      isLoading: false
    };
  }

  // Logout function
  async handleLogout() {
    await Auth.signOut()
    .then((res) => {
      console.log(res)
      // Clear session state
      this.setState({
        loggedIn: false,
        admin: false,
        regular: false,
        userInfo: null,
      })
      // Redirect to login page
      this.props.history.push('/login')
    })
    .catch(e => {
      console.log(e)
    })
  }

  async onLoad() {
    // Retrieve facebook user if logged in via /login route and not hosted UI portal. It seems you cannot access user pool group info (e.g., admin/regular) from FB login unless you use the Hosted UI portal. 
    await Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({
        loggedIn: true,
        currentUser: user
      })
      console.log(user)
    })
    .catch(e => 
      console.log("you need to log in first")
    )
    // Auth.currentSession will retreive JWT and which Cognito group the user belongs to immediately when page loads. If user is not logged in, nothing will render and alert will ask user to log in or sign up.
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
      })
      .catch(e => 
        console.log("you need to log in first")
      )
      // Get current user name/email
      await Auth.currentUserInfo()
      .then(currentUser => {
          console.log(currentUser)
          this.setState({
            userInfo: currentUser,
            IsAuthenticating: false,
            isLoading: false
          })
      })
      .catch(e => 
        console.log(e)
        // Optionally redirect to login programatically here
      )
  }

  async componentDidMount() {
    this.setState({isLoading: true})
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
              User Management Console
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                {this.state.loggedIn !== true &&
                <Nav.Link href="/login">Signup or Login</Nav.Link>
                }
                {this.state.loggedIn === true &&
                  <Nav.Link onClick={this.handleLogout.bind(this)}>Logout</Nav.Link>
                }
                {this.state.loggedIn === true &&
               <LinkContainer to="/settings">
                <Nav.Link>Settings</Nav.Link>
                </LinkContainer>
                }
              </Nav>
            </Navbar.Collapse>
        </Navbar>
          <Switch>
              {this.state.isLoading &&
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              }
            {/* Default homepage after login/signup redirect */}
            <Route exact path ="/">
              {this.state.loggedIn === false &&
                <Alert/>
              }
              {/* Admin is the admin dashboard for now */}
              <Admin 
                admin={this.state.admin}
                currentUser={this.state.currentUser}
                userInfo={this.state.userInfo}
              />
              {/* Regular is the non-admin dashboard for now */}
              <Regular
                regular={this.state.regular}
                currentUser={this.state.currentUser}
                userInfo={this.state.userInfo}
              />
            </Route>
            {/* Main Settings page */}
            <Route exact path="/settings">
              <Settings 
                userInfo={this.state.userInfo}
                loggedIn={this.state.loggedIn}
              />
            </Route>
            {/* Change email page */}
            <Route exact path="/settings/email">
              <ChangeEmail 
                userInfo={this.state.userInfo}
                loggedIn={this.state.loggedIn}
              />
            </Route>
            {/* Change password page */}
            <Route exact path="/settings/password">
              <ChangePassword 
                userInfo={this.state.userInfo}
                loggedIn={this.state.loggedIn}
              />
            </Route>
            {/* Change first name page */}
            <Route exact path="/settings/name">
              <ChangeName 
                userInfo={this.state.userInfo}
                loggedIn={this.state.loggedIn}
              />
            </Route>
            <Route exact path="/signup">
              <Signup 
              loggedIn={this.state.loggedIn}
              />
            </Route>
            <Route exact path="/login">
              <Login 
              loggedIn={this.state.loggedIn}
              />
            </Route>
            {/* Catch-all route for error */}
            <Route>
             <NotFound />
            </Route>
          </Switch>
            {/* Passes in the state of Cognito user as props */}
        </div>
      )
    );
  }
}

export default withRouter(App);