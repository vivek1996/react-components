import React from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const styles = (theme) => ({});

const EnhancedSwitch = (props) => {
  const {
    classes,
    label,
    name,
    key,
    disabled,
    defaultValue,
    handleChange,
    fieldValues,
    placeholder,
  } = props;

  return (
    <>
      {label !== undefined && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              key={key}
              name={name}
              onChange={(event) => {
                const { checked } = event.target;
                handleChange(checked);
              }}
              disabled={disabled}
              checked={defaultValue}
            />
          }
          label={
            typeof placeholder === "function"
              ? placeholder(fieldValues)
              : placeholder
          }
        />
      </FormGroup>
    </>
  );
};

EnhancedSwitch.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultValue: PropTypes.bool,
};

EnhancedSwitch.defaultProps = {
  defaultValue: false,
};

export default withStyles(styles, { withTheme: true })(EnhancedSwitch);
