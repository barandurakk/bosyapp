import React, { Component } from "react";
import Boslar from "../components/Boslar";
import { connect } from "react-redux";
import User from "../components/User";
import { getAllUsers, getBos } from "../redux/actions/dataActions";

//Metarial Stuff
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

export class search extends Component {
  state = {
    index: 0
  };

  UNSAFE_componentWillMount() {
    this.props.getAllUsers();
    this.props.getBos();
  }

  handleChange = (event, index) => {
    this.state.index === 0 ? this.setState({ index: 1 }) : this.setState({ index: 0 });
  };

  render() {
    const { resultTag, resultUser } = this.props.data;

    let tagResultMarkup =
      resultTag.length > 0 ? (
        resultTag.map(bos => <Boslar bos={bos} key={bos.bosId} />)
      ) : (
        <p>Böyle bir etiket yok :(</p>
      );

    let userResultMarkup =
      resultUser.length > 0 ? (
        resultUser.map(user => <User user={user} key={user.handle} />)
      ) : (
        <p>Böyle bir kullanıcı yok :(</p>
      );

    return (
      <Grid container spacing={6}>
        <Grid item sm={12} xs={12}>
          {this.props.location.keywordProps !== undefined ? (
            <Typography variant="h4">
              {this.props.location.keywordProps.keyword} için sonuçlar
            </Typography>
          ) : (
            <Typography variant="h6">Sonuç bulunamadı :(</Typography>
          )}
          <Tabs
            value={this.state.index}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Etiketler" />
            <Tab label="Kişiler" />
          </Tabs>
          <br />
          {this.state.index === 0 ? tagResultMarkup : userResultMarkup}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getAllUsers, getBos })(search);
