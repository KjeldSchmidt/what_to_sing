import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import UserSongPage from './pages/UserSongPage';
import {Button, createMuiTheme, CssBaseline, MuiThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        background: {
            default: "#34343A"
        },
        text: {
            primary: "#DDDDDD"
        }
    }
})

class App extends React.Component {
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
            <div className="App">
                <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Switch>
                        <Route path="/authorisation_callback">
                            <UserSongPage/>
                        </Route>
                        <Route path="/">
                            <Button onClick={this.authorize_button}>
                                Find songs now!
                            </Button>
                        </Route>
                    </Switch>
                </Router>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
