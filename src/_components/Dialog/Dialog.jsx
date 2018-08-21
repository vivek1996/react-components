import React from 'react';

import { withStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
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
    const { classes, title, ...other } = this.props;
    return (
			<Dialog
				aria-labelledby="form-dialog-title"
				{...other}
			>
					{(this.state.title) ? <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle> : ""}
					<DialogContent>
						{(this.state.text) ? <DialogContentText>{this.state.text}</DialogContentText> : ""}
						{(this.state.content) ? this.state.content : ""}
					</DialogContent>
					{(this.state.type) ? this.renderActions() : ""}
			</Dialog>
    );
  }
}

export default withStyles(styles)(EnhancedDialog);