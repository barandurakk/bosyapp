import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "react-router-dom/Link";
import dayjs from "dayjs";

//mui
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = {
  userImage: {
    objectFit: "cover",
    width: 50,
    height: 50
  }
};

class UserList extends Component {
  render() {
    const {
      hideList,
      data: { loading },
      classes,
      users
    } = this.props;

    let listMarkup = loading ? (
      <p>Yükleniyor</p>
    ) : (
      users.map(user => {
        return (
          <ListItem key={user.handle}>
            <ListItemAvatar>
              <Avatar>
                <img src={`${user.imageUrl}`} alt="user" className={classes.userImage} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Link to={`/user/${user.handle}`}>{`@${user.handle}`}</Link>}
              secondary={`${user.email} - ${dayjs(user.createdAt).format("h:mm a, MMMM DD YYYY")}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })
    );

    return (
      <div className={`${hideList}`}>
        <List>{listMarkup}</List>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps)(withStyles(styles)(UserList));
