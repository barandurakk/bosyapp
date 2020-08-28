import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "../components/EditDetails.js";
import ProfileSkeleton from "../util/ProfileSkeleton";

//redux
import { connect } from "react-redux";
import { uploadImage, logoutUser } from "../redux/actions/userActions";

//mui
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import MaterialUiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";

//icons
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const styles = {
  paper: {
    padding: 15
  },
  profile: {
    "& .image-container": {
      textAlign: "center",
      position: "relative",
      "& .button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
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
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    },
    "& .logout-container": {
      textAlign: "right",
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "center"
    }
  },
  button: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
      color: "primary"
    }
  }
};

class Profile extends Component {
  onImageChange = event => {
    const imageInInput = event.target.files[0];
    const formData = new FormData();
    formData.append("picture", imageInInput, imageInInput.name);
    this.props.uploadImage(formData);
  };

  onEditImage = () => {
    const imageInput = document.getElementById("imageInput");
    imageInput.click();
  };

  onLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, website, bio, imageUrl, createdAt, role, nickname },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-container">
              <img src={imageUrl} alt="profileImage" className="profile-image" />
              <input type="file" id="imageInput" hidden="hidden" onChange={this.onImageChange} />
              <Tooltip title="Profil resmini güncelle" placement="top">
                <IconButton onClick={this.onEditImage} className="button">
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <hr />
            <div className="profile-detail">
              <MaterialUiLink component={Link} to={`/user/${handle}`} color="primary" variant="h5">
                {nickname ? nickname : handle}
              </MaterialUiLink>
              <hr />
              <MaterialUiLink
                component={Link}
                to={`/user/${handle}`}
                color="secondary"
                variant="body1"
              >
                @{handle}
              </MaterialUiLink>
              <hr />
              {role === "admin" ? <Chip color="primary" size="small" label="Admin" /> : null}
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
            <div className="logout-container">
              <Tooltip title="Çıkış Yap" placement="top">
                <IconButton onClick={this.onLogout}>
                  <ExitToAppIcon color="primary" />
                </IconButton>
              </Tooltip>
              <EditDetails />
            </div>
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body1" align="center">
            Profil falan bulamadık, giriş yapmayı dene :/
          </Typography>
          <div className={classes.button}>
            <Button variant="contained" color="primary" component={Link} to="/login">
              Giriş Yap
            </Button>
            <Button variant="contained" color="secondary" component={Link} to="/signup">
              Üye Ol
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ui: state.ui
});

export default connect(mapStateToProps, { uploadImage, logoutUser })(withStyles(styles)(Profile));
