import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Radio from '@material-ui/core/Radio';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

// const options = [
//   'None',
//   'Atria',
//   'Callisto',
//   'Dione',
//   'Ganymede',
//   'Hangouts Call',
//   'Luna',
//   'Oberon',
//   'Phobos',
//   'Pyxis',
//   'Sedna',
//   'Titania',
//   'Triton',
//   'Umbriel',
// ];

class ConfirmationDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props;
  }

  state = {};

  // // TODO
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.value !== this.props.value) {
  //     this.setState({ value: nextProps.value });
  //   }
  // }

  radioGroup = null;

  handleEntering = () => {
    // this.radioGroup.focus();
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

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value, ...other } = this.props;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          {/* <RadioGroup
            ref={node => {
              this.radioGroup = node;
            }}
            aria-label="ringtone"
            name="ringtone"
            value={this.state.value}
            onChange={this.handleChange}
          >
            {options.map(option => (
              <FormControlLabel value={option} key={option} control={<Radio />} label={option} />
            ))}
          </RadioGroup> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func,
  value: PropTypes.string,
};

export default ConfirmationDialog;