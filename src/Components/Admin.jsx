import Amplify, { Auth } from 'aws-amplify';
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminStatus: false,
      currentUser: ""
    };
  }
  componentDidMount() {
    // Auth.currentSession will retreive JWT and which Cognito group the user belongs to
    Auth.currentSession()
      .then(user => {
        console.log(user.accessToken.payload)
        this.setState({
          // Set the current user in state
          currentUser: user
        })
        // See which group the user belongs to and specify admin status
        console.log(this.state.currentUser)
        if(user.accessToken.payload['cognito:groups'][1] === "Admin") {
          this.setState({ 
            adminStatus: true 
          });
        }
      })
  }
  
  render() {
    return (
      <div>
        {/* Conditional rendering based on admin status */}
      {this.state.adminStatus === true ? 
        <div>
          <h2>You have admin privileges</h2>
          <h5>Click here to enter the admin console</h5>
        </div>
        :
        <div>
          <h2></h2>
          <h2>You do not have admin privileges</h2>
          <h5>Click here to enter the regular user console</h5>
        </div>
        }
    </div>
    
    );
  }
}

export default Admin;