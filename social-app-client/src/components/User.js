import React, { Component } from "react";
import Link from "react-router-dom/Link";

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
    position: "relative",
  },
  image: {
    objectFit: "cover",
    borderRadius: "50%",
    width: "100%",
    height: "100%",
  },
  imageWrapper: {
    minWidth: 100,
    height: 100,
  },
  content: {
    display: "flex",
    padding: 15,
    objectFit: "cover",
    flexDirection: "column",
  },
  likeTitle: {
    marginRight: 10,
  },
};

class User extends Component {
  render() {
    const { user, classes } = this.props;

    return (
      <Card className={classes.card}>
        <div className={classes.imageWrapper}>
          <CardMedia image={user.imageUrl} title="Profil Resmi" className={classes.image} />
        </div>
        <CardContent className={classes.content}>
          <Typography component={Link} color="primary" variant="h5" to={`/user/${user.handle}`}>
            {user.nickname ? user.nickname : user.handle}{" "}
          </Typography>
          <Typography
            variant="body1"
            color="secondary"
            component={Link}
            to={`/user/${user.handle}`}
          >
            @{user.handle}{" "}
            {user.handle === "admin" ? <Chip color="primary" size="small" label="Admin" /> : null}
          </Typography>
          <Typography variant="body1">{user.bio}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(User);
