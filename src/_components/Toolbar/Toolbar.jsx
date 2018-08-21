import React from 'react';
import { Link } from 'react-router-dom'

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles, Toolbar, Typography, Grid, Tooltip, IconButton } from '@material-ui/core';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import {Delete, Add, FilterList} from '@material-ui/icons';

const toolbarStyles = theme => ({
	root: {
		paddingRight: theme.spacing.unit,
	},
	highlight:
		theme.palette.type === 'light'
		? {
			color: theme.palette.secondary.main,
			backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
		: {
			color: theme.palette.text.primary,
			backgroundColor: theme.palette.secondary.dark,
			},
	spacer: {
		flex: '1 1 100%',
	},
	actions: {
		color: theme.palette.text.secondary,
	},
	title: {
		flex: '0 0 auto',
	},
	fab: {
	  margin: theme.spacing.unit * 2,
	},
});

const toolbarOptions = {
	title: "Table",
	selectable: false,
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
      actions: nextProps.actions
	  });
	}
  
	render = () => {
	  const { classes } = this.props;
		const { title } = this.state;

		return (
			<Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: this.state.numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {this.state.selectable ? (this.state.numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {this.state.numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title" id="tableTitle">
              {title}
            </Typography>
          )) : (<Typography variant="title" id="tableTitle">
              {title}
            </Typography>)}
        </div>
        <div className={classes.spacer} />
        {/* <div className={classes.actions}> */}
        <Grid item sm={3} xs={3} className={classes.actions}>
          {(this.state.selectable && this.state.numSelected > 0 ? (
            <Tooltip title="Delete" placement="top-end">
              <IconButton aria-label="Delete">
                <Delete />
              </IconButton>
            </Tooltip>
          ) : (
            (this.state.actions) ?
            this.state.actions.map(action => {
                let icon;
                switch(action.icon) {
                  case 'Add':
                    icon = <Add />;
                    break;
                  case 'FilterList':
                    icon = <FilterList />;
                    break;
                  default:
                    icon = <Add />;
                    break;
                }

                let actionBtn;
                if(action.action) {
                  actionBtn = <IconButton aria-label={action.title} variant="fab" className={classes.fab} color={action.color} onClick={() => action.action(this)}>
                    {icon}
                  </IconButton>;
                } else {
                  actionBtn = <IconButton aria-label={action.title} variant="fab" className={classes.fab} color={action.color} to={action.href} component={Link}>
                    {icon}
                  </IconButton>
                }
                
                return (
                <Tooltip title={action.title} placement={action.placement} key={action.title}>
                  {actionBtn}
                </Tooltip>);
              })
            : ''
          ))}
        {/* </div> */}
        </Grid>
      </Toolbar>
		);
	}
};

EnhancedToolbar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(toolbarStyles)(EnhancedToolbar);