import logo from './logo.svg';
import './App.css';
import { Auth } from 'aws-amplify';
import React, { Component } from "react";

export class App extends Component {

  componentDidMount() {
    Auth.currentUserInfo()
      .then(user => {
        console.log(user)
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React test
          </a>
        </header>
      </div>
    );
  }
}

export default App;
