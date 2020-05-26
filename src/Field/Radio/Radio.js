import React from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

const styles = (theme) => ({});

const EnhancedRadio = (props) => {
  const {
    classes,
    options,
    defaultValue,
    name,
    key,
    label,
    handleChange,
    optionKey,
    optionValue,
  } = props;

  return (
    <>
      {label !== undefined ? (
        <FormLabel component="legend">{label}</FormLabel>
      ) : null}
      <RadioGroup
        aria-label={label}
        className={classes.group}
        defaultValue={defaultValue}
        key={key}
        name={name}
        onChange={(event) => {
          const { value } = event.target;
          handleChange(value);
        }}
      >
        {options.map((option) => {
          return (
            <FormControlLabel
              value={
                option[optionKey] ||
                option[name] ||
                option.id ||
                option.key ||
                option.value ||
                option
              }
              control={<Radio />}
              label={
                option[optionValue] ||
                option.name ||
                option.label ||
                option.value ||
                option
              }
              disabled={option.disabled}
              key={`${new Date().getTime()}-radio-group-${
                option[optionKey] ||
                option[name] ||
                option.id ||
                option.key ||
                option.value ||
                option
              }`}
            />
          );
        })}
      </RadioGroup>
    </>
  );
};

EnhancedRadio.defaultProps = {
  options: [],
};

EnhancedRadio.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EnhancedRadio);
