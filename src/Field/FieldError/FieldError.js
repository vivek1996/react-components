import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";

const FieldError = (props) => {
  const { fieldValues, title, error, errorName, errorMessage } = props;
  return error ? (
    <FormHelperText id={errorName}>
      {typeof title === "function" ? title(fieldValues) : title || errorMessage}
    </FormHelperText>
  ) : null;
};

export default FieldError;
