import React, { Component } from "react";

// Components
import Content from './Components/Content.jsx'

// AWS
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      // currentUser: "" 
    };
  }

  componentDidMount() {
    // Auth.currentSession will retreive JWT and which Cognito group the user belongs to
    Auth.currentSession()
      .then(user => {
        console.log(user.accessToken.payload)
        if(user.accessToken.payload['cognito:groups'][1] === "Regular") {
          this.setState({ 
            loggedIn: false 
          });
          console.log(this.state.loggedIn)
        } else if(user.accessToken.payload['cognito:groups'][1] === "Admin") {
          this.setState({ 
            loggedIn: true 
          });
          console.log(this.state.loggedIn)
        }
        else (console.log(this.state.loggedIn))
      })
  }
  
  render() {
    return ( 
      <div className="App">
        {/* Content is the admin dashboard for now */}
        <Content loggedIn={this.state.loggedIn} /> 
      </div>
    );
  }
}

export default App;