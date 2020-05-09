import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';

// import { getInputProps } from '../lib';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    minWidth: '100px'
  }
}));

const EnhancedDate = (props) => {
  const classes = useStyles();
  const { data, value, name, label, placeholder, openTo, format, required, disabled, disablePast, disableDate, disableFuture, helptext, min, max, readonly, prefix, suffix, title, maxlength, minlength, step, handleChange } = props;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        key={name}
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        className={classes.textField}
        value={(value !== undefined) ? value : null}
        openTo={(openTo !== undefined) ? openTo : 'date'}
        views={['year', 'month', 'date']}
        onChange={date => handleChange(name, date)}
        margin='normal'
        format={(format !== undefined) ? format : 'DD/MM/YYYY'}
        required={required}
        disabled={disabled}
        disablePast={(disablePast !== undefined) ? disablePast : false}
        shouldDisableDate={(typeof disableDate === 'function') ? (day) => {
          return disableDate(day, data);
        } : null}
        disableFuture={(disableFuture !== undefined) ? disableFuture : false}
        helperText={(typeof helptext === 'function') ? helptext(data) : helptext}
        minDate={(typeof min === 'function') ? min(data) : min}
        maxDate={(typeof max === 'function') ? max(data) : max}
        InputProps={{
          disabled: (typeof disabled === 'function') ? disabled(data) : disabled,
          readOnly: (typeof readonly === 'function') ? readonly(data) : readonly,
          startAdornment: (prefix) ? (<InputAdornment position='start'>{prefix}</InputAdornment>) : null,
          endAdornment: (suffix) ? (<InputAdornment position='end'>{suffix}</InputAdornment>) : null,
          inputProps: {
            title: (typeof title === 'function') ? title(data) : title,
            min: (typeof min === 'function') ? min(data) : min,
            max: (typeof max === 'function') ? max(data) : max,
            maxLength: (typeof maxlength === 'function') ? maxlength(data) : maxlength,
            minLength: (typeof minlength === 'function') ? minlength(data) : minlength,
            step: (typeof step === 'function') ? step(data) : step
          }
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

export default EnhancedDate;
