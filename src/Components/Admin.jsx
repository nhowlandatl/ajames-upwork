// ./components/Admin.jsx

// Don't think I need to use private route since root (App.js) already phones home to AWS and back-end operations require a JWT token.

// import PrivacyHOC from '../HOCs/PrivacyHOC.jsx' 
import React from 'react';

// Bootstrap
import { Container } from 'react-bootstrap';

class Admin extends React.Component {
    // Retrieve user info
    render () {
        return (
            <Container>
                {this.props.admin === true && this.props.userInfo &&
                <div>
                    <h2>Hello, {this.props.userInfo.attributes.name}</h2> 
                    <h2>You are viewing the administrator board</h2>
                </div>
                }
                {/* Message if logging in via custom Facebook login.. ** Cannot retrieve group ID this way */}
                {this.props.currentUser &&
                <div>
                    <h2>Hello, {this.props.currentUser.name}</h2> 
                    <h2>You are viewing the administrator board</h2>
                </div>
                }
            </Container>
        )
    }
};

export default (Admin);