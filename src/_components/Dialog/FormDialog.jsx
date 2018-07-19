import React from 'react';

import { withStyles, TextField } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

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

class FormDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  handleClose = () => {
    this.props.onClose();
  };

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);  
  }

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
    this.state.submitAction(this.state.data);
  }

  render = () => {
    const { classes, title, ...other } = this.props;
    const { data, formFields } = this.state;
    return (
      <div>
        <Dialog
          aria-labelledby="form-dialog-title"
          {...other}
        >
          <form className={classes.container} onSubmit={this.handleSubmit} autoComplete="off">
            <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.state.description}</DialogContentText>
              {formFields.fields.map(formField => {
                let field = '';
                switch(formField.type) {
                  case 'radio':
                    field = <FormControl component="fieldset" required className={classes.formControl}>
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
                    field = <FormControl component="fieldset">
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
            
              {/* <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              /> */}
           </DialogContent>
            <DialogActions>
            {formFields.buttons.map(formButton => {
                let field = '';
                switch(formButton.type) {
                  case 'button':
                    field = <Button variant="contained" color="secondary" className={classes.button} onClick={() => formButton.action(this)}>
                      {formButton.label}
                    </Button>
                    break;
                  default:
                    field = <Button variant="contained" color="primary" className={classes.button} type="submit">
                      {formButton.label}
                    </Button>
                    break;
                }

                return field;
              })}
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(FormDialog);