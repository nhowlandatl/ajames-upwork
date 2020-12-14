// React core
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// Bootstrap
import {
    FormGroup,
    FormControl,
    FormLabel
  } from "react-bootstrap";

// Components
import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangeName.css";
import PrivacyHoc from '../HOCs/PrivacyHOC'

// AWS
import { Auth } from "aws-amplify";

function ChangeName(props) {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    name: ""
  });
  const [isChanging, setIsChanging] = useState(false);
  const [nameChanged, setNameChange] = useState(false);
  // const [currentUser, setCurrentUser] = useState(""); 

  function validateForm() {
    return (
      fields.name.length > 0
    );
  }


  // Get current user info from AWS
  // useEffect(() => {
  //   Auth.currentUserInfo()
  //     .then(user => {
  //         console.log(user)
  //         setCurrentUser(
  //           user.attributes.name
  //         )
  //         console.log(currentUser)
  //     })
  //     .catch(e => 
  //       alert(e + ": You need to log in first")
  //     )
  //   }, []
  // ); 
  
  async function handleChangeClick(event) {
    event.preventDefault();

    setIsChanging(true);
    setNameChange(false);

      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, {
          'name': fields.name
      })
    .then((res) => {
      console.log(res)
      setIsChanging(false);
      if(res === "SUCCESS") {
        setNameChange(true)
        window.setTimeout(() => {
          history.push('/settings')
        }, 2000) // Return to settings page after 2 seconds. Alternatively, have prompt to change again.
      }
    })
    .catch(error => {
        onError(error);
        setIsChanging(false);
    }) 
  }

  return (
    <div className="ChangeName">
      <form onSubmit={handleChangeClick}>
        {/* Conditionally render name change form if not has not been changed. If name is successfully changed, render success notice and redirect */}
        {nameChanged === false ?
          <div>
          <FormGroup bsSize="large" controlId="name">
            <FormLabel >You can change your name below.</FormLabel>
            <FormControl
              type="name"
              onChange={handleFieldChange}
              value={fields.name}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            disabled={!validateForm()}
            isLoading={isChanging}
          >
            Change name
          </LoaderButton>
          </div>
          : // Conditional render if name change success
          <div>
            <h3>Name successfully changed </h3>
          </div>
        }
      </form>
    </div>
  );
}

export default PrivacyHoc(ChangeName)