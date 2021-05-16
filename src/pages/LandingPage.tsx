import AuthorizeButton from "../components/AuthorizeButton";
import React from "react";
import {useLocation, withRouter } from "react-router-dom";

type RouterStateType = {
    landingMessage: string
}

function LandingPage() {
    const { state } = useLocation<RouterStateType>();
    return <div> {
            state?.landingMessage &&
            <h4>
                {state.landingMessage}
            </h4>
        }
        <AuthorizeButton/>
    </div>
}

export default withRouter( LandingPage );