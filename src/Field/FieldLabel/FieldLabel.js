import React from "react";
import FormLabel from "@material-ui/core/FormLabel";

const FieldLabel = (props) => {
  const { label, value } = props;

  const labelText = typeof label === "function" ? label(value) : label;
  return labelText !== undefined ? (
    <FormLabel component="legend">{labelText}</FormLabel>
  ) : null;
};

export default FieldLabel;
