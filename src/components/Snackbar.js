import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const styles = theme => ({
  snackBarClose: {
    fontSize: 20
  },
  snackBarMessage: {
    display: 'flex'
  },
  snackBarIcon: {
    fontSize: 20,
  },
  snackBarIconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
});

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

class EnhancedSnackbar extends React.Component {
  state = { snackBarOpen: false };

  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(nextProps);  
  }

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false });
  };

  render = () => {
    const { classes } = this.props;
    const { variant } = this.state;
    const Icon = variantIcon[variant];
    
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackBarOpen}
        autoHideDuration={(this.state.snackBarDuration) ? this.state.snackBarDuration : 10000}
        onClose={(this.props.onClose) ? this.props.onClose : this.handleSnackBarClose}
      >
        <SnackbarContent
          className={classes[(this.state.snackBarType) ? this.state.snackBarType : variant]}
          aria-describedby="snackbar-message-id"
          message={
            <span id="snackbar-message-id" className={classes.snackBarMessage}>
              <Icon className={classNames(classes.snackBarIcon, classes.snackBarIconVariant)} />
              {this.state.snackBarMessage}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.snackBarClose}
              onClick={this.handleSnackBarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

EnhancedSnackbar.defaultProps = {
  variant: "error"
};

EnhancedSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  variant: PropTypes.string.isRequired
};

export default withStyles(styles)(EnhancedSnackbar);