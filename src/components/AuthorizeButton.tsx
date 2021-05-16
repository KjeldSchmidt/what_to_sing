import {WithStyles, withStyles} from "@material-ui/core";
import React from "react";
import colors from "../theme/colors";

const styles = {
    button: {
        border: "1px solid black",
        background: colors.objectBackground,
        color: colors.textColor,
        fontSize: "2rem",
        borderRadius: 3,
        padding: "1rem",
        "&:hover": {
            background: colors.objectHoverColor,
        }
    }
}

type AuthorizeButtonProps = WithStyles<typeof styles>;

class AuthorizeButton extends React.Component<AuthorizeButtonProps> {
    authorize_button() {
        window.location.assign(
            "https://accounts.spotify.com/authorize?" +
            `client_id=${encodeURIComponent("a1d12ab8319041b4a34966a7dc86c021")}&` +
            "response_type=token&" +
            `redirect_uri=${encodeURIComponent("http://localhost:3000/authorisation_callback")}&` +
            `scope=${encodeURIComponent("user-library-read playlist-read-private playlist-read-collaborative user-top-read")}`

        );
    }

    render() {
        const { classes } = this.props;
        return (
            <button className={classes.button} onClick={this.authorize_button}>
                Find songs now!
            </button>
        )
    }
}

export default withStyles(styles)(AuthorizeButton);