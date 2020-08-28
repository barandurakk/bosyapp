import React, { Component, Fragment } from "react";
import Link from "react-router-dom/Link";
import { likeBos, unlikeBos } from "../redux/actions/dataActions";
import { connect } from "react-redux";

//Metarial Stuff
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

//icons
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

class LikeButton extends Component {
  likedBos = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.bosId === this.props.bosId)
    )
      return true;
    else return false;
  };
  likeBos = () => {
    this.props.likeBos(this.props.bosId);
  };
  unlikeBos = () => {
    this.props.unlikeBos(this.props.bosId);
  };

  render() {
    const {
      user: { authenticated }
    } = this.props;

    return (
      <Fragment>
        {!authenticated ? (
          <Tooltip title="Beğen">
            <IconButton>
              <Link to="/login">
                <FavoriteBorder color="secondary" />
              </Link>
            </IconButton>
          </Tooltip>
        ) : this.likedBos() ? (
          <Tooltip title="Beğenme">
            <IconButton onClick={this.unlikeBos}>
              <FavoriteIcon color="secondary" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Beğen">
            <IconButton onClick={this.likeBos}>
              <FavoriteBorder color="secondary" />
            </IconButton>
          </Tooltip>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { likeBos, unlikeBos })(LikeButton);
