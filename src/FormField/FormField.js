import React from "react";
import { StoreProvider } from "../lib";
import Field from "../Field";

export default (props) => (
  <StoreProvider>
    <Field {...props} />
  </StoreProvider>
);
