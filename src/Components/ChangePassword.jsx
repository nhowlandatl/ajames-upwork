// React core
import React, { useState } from "react";
import { Auth } from "aws-amplify";
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
import "./ChangePassword.css";
import PrivacyHoc from '../HOCs/PrivacyHOC'

function ChangePassword(props) {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    password: "",
    oldPassword: "",
    confirmPassword: "",
  });
  const [isChanging, setIsChanging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);


  function validateForm() {
    return (
      fields.oldPassword.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleChangeClick(event) {
    event.preventDefault();

    setIsChanging(true);
    setIsConfirmed(false);

      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        fields.oldPassword,
        fields.password
      )
    .then((res) => {
        console.log(res)
        if(res === "SUCCESS") {
          setIsConfirmed(true)
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
    <div className="ChangePassword">
      <form onSubmit={handleChangeClick}>
        {/* Conditionally render password change form if not has not been changed. If password is successfully changed, render success notice and redirect */}
        {isConfirmed === false ?
        <div>
        <FormGroup bsSize="large" controlId="oldPassword">
          <FormLabel>Old Password</FormLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.oldPassword}
          />
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <FormLabel>New Password</FormLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.password}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          disabled={!validateForm()}
          isLoading={isChanging}
        >
          Change Password
        </LoaderButton>
        </div>
        : // Conditional render if password change success
        <div>
          <h3>Password successfully changed</h3>
        </div>
        }
      </form>
    </div>
  );
}

export default PrivacyHoc(ChangePassword)