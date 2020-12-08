import React from "react";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

export function requireAuthentication(Component) {
    return class AuthenticatedComponent extends React.Component {

        /**
         * Check if the user is authenticated, this.props.isAuthenticated
         * has to be set from your application logic (or use react-redux to retrieve it from global state).
         */
        isAuthenticated() {
            Auth.currentSession()
                .then(user => {
                    console.log(user.accessToken.payload)
                    this.setState({
                        // Set the current user in state
                        currentUser: user
                        })
                        // See which group the user belongs to and specify admin status
                    console.log(this.state.currentUser)
                    if(user.accessToken.payload['cognito:groups'][1] === "Admin") {
                    this.setState({ 
                        adminStatus: true 
                    });
                    }
                })
            return this.props.isAuthenticated;
        }

        /**
         * Render
         */
        render() {
            const loginErrorMessage = (
                <div>
                    Please <a href="/login">login</a> in order to view this part of the application.
                </div>
            );

            return (
                <div>
                    { this.isAuthenticated === true ? <Component {...this.props} /> : loginErrorMessage }
                </div>
            );
        }
    };
}

export default requireAuthentication;