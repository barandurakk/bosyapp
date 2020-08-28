import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { editBos } from "../redux/actions/dataActions";
import "../App.css";

//mui
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

//icons
import EditIcon from "@material-ui/icons/Edit";

const styles = {
  itemText: {
    fontSize: 15
  }
};

class EditBos extends Component {
  state = {
    open: false,
    newBos: this.props.bosBody,
    errors: {},
    charCounter: 0,
    counterStyle: "greenCounter"
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
  }

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
    const bosBody = {
      body: this.state.newBos
    };

    if (this.state.newBos.length > 200) {
      this.setState({
        errors: {
          editBos: "Boş 200 kelimeden fazla olamaz :/"
        }
      });
    } else {
      this.props.editBos(this.props.bosId, bosBody);
      if (this.state.errors !== {}) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  };
  render() {
    const {
      classes,
      ui: { loading }
    } = this.props;

    return (
      <Fragment>
        <MenuItem onClick={this.handleOpen}>
          <ListItemIcon>
            <IconButton>
              <EditIcon color="secondary" className={classes.itemText} />
            </IconButton>
          </ListItemIcon>
          <Typography className={classes.itemText}>Düzenle</Typography>
        </MenuItem>

        <Dialog open={this.state.open} fullWidth maxWidth="sm">
          <DialogTitle>Boş'unu Değiştir</DialogTitle>
          <DialogContent>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows="3"
                value={this.state.newBos}
                helperText={this.state.errors.editBos}
                error={this.state.errors.editBos ? true : false}
                name="newBos"
                id="updateBos"
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
                  Güncelle
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

const mapStateToProps = state => {
  return {
    ui: state.ui
  };
};

export default connect(mapStateToProps, { editBos })(withStyles(styles)(EditBos));
