import AuthorizeButton from "../components/AuthorizeButton";
import React from "react";
import {RouteComponentProps, useLocation, withRouter} from "react-router-dom";
import {WithStyles, withStyles} from "@material-ui/core";
import karafunLogo from '../assets/karafunLogo.png';
import spotifyLogo from '../assets/spotifyLogo.png';

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
    claim: {
        textAlign: "center" as const,
        fontSize: "3rem",
        margin: "2rem",

        "& img": {
            height: "5rem",
            width: "auto",
            verticalAlign: "middle",
            marginLeft: "1rem",
            marginRight: "1rem",
        },

        "& p": {
            margin: "0.3rem"
        }
    }
}

interface LandingPageProps extends WithStyles<typeof styles>, RouteComponentProps {}

type RouterStateType = {
    landingMessage: string
}

function LandingPage(props: LandingPageProps) {
    const { state } = useLocation<RouterStateType>();
    const { classes } = props;
    return (
        <div className={classes.container}>
            <div className={classes.claim}>
                <p>
                    Find your songs from
                    <img src={spotifyLogo} alt="Spotify"/>
                </p>
                <p>
                    at
                    <img src={karafunLogo} alt="Karafun"/>
                </p>
            </div>
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