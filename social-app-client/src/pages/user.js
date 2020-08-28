import React, { Component } from "react";
import axios from "axios";
import Boslar from "../components/Boslar";
import StaticProfile from "../components/StaticProfile";
import ProfileSkeleton from "../util/ProfileSkeleton";
import BosSkeleton from "../util/BosSkeleton";
//mui
import Grid from "@material-ui/core/Grid";

import { connect } from "react-redux";
import { getUserPageData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    bosIdParam: null
  };

  UNSAFE_componentWillMount() {
    const handle = this.props.match.params.handle;
    const bosId = this.props.match.params.bosId;

    if (bosId) this.setState({ bosIdParam: bosId });

    this.props.getUserPageData(handle);
    axios
      .get(`/user/${handle}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { boslar, loading } = this.props.data;
    const { bosIdParam } = this.state;

    const boslarMarkup = loading ? (
      <BosSkeleton />
    ) : boslar === null ? (
      <p>Boş yapmamış :(</p>
    ) : !bosIdParam ? (
      boslar.map(bos => <Boslar key={bos.bosId} bos={bos} />)
    ) : (
      boslar.map(bos => {
        if (bos.bosId !== bosIdParam) {
          return <Boslar key={bos.bosId} bos={bos} />;
        } else {
          return <Boslar key={bos.bosId} bos={bos} openDialog />;
        }
      })
    );

    return (
      <Grid container spacing={6}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {boslarMarkup}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserPageData })(user);
