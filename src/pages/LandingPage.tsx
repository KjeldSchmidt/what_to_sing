import AuthorizeButton from "../components/AuthorizeButton";
import React, {ReactElement} from "react";

type LandingPageProps = {
    reauthorize?: boolean
}

function LandingPage(props: LandingPageProps) : ReactElement {
    return <div>
        {
            props.reauthorize &&
            <h4>
                Your session has expired. Start again!
            </h4>
        }
        <AuthorizeButton />
    </div>
}

export default LandingPage;