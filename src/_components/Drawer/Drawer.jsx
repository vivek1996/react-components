import React from 'react';
import { Link } from 'react-router-dom'

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
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import StarIcon from '@material-ui/icons/Star';
// import SendIcon from '@material-ui/icons/Send';
// import MailIcon from '@material-ui/icons/Mail';
// import DeleteIcon from '@material-ui/icons/Delete';
// import ReportIcon from '@material-ui/icons/Report';



// import { mailFolderListItems, otherMailFolderListItems } from './tileData';

const drawerWidth = 240;

const styles = theme => ({
  flex: {
    flex: 1,
  },
  logo: {
    height: '28px',
    marginTop: '14px'
  },
  drawerPaper: {
    position: 'relative',
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
    padding: '0 8px',
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
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !props.open && classes.drawerPaperClose),
          }}
          open={props.open}
        >
          <div className={classes.toolbar}>
            <a href="/" className={classes.flex}>
              <img src={props.logo} className={classes.logo} alt="logo" />
            </a>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {props.title}
            </Typography>
            <IconButton onClick={props.handleDrawerToggle}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <div>
            {props.routes.map((prop, key) => {
              if (prop.redirect || prop.sidebar === false) return null;
              return (
                <ListItem button
                  to={prop.path}
                  component={Link}
                  key={key}
                >
                  <ListItemIcon>
                    <prop.icon />
                  </ListItemIcon>
                  <ListItemText primary={prop.sidebarName} />
                </ListItem>
              );
            })}
          </div>
          {/* <Divider /> */}
        </Drawer>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);