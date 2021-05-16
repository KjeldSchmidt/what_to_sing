import {Button, withStyles} from "@material-ui/core";
import React from "react";

const styles = {}

class AuthorizeButton extends React.Component {
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
        return (
            <Button onClick={this.authorize_button}>
                Find songs now!
            </Button>
        )
    }
}

export default withStyles(styles)(AuthorizeButton);