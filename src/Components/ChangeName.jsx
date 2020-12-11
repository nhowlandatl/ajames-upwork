import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import {
    FormGroup,
    FormControl,
    FormLabel
  } from "react-bootstrap";

import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangeName.css";

export default function ChangeName(props) {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    name: ""
  });
  const [isChanging, setIsChanging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState("Change name");

  function validateForm() {
    return (
      fields.name.length > 0
    );
  }

  async function handleChangeClick(event) {
    event.preventDefault();

    setIsChanging(true);

      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, {
          'name': fields.name
      })
    .then((res) => {
        console.log(res)
        history.push("/settings");
        setIsChanging(false);
        if(res === "SUCCESS") {
            setIsConfirmed("Name successfully changed")
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
        <FormGroup bsSize="large" controlId="name">
        {props.userInfo &&
          <FormLabel >Hi, {props.userInfo.attributes.name}. You can change your name below.</FormLabel>
            }
          <FormControl
            type="name"
            onChange={handleFieldChange}
            value={fields.name}
          />
        </FormGroup>
        <hr />
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          disabled={!validateForm()}
          isLoading={isChanging}
        >
          Change name
        </LoaderButton>
      </form>
    </div>
  );
}
