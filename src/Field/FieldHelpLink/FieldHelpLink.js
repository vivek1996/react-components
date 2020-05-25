import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";

const FieldHelpLink = (props) => {
  const { helplink, name, fieldValues } = props;

  return helplink !== undefined ? (
    <FormHelperText id={`${name}-help-link`} style={{ textAlign: "right" }}>
      {typeof helplink === "function" ? helplink(fieldValues) : helplink}
    </FormHelperText>
  ) : null;
};

export default FieldHelpLink;
