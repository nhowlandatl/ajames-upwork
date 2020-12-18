// ./components/Admin.jsx

// Don't think I need to use private route since root (App.js) already phones home to AWS and back-end operations require a JWT token.
// import PrivacyHOC from '../HOCs/PrivacyHOC.jsx' 
import React from 'react';

// AWS
import { Auth, API } from 'aws-amplify';

// Bootstrap
import { Container } from 'react-bootstrap';

class Admin extends React.Component {
    // Add user to admin group. Currently hard coded use case. 
    addToGroup = async () => { 
        let apiName = 'AdminQueries';
        let path = '/addUserToGroup';
        let myInit = {
            body: {
              "username" : "test@test.com", // input the email address of user
              "groupname": "Admin" // the pool to which they are added
            }, 
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            } 
        }
        return await API.post(apiName, path, myInit);
      }
      
      // Sample code logic for "Administrator" level users to view Regular users. Output is logged to console.
      // See more info here: https://aws.amazon.com/blogs/mobile/amplify-cli-enables-creating-amazon-cognito-user-pool-groups-configuring-fine-grained-permissions-on-groups-and-adding-user-management-capabilities-to-applications/
      listRegularUsers = async (limit) => {
        let nextToken; 
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

    render () {
        return (
            <Container>
                {this.props.admin === true && this.props.userInfo &&
                <div>
                    <h2>Hello, {this.props.userInfo.attributes.name}</h2> 
                    <h2>You are viewing the admin board</h2>
                    <br/>
                    <h2>This is sample logic for an administrator view via the AWS Cognito Administrator API that was added to Amplify. You can list regular users (see console log) and add someone to group (currently hard coded logic)</h2>
                    <button onClick={this.addToGroup}>Add to Group</button>
                    <button onClick={() => this.listRegularUsers(10)}>List regular users</button>
                </div>
                }
            </Container>
        )
    }
};

export default (Admin);