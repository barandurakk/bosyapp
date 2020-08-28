import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { submitComment } from "../redux/actions/dataActions";

//mui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const styles = {
  button: {
    marginTop: 15,
    marginBottom: 15
  }
};

class CommentForm extends Component {
  state = {
    body: "",
    errors: {}
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
    if (!nextProps.ui.errors && !nextProps.ui.loading) {
      this.setState({
        body: ""
      });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.submitComment(this.props.bosId, { body: this.state.body });
  };
  render() {
    const errors = this.state.errors;
    const { classes, authenticated } = this.props;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Yorum yaz"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
            variant="outlined"
            multiline
          />
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
            Gönder
          </Button>
        </form>
        <hr className={classes.Separator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));
