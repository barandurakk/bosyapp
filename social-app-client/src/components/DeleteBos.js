import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { deleteBos } from "../redux/actions/dataActions";

//mui
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";

const styles = {
  itemText: {
    fontSize: 15
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
    this.props.deleteBos(this.props.bosId);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MenuItem onClick={this.handleOpen}>
          <ListItemIcon>
            <IconButton>
              <DeleteIcon style={{ color: "#ff0000" }} className={classes.itemText} />
            </IconButton>
          </ListItemIcon>
          <Typography className={classes.itemText}>Sil</Typography>
        </MenuItem>

        <Dialog open={this.state.open} fullWidth maxWidth="sm">
          <DialogTitle>
            Boşunu Database'in tozlu sayfalarından siliyorsun.. <br /> Emin misin?
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

export default connect(null, { deleteBos })(withStyles(styles)(DeleteBos));
