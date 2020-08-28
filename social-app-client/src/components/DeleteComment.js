import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { deleteComment } from "../redux/actions/dataActions";

//mui
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "91%",
    top: "5%"
  }
};

class DeleteBos extends Component {
  state = {
    open: false
  };
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
  deleteBos = () => {
    this.props.deleteComment(this.props.commentId);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Tooltip title="Sil">
          <IconButton onClick={this.handleOpen} className={classes.deleteButton}>
            <DeleteIcon color="secondary" />
          </IconButton>
        </Tooltip>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Yorumunu Database'in tozlu sayfalarından siliyorsun.. <br /> Emin misin?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              İptal
            </Button>
            <Button onClick={this.deleteBos} color="secondary">
              Yep
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default connect(null, { deleteComment })(withStyles(styles)(DeleteBos));
