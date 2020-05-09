import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    minWidth: '100px'
  }
});

const EnhancedCheckbox = (props) => {
  const { classes, label, name, required, key, error, disabled, value, options, handleChange, formData, optionKey, optionValue } = props;

  const onChange = event => {
    const { name, value, checked } = event.target;
    const prevFieldValue = ((formData[name] === undefined) ? [] : formData[name]);
    if (Array.isArray(prevFieldValue)) {
      if (checked) {
        let updatedArray = prevFieldValue.concat([value]);
        let uniqueArray = updatedArray.filter(function(item, pos) {
          return updatedArray.indexOf(item) === pos;
        });
        handleChange(name, uniqueArray);
      } else {
        let filteredPrevValue = prevFieldValue.filter(function(item, pos) {
          return prevFieldValue.indexOf(value) !== pos;
        });

        handleChange(name, filteredPrevValue);
      }
    } else {
      handleChange(name, value);
    }
  }

  return (options) ? (
    <FormGroup
      aria-label={label}
      className={classes.group}
    >
      {options.map(option => {
        const optionVal = option[optionKey] || option[name] || option.id || option.key || option.value || option;
        const optionLabel = option[optionValue] || option.name || option.label || option.value || option;
        return (
          <FormControlLabel
            control={
              <Checkbox
                onChange={onChange}
                value={optionVal}
                name={name}
                disabled={option.disabled}
                checked={(value.indexOf(optionVal.toString()) > -1)}
              />
            }
            label={optionLabel}
          />
        );
      })}
    </FormGroup>
  ) : (
    <FormGroup
      aria-label={label}
      className={classes.group}
    >
      <FormControlLabel
        control={
          <Checkbox
            onChange={handleChange}
            value={value}
            name={name}
            disabled={disabled}
            checked={value}
          />
        }
        label={
          <Typography variant='caption'>
            {label}
          </Typography>
        }
      />
    </FormGroup>
  );
}

EnhancedCheckbox.defaultProps = {
  options: []
};

EnhancedCheckbox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedCheckbox);
