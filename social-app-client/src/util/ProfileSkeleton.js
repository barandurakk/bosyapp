import React from "react";
import NoImg from "../images/no-img.jpg";

//mui
import Paper from "@material-ui/core/Paper";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  paper: {
    padding: 15
  },
  profile: {
    "& .image-container": {
      textAlign: "center",
      position: "relative"
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      borderRadius: "50%",
      objectFit: "cover",
      maxWidth: "100%"
    },
    "& .profile-detail": {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      "& svg": {
        verticalAlign: "middle"
      },
      "& span": {
        fontSize: "14px",
        verticalAlign: "middle"
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    }
  },
  handle: {
    height: 15,
    backgroundColor: "#673ab7",
    width: 60,
    margin: "0, auto, 8px, auto",
    justifyContent: "center"
  },
  fullLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0, .3)",
    width: "100%",
    marginBottom: 10,
    justifyContent: "center"
  },
  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0, .3)",
    width: "50%",
    marginBottom: 10,
    justifyContent: "center"
  }
};

const ProfileSkeleton = props => {
  const { classes } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-container">
          <img src={NoImg} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-detail">
          <div className={classes.handle}></div>
          <hr />
          <div className={classes.fullLine} />
          <hr />
          <div className={classes.halfLine} />
          <hr />
          <div className={classes.halfLine} />
          <hr />
          <div className={classes.halfLine} />
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(ProfileSkeleton);
