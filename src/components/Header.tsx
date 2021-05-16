import {ReactElement} from "react";
import logo from '../assets/logo.png';
import {withStyles, WithStyles} from "@material-ui/core";
import colors from "../theme/colors";
import {Link} from "react-router-dom";

type HeaderProps = WithStyles<typeof styles>;
const styles = {
    root: {
        padding: "0.5rem 1rem",
        borderBottom: "1px solid black",
        background: colors.objectBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        height: 48
    },
    link: {
        color: colors.textColor,
        textDecoration: "none",

        "&:hover": {
            textDecoration: "underline"
        }
    }
}


function Header(props: HeaderProps) : ReactElement{
    const { classes } = props;
    return (
        <header className={classes.root}>
            <Link className={classes.link} to="/">
                <img className={classes.logo} src={logo} />
            </Link>
            <Link className={classes.link} to="/">
                Home
            </Link>
        </header>
    )
}

export default withStyles(styles)(Header);