import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../Common/withRouter";

// users
import user1 from "../../../assets/images/users/user-4.jpg";

const ProfileMenu = props => {
    // Declare a new state variable, which we'll call "menu"
    const [menu, setMenu] = useState(false);
    const [username, setusername] = useState("Admin");

    const roletatu = props.roles.length > 0 ? props.roles.includes('TenantAdmin') : false;

    //profile resim ayarlarý
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 45;
    canvas.height = 45;
    // Arka plan rengini ve metni stilize et
    context.fillStyle = '#0089ff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(props.avatar, canvas.width / 2, canvas.height / 2);
    const dataURI = canvas.toDataURL();


    useEffect(() => {

        if (localStorage.getItem("authUser")) {
            if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
                const obj = JSON.parse(localStorage.getItem("authUser"));
                setusername(obj.displayName);
            } else if (
                process.env.REACT_APP_DEFAULTAUTH === "fake" ||
                process.env.REACT_APP_DEFAULTAUTH === "jwt"
            ) {
                const obj = JSON.parse(localStorage.getItem("authUser"));
                setusername(obj.username);
            }
        }
    }, [props.success]);

    return (
        <React.Fragment>
            <Dropdown
                isOpen={menu}
                toggle={() => setMenu(!menu)}
                className="d-inline-block"
            >
                <DropdownToggle
                    className="btn header-item waves-effect"
                    id="page-header-user-dropdown"
                    tag="button"
                >

                    <img src={dataURI} alt="Profile Avatar" style={{ borderRadius: '50%' }} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem tag="a" href="/profile">
                        {" "}
                        <i className="bx bx-user font-size-16 align-middle me-1" />
                        {props.t("Profile")}{" "}
                    </DropdownItem>
                    {
                        roletatu ?
                            <DropdownItem tag="a" href="/SSO-tenants-or-studies">
                                <i className="bx bx-user font-size-16 align-middle me-1" />
                                {props.t("Switch to tenant")}{" "}
                            </DropdownItem>
                            :
                            <DropdownItem tag="a" href="/SSO-tenants-or-studies">
                                <i className="bx bx-user font-size-16 align-middle me-1" />
                                {props.t("Switch to study")}{" "}
                            </DropdownItem>
                    }


                    <DropdownItem tag="a" href="ContactUs">
                        <i className="bx bx-lock-open font-size-16 align-middle me-1" />
                        {props.t("Contact us")}
                    </DropdownItem>
                    <div className="dropdown-divider" />
                    <Link to="/logout" className="dropdown-item">
                        <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
                        <span>{props.t("Logout")}</span>
                    </Link>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};


ProfileMenu.propTypes = {
    success: PropTypes.any,
    t: PropTypes.any
};

const mapStatetoProps = state => {
    const avatar = state.rootReducer.Login.name.charAt(0).toUpperCase() + state.rootReducer.Login.lastName.charAt(0).toUpperCase();
    const { error, success } = state.rootReducer.Profile;
    const roles = state.rootReducer.Login.roles;
    return { error, success, avatar, roles };
};

export default withRouter(
    connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
