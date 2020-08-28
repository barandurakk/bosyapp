import React, { Component } from "react";
import { Link } from "react-router-dom";
import ForgotPass from "../components/ForgotPass";

//Metarial Stuff
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const style = {
  form: {
    textAlign: "center"
  },
  formTitle: {
    margin: "30px auto 20px auto"
  },
  textField: {
    marginBottom: 10
  },
  button: {
    margin: "10px auto",
    position: "relative"
  },
  generalError: {
    color: "red",
    fontSize: 12
  },
  progress: {
    position: "absolute"
  }
};

export class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  render() {
    const {
      classes,
      ui: { loading }
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <Typography variant="h2" className={classes.formTitle}>
            Giriş
          </Typography>
          <form noValidate onSubmit={this.onSubmit}>
            <TextField
              type="email"
              name="email"
              id="email"
              label="Email"
              helperText={errors.email}
              error={errors.email ? true : false}
              onChange={this.onChange}
              value={this.state.email}
              className={classes.textField}
              fullWidth
            />

            <TextField
              type="password"
              name="password"
              id="password"
              label="Şifre"
              helperText={errors.password}
              error={errors.password ? true : false}
              onChange={this.onChange}
              value={this.state.password}
              className={classes.textField}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.generalError}>
                {errors.general}
              </Typography>
            )}

            <Button
              variant="contained"
              type="submit"
              color="secondary"
              className={classes.button}
              disabled={loading}
            >
              Giriş
              {loading && (
                <CircularProgress color="primary" size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <ForgotPass />
            <br />
            <Typography variant="caption">
              Hesabın yok mu? <Link to="/signup">Buradan</Link> üye ol!
            </Typography>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ui: state.ui
});

export default connect(mapStateToProps, { loginUser })(withStyles(style)(login));
