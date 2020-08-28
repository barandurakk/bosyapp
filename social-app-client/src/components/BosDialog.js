import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { getABos } from "../redux/actions/dataActions";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

//mui
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//icon
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

const styles = {
  invSeparator: {
    border: "none",
    margin: 4
  },
  invSeparatorShort: {
    border: "none",
    margin: 1
  },
  Separator: {
    border: "solid .5px",
    width: "90%",
    marginBottom: 20
  },
  profileImage: {
    maxWidth: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expandButton: {
    position: "absolute",
    left: "90%"
  },
  spinner: {
    textAlign: "center",
    marginTop: 50,
    marginButtom: 50
  }
};

class BosDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: ""
  };

  UNSAFE_componentWillMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;

    const { userHandle, bosId } = this.props;
    const newPath = `/user/${userHandle}/bos/${bosId}`;

    if (oldPath === newPath) oldPath = `/user/${userHandle}`;

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    this.props.getABos(this.props.bosId);
  };

  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
      bos: {
        bosId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments,
        userNick
      },
      ui: { loading }
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinner}>
        <CircularProgress size={150} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={4}>
        <Grid item sm={4}>
          <img src={userImage} alt="Profil" className={classes.profileImage} />
        </Grid>
        <Grid item sm={8}>
          <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
            {userNick ? userNick : userHandle}
          </Typography>
          <hr className={classes.invSeparatorShort} />
          <Typography
            component={Link}
            color="secondary"
            variant="body1"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invSeparator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton bosId={bosId} />
          <span>{likeCount} Beğeni</span>
          <Tooltip title="Yorumlar">
            <IconButton>
              <ChatIcon color="secondary" />
            </IconButton>
          </Tooltip>
          <span>{commentCount} yorum</span>
        </Grid>
        <hr className={classes.Separator} />
        <CommentForm bosId={bosId} />
        <Comments comments={comments} />
      </Grid>
    );
    if (this.props.chatIcon) {
      return (
        <Fragment>
          <Tooltip title="Yorumlar">
            <IconButton onClick={this.handleOpen} className={classes.chatIcon}>
              <ChatIcon color="secondary" />
            </IconButton>
          </Tooltip>
          <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
            <Tooltip title="Kapat">
              <IconButton onClick={this.handleClose} className={classes.closeButton}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <DialogContent className={classes.dialogContent}>{dialogMarkup}</DialogContent>
          </Dialog>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Tooltip title="Boşu genişlet">
            <IconButton onClick={this.handleOpen} className={classes.expandButton}>
              <UnfoldMore color="secondary" />
            </IconButton>
          </Tooltip>
          <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
            <Tooltip title="Kapat">
              <IconButton onClick={this.handleClose} className={classes.closeButton}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <DialogContent className={classes.dialogContent}>{dialogMarkup}</DialogContent>
          </Dialog>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  bos: state.data.bos,
  ui: state.ui
});

export default connect(mapStateToProps, { getABos })(withStyles(styles)(BosDialog));
