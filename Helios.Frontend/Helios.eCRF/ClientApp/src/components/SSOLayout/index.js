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
import UiSessionTimeoutComp from '../Common/UiSessionTimeoutComp/UiSessionTimeoutComp';
import Header from "./Header";


class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        };
    }

    capitalizeFirstLetter = string => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };

    componentDidMount() {
        window.scrollTo(0, 0);

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

    render() {
        return (
            <React.Fragment>
                <div id="layout-wrapper">
                    <Header />
                    <div className="sso-main-content">{this.props.children}</div>
                </div>
                <UiSessionTimeoutComp />
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
