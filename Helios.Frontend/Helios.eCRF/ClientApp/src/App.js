import PropTypes from 'prop-types'
import React from "react"
import "./assets/css/icons.css"
import "./components/Common/ModalComp/ModalComp.css"

// Import scss
import "./assets/scss/new-theme.scss"

import { Routes, Route } from 'react-router-dom'
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import NonAuthLayout from "./components/NonAuthLayout"

import NotFound from './Pages/Common/NotFound/NotFound'
import AccessDeniend from './Pages/Common/AccessDenied/AccessDenied'
import ContactUs from './Pages/Common/ContactUs/ContactUs'
import UnderConstruction from './Pages/Common/UnderConstruction/UnderConstruction'
import "./Icon.js";

const App = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <NonAuthLayout>
                  {route.component}
                </NonAuthLayout>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {userRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                  <Authmiddleware path={ route.path } element={route.component} roles={route.roles} />
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>

         <Route path="/ContactUs" element={<ContactUs />} />
         <Route path="/AccessDenied" element={<AccessDeniend />} />
         <Route path="/UnderConstruction" element={<UnderConstruction />} />
         <Route path="*" element={<NotFound />} />

      </Routes>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
