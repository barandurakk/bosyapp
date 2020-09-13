import React, { Component } from "react";
import Boslar from "../components/Boslar";
import { connect } from "react-redux";
import User from "../components/User";
import { getAllUsers, getBos, searchTag, searchUser } from "../redux/actions/dataActions";

//Metarial Stuff
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

export class search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  handleChange = (event, index) => {
    this.state.index === 0 ? this.setState({ index: 1 }) : this.setState({ index: 0 });
  };

  render() {
    const { resultTag, resultUser, loading } = this.props.data;
    const { auth } = this.props;

    let tagResultMarkup = loading ? (
      <p>Yükleniyor...</p>
    ) : resultTag.length > 0 ? (
      resultTag.map((bos) => <Boslar bos={bos} key={bos.bosId} />)
    ) : (
      <p>Böyle bir etiket yok :(</p>
    );

    let userResultMarkup = !auth ? (
      <p>Üye girişi yapmadan kullanıcı arayamazsınız</p>
    ) : loading ? (
      <p>Yükleniyor..</p>
    ) : resultUser.length <= 0 ? (
      <p>Böyle bir kullanıcı yok :(</p>
    ) : (
      resultUser.map((user) => <User user={user} key={user.handle} />)
    );

    return (
      <Grid container spacing={6}>
        <Grid item sm={12} xs={12}>
          {this.props.location.keywordProps !== undefined ? (
            <Typography variant="h4">
              {this.props.location.keywordProps.keyword} için sonuçlar
            </Typography>
          ) : (
            <Typography variant="h6"> Sonuç bulunamadı :(</Typography>
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

const mapStateToProps = (state) => ({
  data: state.data,
  auth: state.user.authenticated,
});

export default connect(mapStateToProps, { getAllUsers, getBos, searchTag, searchUser })(search);
