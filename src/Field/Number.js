import React from 'react';

import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
  textField: {
    minWidth: '100px'
  }
}));

const EnhancedNumber = (props) => {
  const classes = useStyles();
  const { type, value } = props;

  const [localValue, setLocalValue] = React.useState(value);

  const checkFormat = (type, value, pattern) => {
    if (value.length > 0) {
      let re = '';
      switch (type) {
        case 'tel':
          re = (pattern) ? pattern : /^[0-9\b]+$/;
          break;
        default:
          re = (pattern) ? pattern : '';
          break;
      }

      return (re.length > 0 || typeof re === 'object') ? re.test(value) : true;
    } else {
      return true;
    }
  }

  const handleOnChange = (event) => {
    const { name, value, step } = event.target;

    // if (type === 'tel') {
    //   formatFlag = checkFormat(type, value);
    // }

    let fieldValue = value;
    if (fieldValue !== '' && !Number.isNaN(fieldValue)) {
      if (step && Number.isInteger(step)) {
        fieldValue = parseInt(fieldValue);
      } else if (step && !Number.isInteger(step)) {
        fieldValue = parseFloat(fieldValue);
      } else {
        if (Number.isInteger(fieldValue)) {
          fieldValue = parseInt(fieldValue);
        } else {
          fieldValue = parseFloat(fieldValue);
        }
      }

      props.handleChange(fieldValue);
    } else {
      props.handleChange(fieldValue);
    }
  }

  return (
    <TextField
      key={props.name}
      id={props.name}
      name={props.name}
      type={type}
      label={props.label}
      placeholder={props.placeholder}
      className={classes.textField}
      defaultValue={value || ''}
      onChange={(event) => {
        const { value } = event.target;
        setLocalValue(value);
      }}
      onBlur={handleOnChange}
      margin='normal'
      required={(props.required) ? true : false}
      disabled={(props.disabled) ? true : false}
      // helperText={(typeof props.helptext === 'function') ? props.helptext(data) : props.helptext}
      InputProps={{ 
        disabled: (typeof props.disabled === 'function') ? props.disabled(data) : props.disabled,
        readOnly: (typeof props.readonly === 'function') ? props.readonly(data) : props.readonly,
        startAdornment: (props.prefix) ? (<InputAdornment position='start'>{props.prefix}</InputAdornment>) : null,
        endAdornment: (props.suffix) ? (<InputAdornment position='end'>{props.suffix}</InputAdornment>) : null,
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
        shrink: (localValue !== undefined && localValue !== null && localValue !== '' && props.prefix)
      }}
    />
  );
}

EnhancedNumber.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default EnhancedNumber;
