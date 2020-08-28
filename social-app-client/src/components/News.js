import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

//mui
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const styles = {
  itemText: {
    fontSize: 15
  },
  headerText: {
    fontSize: 15,
    marginBottom: 15
  }
};

class News extends Component {
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

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Button
          className={classes.headerText}
          onClick={this.handleOpen}
          variant="contained"
          color="primary"
        >
          Yenilikler!
        </Button>

        <Dialog open={this.state.open} fullWidth maxWidth="sm">
          <DialogTitle>Yenilikler ve Düzeltmeler</DialogTitle>
          <DialogContent>
            <ul className={classes.itemText}>
              <li>Boşlardaki resimler düzeldi</li>
              <li>Kişi ve etiket arama eklendi</li>
              <li>Boşyap kısmında önceki boşun kalması düzeldi</li>
              <li>Nickname eklendi</li>
              <li>Oturumun açık durma süresi uzatıldı</li>
              <p>Sorunlarınızı bildirmeyin: barandurak07@gmail.com </p>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={this.handleClose}>
              Tamam
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(News);
