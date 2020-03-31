import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: '100px'
  },
  optionItem: {
    height: 'auto',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'normal !important'
  }
});

const inputOptions = {};
class EnhancedInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(inputOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  componentDidMount = () => {
    if(this.props.value) {
      this.props.onChange(this.props.name, this.props.value);
    }
  }

  render = () => {
    const props = this.props;
    const { type, parent, name, classes } = props;
    const { data, value } = this.state;
    const fieldName = `${ parent ? `${parent}.${name}` : name }`;

    return (
      <TextField
        key={fieldName}
        id={fieldName}
        name={fieldName}
        type={type}
        label={props.label}
        placeholder={props.placeholder}
        className={classes.textField}
        value={value}
        onChange={props.handleChange}
        margin="normal"
        required={(props.required) ? true : false}
        disabled={(props.disabled) ? true : false}
        // helperText={(typeof props.helptext === 'function') ? props.helptext(data) : props.helptext}
        InputProps={{
          disabled: (typeof props.disabled === 'function') ? props.disabled(data) : props.disabled,
          readOnly: (typeof props.readonly === 'function') ? props.readonly(data) : props.readonly,
          startAdornment: (props.prefix) ? (<InputAdornment position="start">{props.prefix}</InputAdornment>) : null,
          endAdornment: (props.suffix) ? (<InputAdornment position="end">{props.suffix}</InputAdornment>) : null,
          inputProps: {
            title: (typeof props.title === 'function') ? props.title(data) : props.title, 
            min: (typeof props.min === 'function') ? props.min(data) : props.min, 
            max: (typeof props.max === 'function') ? props.max(data) : props.max,
            maxLength: (typeof props.maxlength === 'function') ? props.maxlength(data) : props.maxlength,
            minLength: (typeof props.minlength === 'function') ? props.minlength(data) : props.minlength,
            step: (typeof props.step === 'function') ? props.step(data) : props.step,
            pattern: (typeof props.pattern === 'function') ? props.pattern(data) : props.pattern
          }
        }}
        InputLabelProps={{
          shrink: (value !== undefined || props.prefix) ? true : false
        }}
      />
    );
  }
}

EnhancedInput.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedInput);
