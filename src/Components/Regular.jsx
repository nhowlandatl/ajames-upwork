// ./components/Regular.jsx

// Don't think I need to use private route since root (App.js) already phones home to AWS
// import RegularPrivacyHOC from '../HOCs/RegularPrivacyHOC.jsx'
import React from 'react';

class Regular extends React.Component {
    // Retrieve user info
    render () {
        return (
            <div>
                {this.props.regular === true && this.props.userInfo &&
                <div>
                    <h2>Hello, {this.props.userInfo.attributes.name}</h2> 
                    <h2>You are viewing the non-admin board</h2>
                </div>
                }
            </div>
        )
    }
};

export default (Regular);