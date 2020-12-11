import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap"; 

// CSS
import './Settings.css'

// Components
import LoaderButton from "./LoaderButton";

// AWS
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
        <div className="Settings">
            <LinkContainer to="/settings/email">
                <LoaderButton block bsSize="large">
                    Change Email
                </LoaderButton>
            </LinkContainer>
            <LinkContainer to="/settings/password">
                <LoaderButton block bsSize="large">
                    Change Password
                </LoaderButton>
            </LinkContainer>
            <LinkContainer to="/settings/name">
                <LoaderButton block bsSize="large">
                    Change Name
                </LoaderButton>
            </LinkContainer>
            <hr />
        </div>
        )
    }
}

export default withRouter(Settings)