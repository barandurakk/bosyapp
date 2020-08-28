import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

//mui
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MaterialUiLink from "@material-ui/core/Link";
import Chip from "@material-ui/core/Chip";

//icon
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

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
    },
    "& .logout-container": {
      textAlign: "right",
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "center"
    }
  }
};

const StaticProfile = props => {
  const {
    classes,
    profile: { handle, createdAt, imageUrl, bio, website, nickname }
  } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-container">
          <img src={imageUrl} alt="profileImage" className="profile-image" />
        </div>
        <hr />
        <div className="profile-detail">
          <MaterialUiLink component={Link} to={`/user/${handle}`} color="primary" variant="h5">
            {nickname ? nickname : handle}
          </MaterialUiLink>
          <hr />
          <MaterialUiLink component={Link} to={`/user/${handle}`} color="secondary" variant="body1">
            @{handle}
          </MaterialUiLink>
          <hr />
          {handle === "admin" ? <Chip color="primary" size="small" label="Admin" /> : null}
          <hr />
          {bio && <Typography variant="body2">{bio}</Typography>}
          <hr />
          {website && (
            <Fragment>
              <LinkIcon color="primary" />
              <a href={website} target="_blank" rel="noopener noreferrer">
                {" "}
                {website}
              </a>
              <hr />
            </Fragment>
          )}
          <CalendarToday color="primary" />{" "}
          <span>{dayjs(createdAt).format("MMM YYYY")} 'de boş yapmaya başladı.</span>
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(StaticProfile);
