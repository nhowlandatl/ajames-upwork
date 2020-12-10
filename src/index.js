import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'

// // AWS 
// import Amplify from 'aws-amplify'
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App /> 
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);