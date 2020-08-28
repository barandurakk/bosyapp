import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { sendForgotPass } from "../redux/actions/userActions";

//mui
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AutorenewIcon from "@material-ui/icons/Autorenew";

const styles = {
  forgotButton: {
    cursor: "pointer",
    color: "#331d5b"
  },
  sendButton: {
    position: "relative",
    marginBottom: 10
  },
  closeButton: {
    marginBottom: 10
  },
  loadingCircle: {
    position: "absolute"
  },
  reSendButton: {
    cursor: "pointer",
    color: "#331d5b",
    fontWeight: 600
  },
  reIcon: {
    fontSize: 13
  }
};

class ForgotPass extends Component {
  state = {
    open: false,
    errors: {},
    email: "",
    sended: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
    if (nextProps.sended) {
      this.setState({ sended: nextProps.sended });
    }
  }

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    let email = {
      email: this.state.email
    };
    this.props.sendForgotPass(email);
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes, loading, sended } = this.props;
    return (
      <Fragment>
        <Typography variant="caption">
          <span onClick={this.handleOpen} className={classes.forgotButton}>
            Şifremi Unuttum
          </span>
        </Typography>

        <Dialog open={this.state.open} fullWidth maxWidth="sm">
          <DialogTitle>Kayıtlı Email'ınızı girin.</DialogTitle>

          <DialogContent>
            {sended ? (
              <div>
                <p>Email başarıyla yollandı. Spam kutunuza bakmayı unutmayın</p>
                <span className={classes.reSendButton} onClick={this.handleSubmit}>
                  Tekrar gönder <AutorenewIcon className={classes.reIcon} />
                </span>
              </div>
            ) : (
              <TextField
                value={this.state.email}
                name="email"
                id="emailInput"
                onChange={this.onChange}
                helperText={this.state.errors.forgotEmail}
                error={this.state.errors.forgotEmail ? true : false}
                label="Email"
                variant="outlined"
                fullWidth
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              variant="contained"
              color="primary"
              className={classes.closeButton}
            >
              Kapat
            </Button>
            {sended ? null : (
              <Button
                onClick={this.handleSubmit}
                variant="contained"
                color="secondary"
                disabled={loading}
                className={classes.sendButton}
              >
                Gönder
              </Button>
            )}
            {loading ? <CircularProgress color="primary" size={30} /> : null}
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { ui: state.ui, loading: state.ui.loading, sended: state.ui.sended };
};

export default connect(mapStateToProps, { sendForgotPass })(withStyles(styles)(ForgotPass));
