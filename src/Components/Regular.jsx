// // ./components/Regular.jsx

// // import RegularPrivacyHOC from '../HOCs/RegularPrivacyHOC.jsx'
import React from 'react';
import { Auth } from 'aws-amplify';

// Bootstrap
import { Container } from 'react-bootstrap';

class Regular extends React.Component {
    // Retrieve user info
    render () {
        return (
            <Container>
                {this.props.regular === true && this.props.userInfo &&
                <div>
                    <h2>Hello, {this.props.userInfo.attributes.name}</h2> 
                    <h2>You are viewing the non-admin board</h2>
                </div>
                }
                {this.props.facebookInfo.name && this.props.admin === false &&
                <div>
                    <h2>Hello, {this.props.facebookInfo.name}</h2> 
                    <h2>You are viewing the non-admin board</h2>
                </div>
                }
            </Container>
        )
    }
};

export default (Regular);