import React from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = (theme) => ({
  textField: {
    minWidth: "100px",
  },
});

const EnhancedInput = (props) => {
  const {
    type,
    name,
    key,
    fieldValues,
    handleChange,
    classes,
    defaultValue,
  } = props;

  const [localValue, setLocalValue] = React.useState(defaultValue);

  return (
    <TextField
      key={key}
      name={name}
      type={type}
      label={props.label}
      placeholder={props.placeholder}
      className={classes.textField}
      defaultValue={defaultValue}
      onChange={(event) => {
        const { value } = event.target;
        setLocalValue(value);
      }}
      onBlur={() => handleChange(localValue)}
      margin="normal"
      required={props.required}
      disabled={props.disabled}
      multiline={type === "textarea"}
      InputProps={{
        disabled:
          typeof props.disabled === "function"
            ? props.disabled(fieldValues)
            : props.disabled,
        readOnly:
          typeof props.readonly === "function"
            ? props.readonly(fieldValues)
            : props.readonly,
        startAdornment: props.prefix ? (
          <InputAdornment position="start">{props.prefix}</InputAdornment>
        ) : null,
        endAdornment: props.suffix ? (
          <InputAdornment position="end">{props.suffix}</InputAdornment>
        ) : null,
        inputProps: {
          title:
            typeof props.title === "function"
              ? props.title(fieldValues)
              : props.title,
          min:
            typeof props.min === "function"
              ? props.min(fieldValues)
              : props.min,
          max:
            typeof props.max === "function"
              ? props.max(fieldValues)
              : props.max,
          maxLength:
            typeof props.maxlength === "function"
              ? props.maxlength(fieldValues)
              : props.maxlength,
          minLength:
            typeof props.minlength === "function"
              ? props.minlength(fieldValues)
              : props.minlength,
          step:
            typeof props.step === "function"
              ? props.step(fieldValues)
              : props.step,
          pattern:
            typeof props.pattern === "function"
              ? props.pattern(fieldValues)
              : props.pattern,
        },
      }}
      InputLabelProps={{
        shrink:
          localValue !== undefined &&
          localValue !== null &&
          localValue !== "" &&
          props.prefix,
      }}
    />
  );
};

EnhancedInput.propTypes = {
  classes: PropTypes.object.isRequired,
  /**
   * Default value for the field
   */
  defaultValue: PropTypes.string,
};

EnhancedInput.defaultProps = {
  defaultValue: null,
};

export default withStyles(styles, { withTheme: true })(EnhancedInput);
