import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles } from '@material-ui/core';

// import { Footer } from "_components";

import { history } from './_helpers';
import { alertActions, userActions } from './_actions';
import dashboardRoutes from "./_routes/dashboard";
import LoginPage from "./views/Login/Login.jsx";
// import appStyle from "./assets/jss/material-dashboard-react/appStyle.jsx";
import MenuAppBar from './_components/Appbar/Appbar';
import MiniDrawer from './_components/Drawer/Drawer';

// import Typography from '@material-ui/core/Typography';

import logo from "./assets/img/logo.png";

const styles = theme => ({
  root: {
    flexGrow: 1,
    // height: 430,
    zIndex: 1,
    overflow: 'visible',
    position: 'relative',
    display: 'flex',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 6,
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  }
});

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

class App extends React.Component {
  // state = {
  //   mobileOpen: false,
  //   auth: true,
  //   anchorEl: null,
  //   open: false,
  // };

  constructor(props) {
    super(props);

    this.state = {
      mobileOpen: false,
      auth: true,
      anchorEl: null,
      open: false,
      title: 'Admin'
    };
    
    let user = localStorage.getItem('user');
    if(user === null) {
      history.push('/login');
    }

    const { dispatch } = this.props;
    history.listen((location, action) => {
        // clear alert on location change
        dispatch(alertActions.clear());
    });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen, open: !this.state.open });
  };

  componentDidMount() {
    // if(navigator.platform.indexOf('Win') > -1){
    //   // eslint-disable-next-line
    //   const ps = new PerfectScrollbar(this.refs.mainPanel);
    // }
  }

  componentDidUpdate() {
    // this.refs.mainPanel.scrollTop = 0;
  }

  logout = () => {
    userActions.logout();
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      localStorage.getItem('user')
            ? <div className={classes.root}>
                <MenuAppBar 
                  auth={this.state.auth}
                  anchorEl={this.state.anchorEl}
                  open={this.state.open}
                  title={this.state.title}
                  logo={logo}
                  handleDrawerToggle={this.handleDrawerToggle}
                  logoutAction={this.logout}
                />
                <MiniDrawer 
                  routes={dashboardRoutes} 
                  open={this.state.open}
                  title={this.state.title}
                  logo={logo}
                  handleDrawerToggle={this.handleDrawerToggle}
                />
                {/* <Sidebar
                  routes={dashboardRoutes}
                  logo={logo}
                  handleDrawerToggle={this.handleDrawerToggle}
                  open={this.state.mobileOpen}
                  color="blue"
                  {...rest}
                /> */}
                {/* <main className={classes.content}> */}
                  {/* <div className={classes.toolbar} /> */}
                  {/* <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography> */}
                  <div className={classes.content}>
                    {/* <div className={classes.container}> */}
                      {/* <Paper className={classes.paper}> */}
                      {switchRoutes}
                      {/* </Paper> */}
                    {/* </div> */}
                  </div>
                  {/* <Footer /> */}
                {/* </main> */}
            </div>
            : <div className={classes.wrapper}>
              <Route path="/login" component={LoginPage} />
            </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { alert } = state;
  return {
      alert
  };
}

// export default withStyles(appStyle)(App);

const stylesApp = withStyles(styles)(App);

export default connect(mapStateToProps)(stylesApp);
// const connectedApp = connect(mapStateToProps)(stylesApp);
// export { connectedApp as App }; 