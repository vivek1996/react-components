import React from 'react';
import { Link } from 'react-router-dom'

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles, Toolbar, Typography, Grid, Tooltip, IconButton, Button, Fab } from '@material-ui/core';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import {Delete} from '@material-ui/icons';

const toolbarStyles = theme => ({
	root: {
    // paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing.unit,
    },
	},
	highlight:
		theme.palette.type === 'light'
		? {
			color: theme.palette.secondary.main,
			backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    } : {
			color: theme.palette.text.primary,
			backgroundColor: theme.palette.secondary.dark,
    },
	spacer: {
		flex: '1 1 100%',
	},
	actions: {
    display: 'flex',
    color: theme.palette.text.secondary,
    flexBasis: '25%',
    justifyContent: 'flex-end'
	},
	title: {
    display: 'flex',
    flex: '0 0 auto',
    flexBasis: '75%',
    justifyContent: 'flex-start',
    alignItems: 'center'
	},
	fab: {
	  margin: theme.spacing.unit * 2,
  },
  container: {
    justifyContent: 'space-between'
  }
});

const toolbarOptions = {
	title: "Table",
  selectable: false,
  content: null,
	actions: []
}

class EnhancedToolbar extends React.Component {
	constructor(props) {
	  super(props);
  
	  this.state = Object.assign(toolbarOptions, props);
	}
  
	componentWillReceiveProps(nextProps) {
	  this.setState({ 
      title: nextProps.title,
      actions: nextProps.actions,
      data: nextProps.data,
      content: nextProps.content
	  });
	}
  
	render = () => {
	  const { classes, ...other } = this.props;
    const { title, data, content } = this.state;
    
    return (
			<Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: this.state.numSelected > 0,
        })}
        {...other} 
      >
        {
          (content) ? (
            content
          ) : (
            <Grid container className={classes.container}>
              <Grid item className={classes.title}>
                {this.state.selectable ? (this.state.numSelected > 0 ? (
                  <Typography color="inherit" variant="subheading">
                    {this.state.numSelected} selected
                  </Typography>
                ) : (
                  <Typography variant="h6" id="tableTitle">
                    {title}
                  </Typography>
                )) : (<Typography variant="h6" id="tableTitle">
                    {title}
                  </Typography>)}
              </Grid>
              <Grid item className={classes.actions}>
                {(this.state.selectable && this.state.numSelected > 0 ? (
                  <Tooltip title="Delete" placement="top-end">
                    <IconButton aria-label="Delete">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                ) : (
                  (this.state.actions) ?
                  this.state.actions.map(action => {
                      let icon = (action.icon) ? action.icon : null;

                      let actionBtn;
                      let buttonProps = {
                        "aria-label": action.title,
                        color: action.color,
                        size: action.size
                      };

                      if(action.action) {
                        buttonProps.onClick = () => action.action(this, data);
                      } else {
                        buttonProps.to = action.href;
                        buttonProps.component = Link;
                      }

                      actionBtn = (icon) ? (
                        <Fab className={classes.fab} {...buttonProps} >
                          {icon}
                        </Fab>
                      ) : (
                        <Button variant={'text'} {...buttonProps}>
                          {action.label}
                        </Button>
                      );
                      
                      return (
                        <Tooltip title={action.title} placement={action.placement} key={action.title}>
                          {actionBtn}
                        </Tooltip>
                      );
                    })
                  : ''
                ))}
              </Grid>
            </Grid>
          )
        }
      </Toolbar>
		);
	}
};

EnhancedToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  // data: PropTypes.object.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedToolbar);