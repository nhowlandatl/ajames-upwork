import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Amplify, API } from "aws-amplify";
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoading: "", 
          setIsLOading: false
        };
      }

    render() {
        return (
            <div>
                Sample settings page
            </div>
        )
    }
}

export default withRouter(Settings)