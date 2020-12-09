import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import Admin from './Components/Admin.jsx' // Admin user dashboard view
import Regular from './Components/Regular.jsx' // Regular user dashboard view

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
      userInfo: null 
    };
  }

  componentDidMount() {
    // Auth.currentSession will retreive JWT and which Cognito group the user belongs to immediately when page loads
    Auth.currentSession()
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
  
  render() {
    return ( 
      <div className="App">
        {/* Change to do re-direct to correct page with exact path */}
        <Router>
          {/* Passes in the state of Cognito user as props */}
          {/* Likely can re-factor to reduce redundancy */}
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
        </Router>
      </div>
    );
  }
}

export default App;