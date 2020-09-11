import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { connect } from "react-redux";
import DeleteComment from "./DeleteComment";

//mui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

const styles = {
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%",
  },
  commentData: {
    marginLeft: 20,
  },
  invSeparatorShort: {
    border: "none",
    margin: 0,
  },
  invisSeparator: {
    border: "none",
  },
  Separator: {
    border: "solid .5px",
    width: "90%",
  },
  commentWrapper: {
    paddingLeft: 20,
    position: "relative",
  },
};

class Comments extends Component {
  render() {
    const {
      comments,
      classes,
      user: {
        authenticated,
        credentials: { handle, role },
      },
    } = this.props;
    return (
      <Grid container>
        {comments === undefined ? (
          <div>
            Yoruma erişilemiyor, lütfen pencereyi yenileyin(Minör bir bug, yakın zamanda
            düzelteceğim)
          </div>
        ) : (
          comments.map((comment, index) => {
            const { body, createdAt, userImage, userHandle, commentId, userNick } = comment;
            let deleteButton =
              authenticated && role === "admin" ? (
                <DeleteComment commentId={commentId} />
              ) : authenticated && userHandle === handle ? (
                <DeleteComment commentId={commentId} />
              ) : null;
            return (
              <Fragment key={createdAt}>
                <Grid item sm={12}>
                  <Grid container className={classes.commentWrapper}>
                    <Grid item sm={2}>
                      <img src={userImage} alt="comment" className={classes.commentImage} />
                    </Grid>
                    <Grid item sm={9}>
                      <div className={classes.commentData}>
                        <Typography
                          component={Link}
                          color="primary"
                          variant="h5"
                          to={`/user/${userHandle}`}
                        >
                          {userNick ? userNick : userHandle}{" "}
                          {userHandle === "admin" ? (
                            <Chip color="primary" size="small" label="Admin" />
                          ) : null}
                        </Typography>
                        <hr className={classes.invSeparatorShort} />
                        <Typography
                          variant="body1"
                          component={Link}
                          to={`/user/${userHandle}`}
                          color="secondary"
                        >
                          @{userHandle}{" "}
                        </Typography>
                        {deleteButton}
                        <Typography variant="body2" color="textSecondary">
                          {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                        </Typography>
                        <hr className={classes.invisSeparator} />
                        <Typography variant="body1">{body}</Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {index !== comments.length - 1 && <hr className={classes.Separator} />}
              </Fragment>
            );
          })
        )}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Comments));
