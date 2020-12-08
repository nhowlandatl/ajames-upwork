import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const Router = () => {
  return (
    <BrowserRouter> 
      <Switch>
        {/* <Route exact path="/" component={Public}/>  */}
        <Route exact path="/user" component={ProtectedRoute} />
        {/* <Route exact path="/profile" component={Profile}/>  */}
        {/* <Route component={Public}/>  */}
      </Switch>
    </BrowserRouter>
  )
}

export default Router