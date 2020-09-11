import React, { Component } from "react";
import Boslar from "../components/Boslar";
import Profile from "../components/Profile";
import { connect } from "react-redux";
import { getBatchBos } from "../redux/actions/dataActions";
import BosSkeleton from "../util/BosSkeleton";
import News from "../components/News";
import "../App.css";

//Metarial Stuff
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";

export class home extends Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    let bosFilter = {
      lastVisible: "",
      limitAt: 10,
    };

    this.props.getBatchBos(bosFilter);
  }

  handleMoreButton = (lastVisible) => {
    let bosFilter = {
      lastVisible,
      limitAt: 10,
    };

    this.props.getBatchBos(bosFilter);
  };

  render() {
    const { boslar, loading, lastVisible } = this.props.data;

    let recentBosMarkup = !loading ? boslar.map((bos) => <Boslar bos={bos} />) : <BosSkeleton />;

    return (
      <Grid container spacing={6}>
        <Grid item sm={4} xs={12}>
          <News />
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentBosMarkup}
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => this.handleMoreButton(lastVisible)}
          >
            Yükle
          </Button>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getBatchBos })(home);
