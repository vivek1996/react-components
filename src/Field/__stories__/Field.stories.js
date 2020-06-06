import React from "react";
import { action } from "@storybook/addon-actions";
import Field from "../Field";
// import { StoreProvider } from "../../lib";

export default {
  title: "Field",
  component: Field,
};

export const Default = () => <Field name="text" />;

export const Text = () => <Field name="text" type="text" />;

export const Email = () => <Field name="email" type="email" />;
