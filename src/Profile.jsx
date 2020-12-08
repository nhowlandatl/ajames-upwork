import React, { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'

function Profile() {
  useEffect(() => {
    checkUser()
  }, [])
  const [user, setUser] = useState({})
  async function checkUser() {
    try {
      const data = await Auth.currentUserPoolUser()
      const userInfo = { username: data.username, ...data.attributes, }
      setUser(userInfo)
    } catch (err) { console.log('error: ', err) }
  }
  return (
    <div>
      <h1>Profile</h1>
      <h2>Username: {user.username}</h2>
      <h3>Email: {user.email}</h3>
      <h4>Phone: {user.phone_number}</h4>
    </div>
  );
}

export default withAuthenticator(Profile)