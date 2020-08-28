import React, { Component, Fragment } from "react";
import Link from "react-router-dom/Link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { connect } from "react-redux";
import { markNotifications } from "../redux/actions/userActions";

//Metarial Stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

//icons
import NotificationIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

export class Notifications extends Component {
  state = {
    anchorElement: null
  };

  handleOpen = event => {
    this.setState({
      anchorElement: event.target
    });
  };

  handleClose = () => {
    this.setState({
      anchorElement: null
    });
  };

  onMenuOpened = () => {
    let unreadNotificationIds = this.props.notifications
      .filter(not => !not.read)
      .map(not => not.notificationId);
    this.props.markNotifications(unreadNotificationIds);
  };

  render() {
    const { notifications } = this.props;
    const anchorElement = this.state.anchorElement;

    dayjs.extend(relativeTime);

    let notificationIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter(noti => noti.read === false).length > 0
        ? (notificationIcon = (
            <Badge
              badgeContent={notifications.filter(noti => noti.read === false).length}
              color="secondary"
            >
              <NotificationIcon />
            </Badge>
          ))
        : (notificationIcon = <NotificationIcon />);
    } else {
      notificationIcon = <NotificationIcon />;
    }

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(not => {
          const kelime = not.type === "like" ? "boşunu beğendi" : "boşuna yorum yaptı";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? "primary" : "secondary";
          const icon =
            not.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="textSecondary"
                variant="body1"
                to={`/user/${not.recipient}/bos/${not.bosId}`}
              >
                {not.sender} {time} senin {kelime}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>Henüz bir bildirim yok :/</MenuItem>
      );

    return (
      <Fragment>
        <Tooltip placement="top" title="Bildirimler">
          <IconButton
            aria-owns={anchorElement ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorElement}
          open={Boolean(anchorElement)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotifications })(Notifications);
