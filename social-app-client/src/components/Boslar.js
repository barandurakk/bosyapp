import React, { Component } from "react";
import Link from "react-router-dom/Link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { likeBos, unlikeBos } from "../redux/actions/dataActions";
import { connect } from "react-redux";
import BosDialog from "./BosDialog";
import LikeButton from "./LikeButton";
import BosDetailMenu from "./BosDetailMenu";

//Metarial Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
    position: "relative"
  },
  invSeparatorShort: {
    border: "none",
    margin: 1
  },
  image: {
    objectFit: "cover",
    borderRadius: "50%",
    width: "100%",
    height: "100%"
  },
  imageWrapper: {
    minWidth: 100,
    height: 100
  },
  content: {
    padding: 15,
    objectFit: "cover"
  },
  likeTitle: {
    marginRight: 10
  }
};

class Boslar extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      bos,
      user: {
        authenticated,
        credentials: { handle, role }
      }
    } = this.props;
    const { classes } = this.props;
    const detailMenu =
      authenticated && role === "admin" ? (
        <BosDetailMenu bos={bos} />
      ) : authenticated && bos.userHandle === handle ? (
        <BosDetailMenu bos={bos} />
      ) : null;

    return (
      <Card className={classes.card}>
        <div className={classes.imageWrapper}>
          <CardMedia image={bos.userImage} title="Profil Resmi" className={classes.image} />
        </div>
        <CardContent className={classes.content}>
          <Typography component={Link} color="primary" variant="h5" to={`/user/${bos.userHandle}`}>
            {bos.userNick ? bos.userNick : bos.userHandle}{" "}
            {bos.userHandle === "admin" ? (
              <Chip color="primary" size="small" label="Admin" />
            ) : null}
          </Typography>
          <hr className={classes.invSeparatorShort} />
          <Typography
            variant="body1"
            color="secondary"
            component={Link}
            to={`/user/${bos.userHandle}`}
          >
            @{bos.userHandle}
          </Typography>
          {detailMenu}
          <Typography variant="body2" color="textSecondary">
            {dayjs(bos.createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{bos.body}</Typography>
          <LikeButton bosId={bos.bosId} />
          <span className={classes.likeTitle}>{bos.likeCount} Beğeni</span>
          <BosDialog
            bosId={bos.bosId}
            userHandle={bos.userHandle}
            openDialog={this.props.openDialog}
            chatIcon={true}
          />
          <span>{bos.commentCount} yorum</span>
          <BosDialog
            bosId={bos.bosId}
            userHandle={bos.userHandle}
            openDialog={this.props.openDialog}
            chatIcon={false}
          />
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { likeBos, unlikeBos })(withStyles(styles)(Boslar));
