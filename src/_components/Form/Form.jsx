import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles, TextField, Button } from '@material-ui/core';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


import { Toolbar } from "../../_components";

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
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  },
  buttonSuccess: {
    margin: theme.spacing.unit,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  snackBarClose: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  buttonWrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    zIndex: 10000
  },
});

class EnhancedForm extends React.Component {
  state = {loading: false, success: false, snackBarOpen: false };
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(nextProps);  
  }

  handleSnackBarClose = (event, reason) => {
    console.log("reason", reason);
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  handleChange = event => {
    const { name, value, type } = event.target;
    const { data } = this.state;

    let fieldValue = value;
    if(type === "checkbox") {
      fieldValue = event.target.checked;
    }

    this.setState({
      data: {
        ...data,
        [name]: fieldValue
      }
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true,
        },
        () => {
          this.state.submitAction(this.state.data);
          // this.state.submitAction(this.state.data, () => {
          //   console.log("Callback");
          //   this.setState({
          //     loading: false,
          //     success: true,
          //   });
          // });
          // (this.state.onClick === 'function') ? this.state.onClick() : console.log("Test Here");
          // this.state.onClick;
          // this.timer = setTimeout(() => {
          //   this.setState({
          //     loading: false,
          //     success: true,
          //   });
          // }, 2000);
        },
      );
    }

    // this.state.submitAction(this.state.data);
  }

  render = () => {
    const { classes, title } = this.props;
    const { data, fields, buttons, loading, success } = this.state;
    
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
      [classes.button]: !success,
    });

    return (
      <div>
        {(title) ? <Toolbar title={title} /> : ""}
        <form className={classes.container} onSubmit={this.handleSubmit} autoComplete="off">
          {fields.map(formField => {
            let field = '';
            switch(formField.type) {
              case 'radio':
                field = <FormControl component="fieldset" required className={classes.formControl} key={`form-control-${formField.name}`}>
                  <FormLabel component="legend">{formField.label}</FormLabel>
                  <RadioGroup
                    aria-label={formField.label}
                    className={classes.group}
                    value={data[formField.name]}
                    id={formField.name}
                    name={formField.name}
                    onChange={this.handleChange}
                  >
                    {formField.options.map(option => {
                      return (<FormControlLabel value={option.value} control={<Radio />} label={option.label} disabled={(option.disabled) ? true : false} />);
                    })}
                  </RadioGroup>
                </FormControl>
                break;
              case 'boolean':
                field = <FormControl component="fieldset" key={`form-control-${formField.name}`}>
                  <FormLabel component="legend">{formField.label}</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id={formField.name}
                          checked={data[formField.name]}
                          name={formField.name}
                          onChange={this.handleChange}
                          disabled={(formField.disabled) ? true : false}
                        />
                      }
                      label={formField.placeholder}
                    />
                  </FormGroup>
                  <FormHelperText></FormHelperText>
                </FormControl>
                break;
              default:
                field = <TextField
                  key={formField.name}
                  id={formField.name}
                  name={formField.name}
                  label={formField.label}
                  type={formField.type}
                  placeholder={formField.placeholder}
                  className={classes.textField}
                  value={data[formField.name]}
                  onChange={this.handleChange}
                  margin="normal"
                  required={(formField.required) ? true : false}
                  disabled={(formField.disabled) ? true : false}
                />
                break;
            }

            return field;
          })}

          {buttons.map(formButton => {
            let field = '';
            switch(formButton.type) {
              case 'button':
                field = (
                  <Button variant="contained" color="secondary" className={buttonClassname} onClick={() => formButton.action(this)} key={`${(new Date()).getTime()}-button-${formButton.label}`}
                  >
                    {formButton.label}
                  </Button>
                )
                break;
              default:
                field = (
                  <Button variant="contained" color="primary" type="submit" disabled={loading} className={buttonClassname} key={`${(new Date()).getTime()}-button-${formButton.label}`}>
                    {success ? <CheckIcon /> : ''} {formButton.label}
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                )
                break;
            }

            return field;
          })}
        </form>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackBarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Note archived</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleSnackBarClose}>
              UNDO
            </Button>,
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
      </div>
    );
  }
}

EnhancedForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedForm);