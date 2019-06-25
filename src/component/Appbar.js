import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { Drawer, Form } from "./";

import { history } from "./../helpers";

import { CustomIcon } from "./../icons";

const styles = theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    width: '80%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing.unit * 3,
      width: '100%',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 6,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    // transition: theme.transitions.create(['width', 'margin'], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.enteringScreen,
    // }),
  },
  popper: {
    zIndex: 1,
    minWidth: '240px',
    maxWidth: '360px',
    // '&[x-placement*="bottom"] $arrow': {
    //   top: 0,
    //   left: 0,
    //   marginTop: '-0.9em',
    //   width: '3em',
    //   height: '1em',
    //   '&::before': {
    //     borderWidth: '0 1em 1em 1em',
    //     borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
    //   },
    // },
    // '&[x-placement*="top"] $arrow': {
    //   bottom: 0,
    //   left: 0,
    //   marginBottom: '-0.9em',
    //   width: '3em',
    //   height: '1em',
    //   '&::before': {
    //     borderWidth: '1em 1em 0 1em',
    //     borderColor: `${theme.palette.common.white} transparent transparent transparent`,
    //   },
    // },
    // '&[x-placement*="right"] $arrow': {
    //   left: 0,
    //   marginLeft: '-0.9em',
    //   height: '3em',
    //   width: '1em',
    //   '&::before': {
    //     borderWidth: '1em 1em 1em 0',
    //     borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
    //   },
    // },
    // '&[x-placement*="left"] $arrow': {
    //   right: 0,
    //   marginRight: '-0.9em',
    //   height: '3em',
    //   width: '1em',
    //   '&::before': {
    //     borderWidth: '1em 0 1em 1em',
    //     borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
    //   },
    // },
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listInline: {
    display: 'inline',
  },
  avatar: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.common.white,
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  button: {
    margin: theme.spacing.unit,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 60
  },
  toolbar: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },

  sectionDesktopStart: {
    display: 'none',
    [theme.breakpoints.between('sm', 'xl')]: {
      display: 'flex',
      flexBasis: '20%',
      justifyContent: 'flex-start',
    },
  },
  sectionMobileStart: {
    display: 'flex',
    flexBasis: '12%',
    justifyContent: 'flex-start',
    [theme.breakpoints.between('sm', 'xl')]: {
      display: 'none',
    },
  },

  sectionCentre: {
    display: 'flex',
    justifyContent: 'center',
    flexBasis: '76%',
    [theme.breakpoints.between('sm', 'xl')]: {
      flexBasis: '60%',
    },
  },

  sectionDesktopEnd: {
    display: 'none',
    [theme.breakpoints.between('sm', 'xl')]: {
      display: 'flex',
      flexBasis: '20%',
      justifyContent: 'flex-end'
    },
  },
  sectionMobileEnd: {
    display: 'flex',
    flexBasis: '12%',
    justifyContent: 'flex-end',
    [theme.breakpoints.between('sm', 'xl')]: {
      display: 'none',
    },
  },
});

const searchColumns = [
  { 
    name: 'name', type: 'search', label: 'Search…', placeholder: 'Search…', 
    options: function(value) {
      return [];
    },
    "dependencies": {
      "*": [
        { 
          name: 'id', type: 'hidden',
          value: (dataObj) => {
            return (dataObj && dataObj.id) ? dataObj.id : "";
          }
        }
      ]
    }
  }
];

class MenuAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleDrawerToggle = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  };

  render() {
    const { classes, title, logo, routes, data, drawer, items } = this.props;
    const { anchorEl, mobileMoreAnchorEl, isDrawerOpen } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    let nameArr = [];
    let nameInitialArr = [];
    let profileImg = null;
    let profileCompleteFlag = false;
    if(data !== undefined && data !== null) {
      if(data.firstName) {
        nameArr.push(data.firstName);
        nameInitialArr.push(data.firstName.charAt(0));
      }

      if(data.middleName) {
        nameArr.push(data.middleName);
      }

      if(data.lastName) {
        nameArr.push(data.lastName);
        nameInitialArr.push(data.lastName.charAt(0));
      }

      profileImg = (data.image !== undefined && data.image !== "" && data.image !== null) ? data.image : null;

      profileCompleteFlag = data.profileComplete;
    }
    
    const fullName = nameArr.join(' ');
    const nameInitial = nameInitialArr.join('');
    
    const renderMenu = (
      <Popover
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={this.handleCloseMenu}
        className={classes.popper}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <List className={classes.list}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              {(profileImg) ?
                <Avatar alt={fullName} src={profileImg} className={classes.bigAvatar} /> : 
                <AccountCircle className={classes.icon} />
              }
            </ListItemAvatar>
            <ListItemText
              primary={fullName}
              secondary={
                <React.Fragment>
                  {(!profileCompleteFlag) ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      className={classes.button}
                      onClick={() => {
                        this.handleCloseMenu();
                        history.push(`/complete-profile`);
                      }}
                    >
                      Complete KYC
                    </Button>
                  ) : null
                  }
                </React.Fragment>
              }
            />
          </ListItem>
          {items.map((item) => {
            return (
              <div
                key={`desktop-${(new Date()).getTime()}-${(item.label) ? item.label.replace(' ', '-') : ""}`}
              >
                <Divider />
                <ListItem 
                  button
                  onClick={() => {
                    this.handleCloseMenu();
                    item.action(this, data);
                  }}
                >
                  {(item.icon) ? (
                      <ListItemIcon>
                        <item.icon />
                      </ListItemIcon>
                    ) : null}
                  <ListItemText primary={item.label} />
                </ListItem>
              </div>
            );
          })}
        </List>
      </Popover>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem 
          onClick={() => {
            this.handleCloseMenu();
          }}
        >
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
        {items.map((item) => {
          return (
            <div
              key={`mobile-${(new Date()).getTime()}-${(item.label) ? item.label.replace(' ', '-') : ""}`}
            >
              <Divider />
              <MenuItem 
                onClick={() => {
                  this.handleCloseMenu();
                  item.action(this, data);
                }}
              >
                {(item.icon) ? (
                  <IconButton color="inherit">
                    <item.icon />
                  </IconButton>
                  ) : null}
                <p>{item.label}</p>
              </MenuItem>
            </div>
          );
        })}
      </Menu>
    );

    const renderDrawer = (drawer && routes.length > 0) ? (
      <Drawer 
        routes={routes} 
        open={isDrawerOpen}
        title={title}
        logo={logo}
        handleDrawerToggle={this.handleDrawerToggle}
      />
    ) : null;

    return (
      <AppBar 
        position="fixed" 
        className={classNames(classes.appBar, isDrawerOpen && classes.appBarShift)}
      >
        <Toolbar 
          disableGutters={!isDrawerOpen}
          className={classes.toolbar}
        >
          <div className={classes.sectionDesktopStart}>
            {(drawer && routes.length > 0) ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classNames(classes.menuButton, isDrawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            ) : null}

            {
              (logo) ? (
                <Link component={RouterLink} to="/dashboard">
                  <CustomIcon className={classes.logo} />
                </Link>
              ) : null
            }

            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              {title}
            </Typography>
          </div>
          
          <div className={classes.sectionMobileStart}>
            {(drawer && routes.length > 0) ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classNames(classes.menuButton, isDrawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
          </div>
          
          {/* <div className={classes.grow} /> */}
          <div className={classes.sectionCentre}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Form 
                fields={searchColumns}
                buttons={[]}
                loadOnChange={true}
                loading={false}
                submitAction={(filterData) => {
                  if(filterData && filterData.id) {
                    history.push(`/mutual-fund/${filterData.id}`);
                  } else if(filterData && filterData.name) {
                    let fundName = filterData.name.split(" ").join("-");
                    history.push(`/dashboard/${fundName}`);
                  }
                }}
              />
            </div>
          </div>
          
          <div className={classes.sectionDesktopEnd}>
            <IconButton
              aria-owns={isMenuOpen ? 'material-appbar' : undefined}
              aria-haspopup="true"
              onClick={this.handleOpenMenu}
              color="inherit"
            >
              {(profileImg) 
                ? <Avatar alt={fullName} src={profileImg} /> 
                : <Avatar alt={fullName} className={classes.avatar}>{nameInitial}</Avatar>
              }
            </IconButton>
          </div>
          <div className={classes.sectionMobileEnd}>
              <IconButton
                aria-owns={isMobileMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleOpenMenu}
                color="inherit"
              >
                {(profileImg) 
                  ? <Avatar alt={fullName} src={profileImg} /> 
                  : <Avatar alt={fullName} className={classes.avatar}>{nameInitial}</Avatar>
                }
              </IconButton>
            </div>
        </Toolbar>
        {renderMenu}
        {renderMobileMenu}
        {renderDrawer}
      </AppBar>
    );
  }
}

MenuAppBar.defaultProps = {
  title: "",
  drawer: false,
  data: {},
  items: [],
  routes: []
};

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  drawer: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
};

export default withStyles(styles)(MenuAppBar);