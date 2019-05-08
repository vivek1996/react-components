import React from 'react';
import { Link as RouterLink } from 'react-router-dom'

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { GulaqBlue } from "./../_icons";

const drawerWidth = 240;

const styles = theme => ({
  flex: {
    flex: 1,
  },
  logo: {
    height: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit,
  },
  drawerPaper: {
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px 0 24px',
    ...theme.mixins.toolbar,
  },
});

class MiniDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  render() {
    const { classes, theme } = this.props;
    const props = this.props;
    return (
      <Drawer
        variant="temporary"
        classes={{
          paper: classNames(classes.drawerPaper, !props.open && classes.drawerPaperClose),
        }}
        open={props.open}
        onClose={props.handleDrawerToggle}
      >
        <div className={classes.toolbar}>
          {(props.logo) 
            ? (<IconButton aria-label="Delete"><GulaqBlue /></IconButton>)
            : null
          }

          <Typography variant="h6" color="inherit" className={classes.flex}>
            {props.title}
          </Typography>
          <IconButton onClick={props.handleDrawerToggle}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <div
          tabIndex={0}
          role="button"
          onClick={props.handleDrawerToggle}
          onKeyDown={props.handleDrawerToggle}
        >
          {props.routes.map((prop, key) => {
            if (prop.redirect || prop.sidebar === false) return null;
            return (prop.link) ? (
              <ListItem button
                key={key}
                component={RouterLink}
                to={prop.link}
                target={(prop.target) ? prop.target : "_blank"}
                rel="noopener"
              >
                <ListItemIcon>
                  {(typeof prop.icon === 'function') ? <prop.icon /> : prop.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    prop.sidebarName
                  }
                />
              </ListItem>
            ) : (
              <ListItem button
                to={prop.path}
                component={RouterLink}
                key={key}
              >
                <ListItemIcon>
                  {(typeof prop.icon === 'function') ? <prop.icon /> : prop.icon}
                </ListItemIcon>
                <ListItemText primary={prop.sidebarName} />
              </ListItem>
            );
          })}
        </div>
      </Drawer>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);