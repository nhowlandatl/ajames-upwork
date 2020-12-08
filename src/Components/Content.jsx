// ./components/Content.js

import PrivacyHOC from '../HOCs/PrivacyHOC.jsx'
import React from 'react';

class Content extends React.Component {
    render () {
        return (
            <h1>Super Secret Protected Information</h1>
        )
    }
};

export default PrivacyHOC(Content);