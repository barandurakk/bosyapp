import React, { Component } from "react";
import Boslar from "../components/Boslar";
import Profile from "../components/Profile";
import { connect } from "react-redux";
import { getBos } from "../redux/actions/dataActions";
import BosSkeleton from "../util/BosSkeleton";
import News from "../components/News";
import "../App.css";

//Metarial Stuff
import Grid from "@material-ui/core/Grid";

export class home extends Component {
  UNSAFE_componentWillMount() {
    this.props.getBos();
  }

  render() {
    const { boslar, loading } = this.props.data;

    let recentBosMarkup = !loading ? (
      boslar.map(bos => <Boslar bos={bos} key={bos.bosId} />)
    ) : (
      <BosSkeleton />
    );

    return (
      <Grid container spacing={6}>
        <Grid item sm={4} xs={12}>
          <News />
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentBosMarkup}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getBos })(home);
