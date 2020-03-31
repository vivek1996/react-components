import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    margin: '16px 8px 8px 8px'
  },
  container: {
    padding: '22px 0px'
  },
  rangeMin: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing.unit
  },
  rangeMax: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit
  },
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

const rangeOptions = {};

class EnhancedRange extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(rangeOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  componentDidMount = () => {
    // if(this.props.value) {
    //   this.props.onChange(this.props.name, this.props.value);
    // }
  }

  render = () => {
    const props = this.props;
    const { classes, minText, min, name, maxText, max, step, parent } = this.props;
    const { data, value } = this.state;
    const fieldName = `${ parent ? `${parent}.${name}` : name }`;
    return (
      <TextField
        key={`range-${fieldName}`}
        id={fieldName}
        name={fieldName}
        type="range"
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
          startAdornment: ((minText !== undefined || min !== undefined) ? (
            <InputAdornment position="start">
              {(minText !== undefined && typeof minText === 'function') ? minText(data) : minText}
              {(min !== undefined && typeof min === 'function') ? min(data) : min}
            </InputAdornment>
          ) : null),
          endAdornment: ((maxText !== undefined || max !== undefined) ? (
            <InputAdornment position="end">
              {(maxText !== undefined && typeof maxText === 'function') ? maxText(data) : maxText}
              {(max !== undefined && typeof max === 'function') ? max(data) : max}
            </InputAdornment>
          ) : null),
          inputProps: {
            title: (typeof props.title === 'function') ? props.title(data) : props.title, 
            min: (typeof props.min === 'function') ? props.min(data) : props.min, 
            max: (typeof props.max === 'function') ? props.max(data) : props.max,
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

EnhancedRange.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedRange);
