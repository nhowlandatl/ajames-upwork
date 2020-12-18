// // ./components/Admin.jsx

// // Don't think I need to use private route since root (App.js) already phones home to AWS and back-end operations require a JWT token.

// // import PrivacyHOC from '../HOCs/PrivacyHOC.jsx' 
// import React from 'react';

// // Bootstrap
// import { Container } from 'react-bootstrap';

// class Admin extends React.Component {
//     // Retrieve user info
//     render () {
//         return (
//             <Container>
//                 {this.props.admin === true && this.props.userInfo &&
//                 <div>
//                     <h2>Hello, {this.props.userInfo.attributes.name}</h2> 
//                     <h2>You are viewing the administrator board</h2>
//                 </div>
//                 }
//             </Container>
//         )
//     }
// };

// export default (Admin);

import Amplify, { Auth, API } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);


function Admin() {
    async function addToGroup() { 
        let apiName = 'AdminQueries';
        let path = '/addUserToGroup';
        let myInit = {
            body: {
              "username" : "nhowland@outlook.com",
              "groupname": "Admin"
            }, 
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            } 
        }
        return await API.post(apiName, path, myInit);
      }
      
      
      let nextToken;

      // Sample code logic for "Administrator" level users to view Regular users. Output is logged to console.
      // See more info here: https://aws.amazon.com/blogs/mobile/amplify-cli-enables-creating-amazon-cognito-user-pool-groups-configuring-fine-grained-permissions-on-groups-and-adding-user-management-capabilities-to-applications/
      async function listEditors(limit){
        let apiName = 'AdminQueries';
        let path = '/listUsersInGroup';
        let myInit = { 
            queryStringParameters: {
              "groupname": "Regular",
              "limit": limit,
              "token": nextToken
            },
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            }
        }
        const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
        nextToken = NextToken;
        console.log(rest)
        return rest;
      }

    return (
    <div align="center" className="App">
        <button onClick={addToGroup}>Add to Group</button>
        <button onClick={() => listEditors(10)}>List Editors</button>
    </div>
    );
}

export default withAuthenticator(Admin, true);