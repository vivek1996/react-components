import React from 'react';
import Link from '@material-ui/core/Link';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { makeStyles, Toolbar, Typography, Grid, Tooltip, IconButton, Button, Fab } from '@material-ui/core';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import {Delete} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    // paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing.unit
    }
  },
  highlight:
    theme.palette.type === 'light' ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85)
    } : {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.dark
    },
  spacer: {
    flex: '1 1 100%'
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
    margin: theme.spacing.unit * 2
  },
  container: {
    justifyContent: 'space-between'
  }
}));

const EnhancedToolbar = (props) => {
  const classes = useStyles();
  const { title, data, content, numSelected, actions, selectable, ...other } = props;

  return (
    <Toolbar
      // className={classNames(classes.root, {
      //   [classes.highlight]: numSelected > 0,
      // })}
      className={classes.root}
      {...other}
    >
      {
        content || (
          <Grid container className={classes.container}>
            <Grid item className={classes.title}>
              {selectable ? (numSelected > 0 ? (
                <Typography color='inherit' variant='subheading'>
                  {numSelected} selected
                </Typography>
              ) : (
                <Typography variant='h6' id='tableTitle'>
                  {title}
                </Typography>
              )) : (<Typography variant='h6' id='tableTitle'>
                {title}
              </Typography>)}
            </Grid>
            <Grid item className={classes.actions}>
              {(selectable && numSelected > 0 ? (
                <Tooltip title='Delete' placement='top-end'>
                  <IconButton aria-label='Delete'>
                    <Delete />
                  </IconButton>
                </Tooltip>
              ) : (
                (actions)
                  ? actions.map(action => {
                    let icon = (action.icon) ? action.icon : null;

                    let actionBtn;
                    let buttonProps = {
                      'aria-label': action.title,
                      color: action.color,
                      size: action.size
                    };

                    if (action.action) {
                      buttonProps.onClick = () => action.action(data);
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
                  }) : null
              ))}
            </Grid>
          </Grid>
        )
      }
    </Toolbar>
  );
};

EnhancedToolbar.defaultProps = {
  selectable: false,
  title: null,
  content: null,
  actions: []
};

EnhancedToolbar.propTypes = {
  selectable: PropTypes.bool.isRequired
};

export default EnhancedToolbar;
