import React, { Component } from "react";
import {
  Route, BrowserRouter as Router, Switch
} from 'react-router-dom';
import Admin from "./Components/Admin"
import ProtectedRoutes from "./Components/ProtectedRoutes"

class App extends Component {
  render() {
    return ( 
      <div className="App">
        <Router>
          <Switch>
              <Route path ='/admin' component={Admin}/>
              {/* Implement non-admin route later */}
              {/* <route path ='/user' component={User}/>  */}
          </Switch>
      </Router>
      </div>
    );
  }
}

export default App;