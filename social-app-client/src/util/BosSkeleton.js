import React, { Fragment } from "react";
import NoImg from "../images/no-img.jpg";

//mui
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25
  },
  cover: {
    minWidth: 163,
    height: 163,
    objectFit: "cover",
    borderRadius: "50%"
  },
  userName: {
    width: 60,
    height: 20,
    backgroundColor: "#673AB7",
    marginBottom: 7
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0, .2)",
    marginBottom: 10
  },
  fullLine: {
    height: 12,
    width: "90%",
    marginBottom: 10,
    backgroundColor: "rgba(0,0,0, .2)"
  },
  halfLine: {
    height: 12,
    width: "50%",
    marginBottom: 5,
    backgroundColor: "rgba(0,0,0, .2)"
  }
};

const BosSkeleton = props => {
  const { classes } = props;

  return (
    <Fragment>
      {Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
          <CardMedia className={classes.cover} image={NoImg} />
          <CardContent className={classes.cardContent}>
            <div className={classes.userName} />
            <div className={classes.date} />
            <div className={classes.fullLine} />
            <div className={classes.fullLine} />
            <div className={classes.halfLine} />
          </CardContent>
        </Card>
      ))}
    </Fragment>
  );
};

export default withStyles(styles)(BosSkeleton);
