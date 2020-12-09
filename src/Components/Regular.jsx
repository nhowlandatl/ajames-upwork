// // ./components/Regular.jsx

// // Don't think I need to use private route since root (App.js) already phones home to AWS
// // import RegularPrivacyHOC from '../HOCs/RegularPrivacyHOC.jsx'
import React from 'react';
import { Auth } from 'aws-amplify';

class Regular extends React.Component {

    changePassword = () => {
        Auth.currentAuthenticatedUser()
            .then(user => {
                return Auth.changePassword(user, 'oldPassword', 'newPassword');
            })
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }
    
    // Retrieve user info
    render () {
        return (
            <div>
                {this.props.regular === true && this.props.userInfo &&
                <div>
                    <h2>Hello, {this.props.userInfo.attributes.name}</h2> 
                    <h2>You are viewing the non-admin board</h2>
                    <button 
                        onClick={this.changePassword}>    
                    </button>
                </div>
                }
            </div>
        )
    }
};

export default (Regular);

// Change password form here. To do: Create button to change password. Button links to react hook that copies this function.
// import React, { useState } from "react";
// import { Auth } from "aws-amplify";
// import { useHistory } from "react-router-dom";
// import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
// import LoaderButton from "../components/LoaderButton";
// import { useFormFields } from "../libs/hooksLib";
// import { onError } from "../libs/errorLib";
// import "./ChangePassword.css";

// export default function ChangePassword() {
//   const history = useHistory();
//   const [fields, handleFieldChange] = useFormFields({
//     password: "",
//     oldPassword: "",
//     confirmPassword: "",
//   });
//   const [isChanging, setIsChanging] = useState(false);

//   function validateForm() {
//     return (
//       fields.oldPassword.length > 0 &&
//       fields.password.length > 0 &&
//       fields.password === fields.confirmPassword
//     );
//   }

//   async function handleChangeClick(event) {
//     event.preventDefault();

//     setIsChanging(true);

//     try {
//       const currentUser = await Auth.currentAuthenticatedUser();
//       await Auth.changePassword(
//         currentUser,
//         fields.oldPassword,
//         fields.password
//       );

//       history.push("/settings");
//     } catch (error) {
//       onError(error);
//       setIsChanging(false);
//     }
//   }

//   return (
//     <div className="ChangePassword">
//       <form onSubmit={handleChangeClick}>
//         <FormGroup bsSize="large" controlId="oldPassword">
//           <ControlLabel>Old Password</ControlLabel>
//           <FormControl
//             type="password"
//             onChange={handleFieldChange}
//             value={fields.oldPassword}
//           />
//         </FormGroup>
//         <hr />
//         <FormGroup bsSize="large" controlId="password">
//           <ControlLabel>New Password</ControlLabel>
//           <FormControl
//             type="password"
//             onChange={handleFieldChange}
//             value={fields.password}
//           />
//         </FormGroup>
//         <FormGroup bsSize="large" controlId="confirmPassword">
//           <ControlLabel>Confirm Password</ControlLabel>
//           <FormControl
//             type="password"
//             onChange={handleFieldChange}
//             value={fields.confirmPassword}
//           />
//         </FormGroup>
//         <LoaderButton
//           block
//           type="submit"
//           bsSize="large"
//           disabled={!validateForm()}
//           isLoading={isChanging}
//         >
//           Change Password
//         </LoaderButton>
//       </form>
//     </div>
//   );
// }
