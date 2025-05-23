import PropTypes from 'prop-types';
import React, { Component } from "react";

import { connect } from "react-redux";
import withRouter from '../../components/Common/withRouter';
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Rightbar from "../CommonForBoth/Rightbar";
import UiSessionTimeoutComp from '../Common/UiSessionTimeoutComp/UiSessionTimeoutComp';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
    this.hideRightbar = this.hideRightbar.bind(this);
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

    componentDidMount() {

    // Scroll Top to 0
    window.scrollTo(0, 0);
    // let currentage = this.capitalizeFirstLetter(this.props.location.pathname)

    document.body.addEventListener("click", this.hideRightbar, true);

    // document.title =
    //   currentage + " | Veltrix - React Admin & Dashboard Template"
    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }

    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }

    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
  }
    toggleMenuCallback = () => {
    if (this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile);
    } else if (this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile);
    }
  };

  hideRightbar = (event) => {
    var rightbar = document.getElementById("right-bar");
    //if clicked in inside right bar, then do nothing
    if (rightbar && rightbar.contains(event.target)) {
      return;
    } else {
      if (document.body.classList.contains('right-bar-enabled')) {
        this.props.showRightSidebarAction(false);
      }
    }
  };

    render() {
        return (
            <React.Fragment>
                <div id="layout-wrapper">
                    <Header pageType={this.props.pageType} toggleMenuCallback={this.toggleMenuCallback} />
                    <Sidebar
                    theme={this.props.leftSideBarTheme}
                    type={this.props.leftSideBarType}
                    isMobile={this.state.isMobile}
                    pageType={this.props.pageType}
                    />
                    <div className="main-content">{this.props.children}</div>
                    <Footer />
                </div>
                <UiSessionTimeoutComp />
                {this.props.showRightSidebar ? <Rightbar /> : null}
            </React.Fragment>
        );
    }
}

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any
};

const mapStatetoProps = state => {
    return {
    ...state.Layout,
  };
};
export default connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
})(withRouter(Layout));
