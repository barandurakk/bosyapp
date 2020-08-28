import React, { Fragment } from "react";
import { connect } from "react-redux";
import { searchTag, searchUser, getBos, getAllUsers } from "../redux/actions/dataActions";
import Link from "react-router-dom/Link";

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
    this.props.searchTag(keyword);
    this.props.searchUser(keyword);
    this.setState({ keyword: "" });
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
          <Link
            to={{
              pathname: "/search",
              keywordProps: {
                keyword: this.state.keyword,
              },
            }}
          >
            <Fab onClick={this.handleSearch} className={classes.searchIconWrapper}>
              <SearchIcon className={classes.searchIcon} />
            </Fab>
          </Link>
          <InputBase
            className={classes.search}
            value={this.state.keyword}
            name="keyword"
            onChange={this.handleChange}
            placeholder="Etiket veya kişi arayın..."
          />
        </div>
      </Fragment>
    );
  }
}

export default connect(null, { searchTag, searchUser, getBos, getAllUsers })(
  withStyles(styles)(SearchInput)
);
