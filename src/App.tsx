import React, {ReactElement} from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserSongPage from './pages/UserSongPage';
import {createMuiTheme, CssBaseline, MuiThemeProvider} from '@material-ui/core';
import LandingPage from "./pages/LandingPage";

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
    render() : ReactElement {
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
                            <LandingPage />
                        </Route>
                    </Switch>
                </Router>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
