import React from "react";

const FieldDescription = (props) => {
  return (
    <div
      className="description"
      dangerouslySetInnerHTML={{
        __html: props.html,
      }}
    />
  );
};

export default FieldDescription;
