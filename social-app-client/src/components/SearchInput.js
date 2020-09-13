import React, { Fragment } from "react";
import { connect } from "react-redux";
import { searchTag, searchUser } from "../redux/actions/dataActions";
import { withRouter } from "react-router-dom";

//mui
import withStyles from "@material-ui/core/styles/withStyles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { Fab } from "@material-ui/core";

const styles = {
  searchIcon: {
    height: 30,
    width: 30,
    pointerEvents: "none",
  },
  searchIconWrapper: {
    position: "absolute",
    left: 0,
    height: 40,
    width: 40,
    backgroundColor: "rgb(255, 255, 255, 0.0)",
    "&:hover": {
      backgroundColor: "rgb(255, 255, 255, 0.1)",
    },
  },
  search: {
    position: "relative",
    borderRadius: 5,
    backgroundColor: "rgb(255, 255, 255, 0.15)",
    "&:hover": {
      backgroundColor: "rgb(255, 255, 255, 0.25)",
    },
    marginRight: 0,
    marginLeft: 25,
    width: "85%",
    color: "#fff",
  },
};

class SearchInput extends React.Component {
  state = {
    keyword: "",
    searchDisplay: "hide",
  };

  handleSearch = () => {
    let keyword = this.state.keyword;
    if (this.state.keyword.charAt(0) === "#" || this.state.keyword.charAt(0) === "@") {
      keyword = keyword.substr(1);
    }
    let location = {
      pathname: "/search",
      keywordProps: {
        keyword: keyword,
      },
    };
    this.props.searchTag(keyword);
    this.props.searchUser(keyword);
    this.props.history.push(location);
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      let keyword = this.state.keyword;
      if (this.state.keyword.charAt(0) === "#" || this.state.keyword.charAt(0) === "@") {
        keyword = keyword.substr(1);
      }
      let location = {
        pathname: "/search",
        keywordProps: {
          keyword: keyword,
        },
      };

      this.props.searchTag(keyword);
      this.props.searchUser(keyword);
      this.props.history.push(location);
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <div className={classes.searchWrapper}>
          <Fab onClick={this.handleSearch} className={classes.searchIconWrapper}>
            <SearchIcon className={classes.searchIcon} />
          </Fab>

          <InputBase
            className={classes.search}
            value={this.state.keyword}
            name="keyword"
            onChange={this.handleChange}
            onKeyDown={(event) => this.handleKeyDown(event)}
            placeholder="Etiket veya kişi arayın..."
          />
        </div>
      </Fragment>
    );
  }
}

export default connect(null, { searchTag, searchUser })(
  withStyles(styles)(withRouter(SearchInput))
);
