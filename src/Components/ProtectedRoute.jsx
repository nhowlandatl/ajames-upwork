/* src/Protected.js */
import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify'
import Container from './Container'

function Protected(props) {
  useEffect(() => {
    Auth.currentSession()
    .then(user => {
      console.log(user.accessToken.payload)
    })
      .catch(() => {
        window.location.assign('https://ajamesamplify5e38b46e-5e38b46e-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=1noet1mlcvhpi2dhb3i6h6gpum&redirect_uri=http://localhost:3000/');
      })
  }, [])
  return (
    <Container>
      <h1>Protected route</h1>
    </Container>
  );
}

export default Protected