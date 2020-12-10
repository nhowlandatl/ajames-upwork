import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom";
import Admin from './Components/Admin';
import Regular from './Components/Regular'
import NotFound from './Components/NotFound'

export class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path ="/">
                    <Admin/>
                    <Regular/>
                </Route>
            </Switch>
        )
    }
}

export default Routes