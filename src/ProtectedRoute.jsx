/* src/Protected.js */
import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify'

function Protected(props) {
  useEffect(() => {
    Auth.currentAuthenticatedUser()
    .then(user => {
        console.log(user)
    })
      .catch(() => {
        //   This should redirect to the login endpoint
        // window.location.assign('https://ajamesamplify5e38b46e-5e38b46e-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=1noet1mlcvhpi2dhb3i6h6gpum&redirect_uri=http://localhost:3000/');
        props.history.push('/notloggedin')
      })
  }, [])
  return (
    <div>
      <h1>Admin logged in</h1>
    </div>
  );
}

export default Protected