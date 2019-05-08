import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
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
    padding: '0 8px 0 16px',
    minWidth: '300px'
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
  },
  content: {
    paddingTop: theme.spacing.unit * 3,
  }
});

class EnhancedDialog extends React.Component {
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
      case 'custom': {
				return(
					<DialogActions>
            {this.state.actions.map(actionButton => {
              const btnKey = `button-${actionButton.label.replace(' ', '-')}`;
              
              return (
                <Button 
                  variant={(actionButton.variant) ? actionButton.variant : "contained"}
                  color={(actionButton.color) ? actionButton.color : "primary"}
                  onClick={(e) => actionButton.action(this)} 
                  key={btnKey}
                >
                  {actionButton.label}
                </Button>
              );
            })}
					</DialogActions>
				);
			}
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

  render = () => {
    const { classes, title, onClose, ...other } = this.props;
    
    return (
      <Dialog
        fullScreen={isMobile}
        maxWidth={false}
        onClose={onClose}
				aria-labelledby="dialog-title"
        className={classes.dialog}
				{...other}
			>
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
			</Dialog>
    );
  }
}

export default withStyles(styles)(EnhancedDialog);