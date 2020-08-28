import React, { Component, Fragment } from "react";

//mui
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";

//icons
import EditIcon from "@material-ui/icons/Edit";

//redux
import { editUserDetail } from "../redux/actions/userActions";
import { connect } from "react-redux";

const styles = {};

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    open: false,
    nickname: "",
  };

  userDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      nickname: credentials.nickname ? credentials.nickname : "",
    });
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
    this.userDetailsToState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    const userDetail = {
      bio: this.state.bio,
      website: this.state.website,
      nickname: this.state.nickname,
    };
    this.props.editUserDetail(userDetail);
    this.handleClose();
  };

  UNSAFE_componentDidMount() {
    const { credentials } = this.props;
    this.userDetailsToState(credentials);
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Tooltip title="Bilgileri Güncelle" placement="top">
          <IconButton onClick={this.handleOpen} className={classes.button}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Bilgilerinizi Güncelleyin</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="nickname"
                type="text"
                label="Nickname"
                placeholder="Herkesin görebileceği bir takma isim"
                className={classes.textField}
                value={this.state.nickname}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="bio"
                type="text"
                label="Bio (En fazla 200 karakter)"
                multiline
                rows="3"
                placeholder="Kendinle ilgili kısa bir yazı"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Kişisel websiten veya porfolio sayfan."
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              İptal
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetail })(withStyles(styles)(EditDetails));
