import PropTypes from 'prop-types';
import React, { useEffect } from "react";
import withRouter from '../../components/Common/withRouter';

import { logoutuser } from "../../store/actions";
//redux
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { onLogout } from '../../helpers/Auth/useAuth';

const Logout = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
      dispatch(logoutuser());
      onLogout(navigate);
  }, [dispatch,navigate]);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object
};


export default withRouter(Logout);
