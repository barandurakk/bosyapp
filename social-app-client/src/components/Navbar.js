import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import BosYap from "./BosYap";
import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import "../App.css";

//Metarial Ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

//icons
import HomeIcon from "@material-ui/icons/Home";

class Navbar extends Component {
  render() {
    const { authenticated, role } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {!authenticated ? (
            <Fragment>
              <SearchInput />
              <Button color="inherit" component={Link} to="/login">
                Giriş Yap
              </Button>
              <Button color="inherit" component={Link} to="/">
                Anasayfa
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Kayıt Ol
              </Button>
            </Fragment>
          ) : role === "admin" ? (
            <Fragment>
              <SearchInput />
              <BosYap />

              <Link to="/">
                <Tooltip title="Anasayfa">
                  <IconButton>
                    <HomeIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Link>

              <Notifications />

              <Button color="inherit" component={Link} to="/adminpanel">
                Admin Paneli
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <SearchInput />
              <BosYap />

              <Link to="/">
                <Tooltip title="Anasayfa">
                  <IconButton>
                    <HomeIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Link>

              <Notifications />
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  role: state.user.credentials.role,
});

export default connect(mapStateToProps)(Navbar);
