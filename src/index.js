import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux';

import { store, history } from './_helpers';

// import "assets/css/material-dashboard-react.css?v=1.2.0";
import indexRoutes from "_routes/index.jsx";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        {indexRoutes.map((prop, key) => {
          return <Route path={prop.path} component={prop.component} key={key} />;
        })}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);