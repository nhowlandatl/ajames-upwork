import React, { useState } from "react";

// AWS
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import {
  FormText,
  FormGroup,
  FormControl,
  FormLabel,
} from "react-bootstrap";


// Custom styling and error handling
import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangeEmail.css";
import PrivacyHOC from "../HOCs/PrivacyHOC";

function ChangeEmail(props) {
  const history = useHistory();
  const [codeSent, setCodeSent] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: "",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  function validateEmailForm() {
    return fields.email.length > 0;
  }

  function validateConfirmForm() {
    return fields.code.length > 0;
  }

  async function handleUpdateClick(event) {
    event.preventDefault();

    setIsSendingCode(true);

    try {
      const user = await Auth.currentAuthenticatedUser();
      let result = await Auth.updateUserAttributes(user, { 
          email: fields.email 
        });
        console.log(result)
      setCodeSent(true);
    } catch (error) {
      onError(error);
      setIsSendingCode(false);
    }
  }

  async function handleConfirmClick(event) {
    event.preventDefault();

    setIsConfirming(true);
        await Auth.verifyCurrentUserAttributeSubmit("email", fields.code)
        .then((res) => {
            console.log(res)
            setIsConfirming(false);
            if(res === "SUCCESS") {
                setIsConfirmed(true)
                window.setTimeout(() => {
                  history.push('/settings')
                }, 3000) // Return to settings page after 2 seconds. Alternatively, have prompt to change again.
            }
        })
        .catch(error => {
            onError(error);
            setIsConfirming(false);
        }) 
    }
  
  function renderUpdateForm() { 
    return (
      <form onSubmit={handleUpdateClick}>
        <FormGroup bsSize="large" controlId="email">
            {props.userInfo &&
          <FormLabel >Change your email address below</FormLabel>
            }
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isSendingCode}
          disabled={!validateEmailForm()}
        >
          Update Email
        </LoaderButton>
      </form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        {/* Conditionally render email change form if email has not been changed on page visit. If name is successfully changed, render success notice and redirect */}
        {isConfirmed === false ?
        <div>
          <FormGroup bsSize="large" controlId="code">
            <FormLabel >{isConfirmed}</FormLabel>
            <FormControl
              autoFocus
              type="tel"
              value={fields.code}
              onChange={handleFieldChange}
            />
            <FormText>
              Please check your email ({fields.email}) for the confirmation code.
            </FormText>
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            isLoading={isConfirming}
            disabled={!validateConfirmForm()}
          >
            Confirm
          </LoaderButton>
          </div>
          : // Conditional render if email changed success
          <div>
            <h3>Email changed</h3>
          </div>
        }
      </form>
    );
  }
  return (
    <div className="ChangeEmail">
      {!codeSent ? renderUpdateForm() : renderConfirmationForm()}
    </div>
  );
}

export default PrivacyHOC(ChangeEmail)