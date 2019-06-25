import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  paper: {
    maxWidth: 360,
    // maxHeight: 360,
    overflow: 'auto',
  },
  popper: {
    zIndex: 1400,
    minWidth: '240px',
    maxWidth: '360px',
    maxHeight: '360px',
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.common.white} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
      },
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    height: '56px',
    borderRadius: '3px 3px 0 0',
    boxSizing: 'border-box',
    fontWeight: 500,
    justifyContent: 'space-between',
    padding: '0 8px 0 16px'
  },
  content: {
    maxHeight: '400px',
    paddingTop: theme.spacing.unit * 3,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    color: 'rgba(255, 255, 255)',
  },
  title: {
    color: 'rgba(255, 255, 255)',
  }
});

class EnhancedPopper extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);  
  }

  handleClose = () => {
    this.props.onClose();
	};
	
	handleCancel = () => {
    if(this.props.value) {
      this.props.onClose(this.props.value);
    } else {
      this.props.onClose("cancel");
    }
  };

  handleOk = () => {
    if(this.state.value) {
      this.props.onClose(this.state.value);
    } else {
      this.props.onClose("ok");
    }
	};

	renderActions = () => {
		switch(this.state.type) {
			case 'confirm': {
				return(
					<DialogActions>
						<Button onClick={this.handleCancel} color="primary">
							Cancel
						</Button>
						<Button onClick={this.handleOk} color="primary">
							Ok
						</Button>
					</DialogActions>
				);
			}
			case 'alert': {
				return(
					<DialogActions>
						<Button onClick={this.handleClose} color="primary" autoFocus>
							Ok
						</Button>
					</DialogActions>
				);
      }
      default: {
        return;
      }
		}
  }
  
  render() {
    const { open, classes, onClose, anchorEl } = this.props;

    return (
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={"bottom-end"}
        disablePortal={true}
        className={classes.popper}
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
        }}
      >
        <Paper className={classes.paper}>
          {(this.state.title) ? 
            <DialogTitle id="dialog-title" className={classes.header} disableTypography={true}>
              <Typography variant="h6" className={classes.title}>{this.state.title}</Typography>
              {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              ) : null}
            </DialogTitle> : ""
          }
					<DialogContent className={classes.content}>
						{(this.state.text) ? <DialogContentText>{this.state.text}</DialogContentText> : ""}
						{(this.state.content) ? this.state.content : ""}
					</DialogContent>
					{(this.state.type) ? this.renderActions() : ""}
        </Paper>
      </Popper>
    );
  }
}

EnhancedPopper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedPopper);