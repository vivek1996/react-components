import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";

import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";

import Field from "../Field";

import {
  validate,
  isDefined,
  isFunction,
  StoreProvider,
  useStore,
} from "../lib";

const classNames = require("classnames");

const { unflatten } = require("flat");

const styles = (theme) => ({
  formWraper: {
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    padding: theme.spacing(),
  },
  button: {
    margin: theme.spacing(),
  },
  buttonSuccess: {
    margin: theme.spacing(),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonWrapper: {
    margin: theme.spacing(),
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
    zIndex: 10000,
  },
});

const defaultDataReducer = (accumulator, currentValue) => {
  if (
    currentValue &&
    currentValue.hasOwnProperty("name") &&
    accumulator &&
    !accumulator[currentValue.name] &&
    currentValue.defaultValue !== undefined
  ) {
    (async () => {
      accumulator[currentValue.name] = isFunction(currentValue.defaultValue)
        ? await currentValue.defaultValue(accumulator)
        : currentValue.defaultValue;
    })();
  }

  return accumulator;
};

const EnhancedForm = (props) => {
  const {
    classes,
    title,
    container,
    novalidate,
    autoValidate,
    data,
    initialValues,
    fields,
    buttons,
    onSubmit,
    onError,
  } = props;
  const containerClass = classNames(container && classes.container);

  const initialFormData = data || initialValues;
  const [submiting, setSubmiting] = React.useState(false);
  const { form, formDispatch } = useStore();
  const fieldValues = form.values;
  const formFields = form.fields;
  React.useEffect(() => {
    (async () => {
      const defaultFieldValue = fields.reduce(
        defaultDataReducer,
        initialFormData
      );
      var formInitialValues = { ...defaultFieldValue, ...initialFormData };
      if (isFunction(initialFormData)) {
        formInitialValues = await initialFormData();
      }
      formDispatch({
        type: "SET_INITIAL_FORM",
        payload: {
          fields,
          fieldValues: formInitialValues,
          fieldErrors: {},
        },
      });
    })();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    let formHasError = false;
    const parsedFields = unflatten(fieldValues, {
      delimiter: ".",
    });

    const fieldErrors = {};
    formFields.map((field) => {
      if (!isDefined(field.readonly) || !field.readonly) {
        const { error, errorMessage } = validate(
          field,
          parsedFields[field.name],
          parsedFields
        );
        if (error) formHasError = true;
        fieldErrors[field.name] = {
          error,
          errorMessage,
        };
      }
    });

    formDispatch({
      type: "FORM_ERROR_UPDATE",
      payload: {
        errors: fieldErrors,
      },
    });

    if (formHasError) {
      onError(fieldErrors);
    } else if (!submiting) {
      setSubmiting(true);
      onSubmit(parsedFields);
    }
  };

  return (
    <div className={classes.formWraper}>
      {title && (
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      )}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate={novalidate || autoValidate}
      >
        <div className={containerClass}>
          {formFields.map((formFieldItem) => {
            return (
              <Field
                key={`${new Date().getTime()}-field-${formFieldItem.type}-${
                  formFieldItem.name
                }`}
                {...formFieldItem}
              />
            );
          })}

          {buttons.map((formButton) => {
            let button = "";
            switch (formButton.type) {
              case "button":
                const btnKey = `button-${formButton.label.replace(" ", "-")}`;
                let disable =
                  typeof formButton.disable === "function"
                    ? formButton.disable(data)
                    : formButton.disable;
                button = (
                  <Button
                    variant={
                      formButton.variant ? formButton.variant : "contained"
                    }
                    color={formButton.color ? formButton.color : "secondary"}
                    className={classes.button}
                    onClick={(e) => formButton.action(fieldValues, e, btnKey)}
                    key={btnKey}
                    disabled={disable || submiting || formButton.disabled}
                  >
                    {formButton.label}
                    {submiting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                );
                break;
              default:
                button = (
                  <Button
                    variant="contained"
                    color={formButton.color ? formButton.color : "primary"}
                    type="submit"
                    disabled={submiting}
                    className={classes.button}
                    key={`${new Date().getTime()}-button-${formButton.label}`}
                  >
                    {formButton.label}
                    {submiting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                );
                break;
            }

            return button;
          })}
        </div>
      </form>
    </div>
  );
};

EnhancedForm.propTypes = {
  classes: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  onError: PropTypes.func,
  onSubmit: PropTypes.func,
};

EnhancedForm.defaultProps = {
  buttons: [{ type: "submit", label: "Submit", color: "secondary" }],
  container: true,
  submiting: false,
  autoValidate: false,
  fields: [],
  onSubmit: () => {},
  onError: () => {},
};

export default withStyles(styles, { withTheme: true })((props) => (
  <StoreProvider>
    <EnhancedForm {...props} />
  </StoreProvider>
));
