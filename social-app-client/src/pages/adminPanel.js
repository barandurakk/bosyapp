import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "../App.css";
import UserList from "../components/UserList";

//mui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

class AdminPanel extends Component {
  state = {
    userListStyle: "hidden"
  };

  UNSAFE_componentWillMount() {
    const { history } = this.props;
    if (this.props.role !== "admin") {
      history.push("/");
    }
  }

  render() {
    const {
      role,
      authenticated,
      data: { users }
    } = this.props;
    const adminPageMarkup =
      authenticated && role === "admin" ? (
        <Fragment>
          <Grid container spacing={6}>
            <Grid item sm={4} xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.state.userListStyle === "hidden"
                    ? this.setState({ userListStyle: "show" })
                    : this.setState({ userListStyle: "hidden" });
                }}
              >
                Kullanıcı Listesi
              </Button>
            </Grid>
            <Grid item sm={8} xs={12}>
              <UserList hideList={this.state.userListStyle} users={users} />
            </Grid>
          </Grid>
        </Fragment>
      ) : (
        <p>Üzgünüm Yetkin Yok :(</p>
      );

    return adminPageMarkup;
  }
}

const mapStateToProps = state => ({
  role: state.user.credentials.role,
  authenticated: state.user.authenticated,
  data: state.data
});

export default connect(mapStateToProps)(AdminPanel);
