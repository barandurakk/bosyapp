import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { bosyap } from "../redux/actions/dataActions";

import "../App.css";

//mui
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogActions from "@material-ui/core/DialogActions";

//icon
import AddIcon from "@material-ui/icons/Add";

const styles = {};

class BosYap extends Component {
  state = {
    bos: "",
    open: false,
    errors: "",
    charCounter: 0,
    counterStyle: ""
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

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.bos === "") {
      this.setState({
        errors: "Boşunu boş yapmak komik değil :)"
      });
      this.handleOpen();
    } else if (this.state.bos.length > 200) {
      this.setState({
        errors: "Boş yap da 200 karakterden uzun yapma :)"
      });
      this.handleOpen();
    } else {
      const bosData = {
        body: this.state.bos
      };
      this.props.bosyap(bosData);
      this.handleClose();
      this.setState({ bos: "" });
    }
  };

  handleChange = event => {
    if (this.state.charCounter >= 200) {
      this.setState({
        charCounter: 200,
        counterStyle: "redCounter"
      });
    } else if (this.state.charCounter >= 100) {
      this.setState({
        charCounter: 0 + event.target.value.length,
        counterStyle: "yellowCounter"
      });
    } else {
      this.setState({
        charCounter: 0 + event.target.value.length,
        counterStyle: "greenCounter"
      });
    }

    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const {
      ui: { loading }
    } = this.props;
    return (
      <Fragment>
        <Tooltip title="Boş Yap!">
          <IconButton onClick={this.handleOpen}>
            <AddIcon color="primary" />
          </IconButton>
        </Tooltip>

        <Dialog open={this.state.open} fullWidth size="sm">
          <DialogTitle>Boş yap!</DialogTitle>
          <DialogContent>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows="3"
                value={this.state.bos}
                helperText={this.state.errors}
                error={this.state.errors ? true : false}
                name="bos"
                id="bos"
                label="Boş yapma alanı"
                placeholder="Bom boş..."
                variant="outlined"
                onChange={this.handleChange}
              />
              <span className={`${this.state.counterStyle}`}>
                Karakter Sınırı (200 / {this.state.charCounter})
              </span>
              <DialogActions>
                <Button color="primary" onClick={this.handleClose}>
                  İptal
                </Button>
                <Button color="secondary" type="submit" disabled={loading}>
                  Boş yap!
                  {loading && <CircularProgress color="primary" size={30} />}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps, { bosyap })(withStyles(styles)(BosYap));
