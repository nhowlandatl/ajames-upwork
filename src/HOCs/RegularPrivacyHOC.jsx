import React from 'react';

export default function RegularPrivacyHOC(WrappedComponent2) {
    return (
        class RegularPrivacyHOC extends React.Component {
            isLoggedIn = () => {
                return this.props.loggedIn
            }
            render () {
                return this.isLoggedIn() ?
                    <WrappedComponent2 {...this.props} /> 
                    : // or render this
                    this.props.loggedIn === false && <h1>You must be logged in</h1> 
                    // <OtherComponent/> 
            }
        }
    )
};