import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";

const FieldHelpText = (props) => {
  const { helptext, name, fieldValues } = props;

  return helptext !== undefined ? (
    <FormHelperText id={`${name}-help-text`}>
      {typeof helptext === "function" ? helptext(fieldValues) : helptext}
    </FormHelperText>
  ) : null;
};

export default FieldHelpText;
