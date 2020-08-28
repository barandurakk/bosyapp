import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import DeleteBos from "./DeleteBos";
import EditBos from "./EditBos";

//mui
import IconButton from "@material-ui/core/IconButton";
import ToolTip from "@material-ui/core/ToolTip";
import Menu from "@material-ui/core/Menu";
import withStyles from "@material-ui/core/styles/withStyles";

//icons
import MoreIcon from "@material-ui/icons/MoreHoriz";

const styles = {
  moreButton: {
    position: "absolute",
    left: "90%",
    top: "5%"
  }
};

class BosDetailMenu extends Component {
  state = {
    open: false,
    anchorElement: null
  };

  handleClose = () => {
    this.setState({
      open: false,
      anchorElement: null
    });
  };
  handleOpen = event => {
    this.setState({
      open: true,
      anchorElement: event.target
    });
  };

  render() {
    const {
      bos: { bosId, userHandle, body },
      classes,
      user: {
        authenticated,
        credentials: { handle, role }
      }
    } = this.props;
    const anchorElement = this.state.anchorElement;

    const deleteButton =
      authenticated && role === "admin" ? (
        <DeleteBos bosId={bosId} />
      ) : authenticated && userHandle === handle ? (
        <DeleteBos bosId={bosId} />
      ) : null;

    const editButton =
      authenticated && userHandle === handle ? <EditBos bosId={bosId} bosBody={body} /> : null;

    const moreMenu = (
      <Menu
        id="customized-menu"
        open={this.state.open}
        onClose={this.handleClose}
        anchorEl={anchorElement}
      >
        <div>{editButton}</div>
        <div>{deleteButton}</div>
      </Menu>
    );

    return (
      <Fragment>
        <ToolTip title="Seçenekler" className={classes.moreButton}>
          <IconButton
            aria-owns={anchorElement ? "customized-menu" : undefined}
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={this.handleOpen}
          >
            <MoreIcon />
          </IconButton>
        </ToolTip>

        {moreMenu}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(BosDetailMenu));
