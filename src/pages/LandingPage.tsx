import AuthorizeButton from "../components/AuthorizeButton";
import React from "react";
import {RouteComponentProps, useLocation, withRouter} from "react-router-dom";
import {WithStyles, withStyles} from "@material-ui/core";

const styles = {
    message: {

    },
    container: {
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        height: "100%",
        width: "100%"
    },
    buttonWrapper: {
        textAlign: "center" as const
    },

interface LandingPageProps extends WithStyles<typeof styles>, RouteComponentProps {}

type RouterStateType = {
    landingMessage: string
}

function LandingPage(props: LandingPageProps) {
    const { state } = useLocation<RouterStateType>();
    const { classes } = props;
    return (
        <div className={classes.container}>
            { state?.landingMessage &&
                <h4 className={classes.message}>
                    {state.landingMessage}
                </h4>
            }
            <div className={classes.buttonWrapper}>
                <AuthorizeButton/>
            </div>
        </div>
    )
}

export default withRouter( withStyles(styles)(LandingPage) );