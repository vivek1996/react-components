/* eslint-disable react/no-multi-comp */
import React, { useState } from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

import { makeStyles, withStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";

import AddCircle from "@material-ui/icons/AddCircle";
import RemoveCircle from "@material-ui/icons/RemoveCircle";

// Field Input Types
import Autocomplete from "./Autocomplete";
import Checkbox from "./Checkbox";
import DateField from "./Date";
import InputField from "./Input";
import NumberField from "./Number";
import Radio from "./Radio";
import Range from "./Range";
import Select from "./Select";
import Switch from "./Switch";
import Toggle from "./Toggle";

// Field Components
import FieldLabel from "./FieldLabel";
import FieldError from "./FieldError";
import FieldHelpText from "./FieldHelpText";
import FieldHelpLink from "./FieldHelpLink";
import FieldDescription from "./FieldDescription";

import {
  isDefined,
  getInputProps,
  validate,
  useStore,
  isArray,
  isObject,
  isEmpty,
  getUniqueArray,
  times,
  getValueFromJson,
  isFunction,
} from "../lib";

import flatten from "flat";
const { unflatten } = require("flat");

const styles = (theme) => ({});

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    padding: theme.spacing(),
    paddingLeft: 0,
  },
}));

const SectionField = (props) => {
  const { label, name, defaultValue, fields } = props;
  return (
    <>
      <FieldLabel label={label} value={defaultValue} />
      <FormGroup row>
        {fields &&
          fields.map((sectionField) => {
            return (
              <Field
                {...sectionField}
                key={`${new Date().getTime()}-field-${sectionField.type}-${
                  sectionField.name
                }`}
                name={`${name}.${sectionField.name}`}
                defaultValue={defaultValue && defaultValue[sectionField.name]}
              />
            );
          })}
      </FormGroup>
    </>
  );
};

const ArrayField = (props) => {
  const { defaultValue, label, type, name } = props;
  const { form, formDispatch } = useStore();
  const fieldValues = form.values;
  const subFieldCount =
    Array.isArray(defaultValue) && defaultValue.length > 0
      ? defaultValue.length
      : 1;
  const [counter, setCounter] = useState(1);
  const [fieldValue, setFieldValue] = useState();
  let fieldProps = { ...props };
  delete fieldProps.multiple;
  delete fieldProps.label;

  React.useEffect(() => {
    setCounter(subFieldCount);
  }, []);

  React.useEffect(() => {
    const flatValues = flatten(fieldValues || {}, { delimiter: "." });
    setFieldValue(flatValues);
  }, [fieldValues]);

  const addField = () => {
    setCounter(counter + 1);
    const parsedFieldValues = unflatten(fieldValue, {
      delimiter: ".",
    });

    const newValue = type === "section" ? {} : "";
    if (parsedFieldValues[name]) {
      parsedFieldValues[name].push(newValue);
    } else {
      parsedFieldValues[name] = [newValue, newValue];
    }

    const flatFieldValues = flatten(parsedFieldValues || {}, {
      delimiter: ".",
    });
    setFieldValue(flatFieldValues);
    formDispatch({
      type: "FORM_DATA_UPDATE",
      payload: {
        fieldValues: parsedFieldValues,
        fieldErrors: {},
      },
    });
  };

  const removeField = (fieldName, fieldIndex) => {
    const parsedFieldValues = unflatten(fieldValue, {
      delimiter: ".",
    });

    const fieldNameParts = fieldName.split(".");
    let removeFieldPath = "";
    fieldNameParts.map((fieldNamePart, index) => {
      const last = index === fieldNameParts.length - 1;
      if (last) {
        if (isDefined(parsedFieldValues[removeFieldPath])) {
          parsedFieldValues[removeFieldPath].splice(fieldIndex, 1);
        }
      } else {
        if (isNaN(fieldNamePart)) {
          removeFieldPath =
            index === 0 ? fieldNamePart : `${removeFieldPath}.${fieldNamePart}`;
        } else {
          removeFieldPath =
            index === 0
              ? `[${fieldNamePart}]`
              : `${removeFieldPath}.[${fieldNamePart}]`;
        }
      }
    });

    const finalValues = parsedFieldValues
      ? flatten(parsedFieldValues, {
          delimiter: ".",
        })
      : {};

    setFieldValue(finalValues);
    setCounter(counter - 1);
    formDispatch({
      type: "FORM_DATA_UPDATE",
      payload: {
        fieldValues: parsedFieldValues,
        fieldErrors: {},
      },
    });
  };

  return (
    <>
      <Grid
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "8px",
          paddingLeft: 0,
        }}
      >
        <FieldLabel label={label} value={fieldValue} />
        <AddCircle onClick={() => addField()} />
      </Grid>
      {times(counter, (index) => {
        let fieldNameParts = fieldProps.name.split(".");
        const lastPart = fieldNameParts[fieldNameParts.length - 1];
        if (isNaN(lastPart)) {
          fieldProps.name = `${fieldProps.name}.${index}`;
        } else {
          fieldNameParts[fieldNameParts.length - 1] = index;
          const fieldName = fieldNameParts.join(".");
          fieldProps.name = `${fieldName}`;
        }

        fieldProps.value = isDefined(fieldValue)
          ? fieldValue[fieldProps.name] || ""
          : "";
        fieldProps.defaultValue = isDefined(fieldValue)
          ? fieldValue[fieldProps.name] || ""
          : "";

        return (
          <Grid
            container
            key={`${new Date().getTime()}-array-field-${fieldProps.name}`}
          >
            <Grid
              item
              style={{
                width: "95%",
                display: "flex",
              }}
            >
              <Field {...fieldProps} />
            </Grid>
            {counter > 1 && (
              <Grid
                item
                style={{
                  width: "5%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "8px",
                }}
              >
                <RemoveCircle
                  onClick={(event) => {
                    removeField(fieldProps.name, index);
                  }}
                />
              </Grid>
            )}
          </Grid>
        );
      })}
    </>
  );
};

const Field = (props) => {
  const classes = useStyles();

  const {
    type,
    name,
    helptext,
    multiple,
    options,
    defaultValue,
    helplink,
    title,
    description,
    fields,
    dependencies,
    onChange,
    onError,
  } = props;

  // use store
  const { form, formDispatch } = useStore();
  const fieldValues = form.values;
  const formErrors = form.errors;
  const fieldErrorObj = formErrors[name] || {};
  const fieldError = fieldErrorObj.error || false;
  const fieldErrorMessage = fieldErrorObj.errorMessage || null;
  const valueFromJson = getValueFromJson(fieldValues, name);
  const arrayType = ["select", "checkbox"];

  let field = "";
  let fieldOptions = options || [];
  let fieldValue = defaultValue;
  let fieldType = type;

  if (isFunction(options)) {
    (async () => {
      fieldOptions = await options(fieldValue, fieldValues);
    })();
  }

  if (!isDefined(type)) {
    if (isArray(fieldOptions) && fieldOptions.length > 0) {
      if (multiple) {
        fieldType = "checkbox";
      } else {
        fieldType = "radio";
      }
    } else if (fields && isArray(fields) && fields.length > 0) {
      fieldType = "section";
    } else {
      fieldType = "text";
    }
  }

  const fieldErrorName = `${name}-error-text`;
  const fieldKey = `field-${fieldType}-${name}`;
  if (isDefined(valueFromJson)) {
    fieldValue = isFunction(valueFromJson)
      ? valueFromJson(fieldValues)
      : valueFromJson;
  } else if (isDefined(defaultValue)) {
    fieldValue = isFunction(defaultValue)
      ? defaultValue(fieldValues)
      : defaultValue;
  } else if (
    (fieldType === "checkbox" && isDefined(options)) ||
    (fieldType === "select" && multiple) ||
    multiple
  ) {
    fieldValue = [];
  }

  /**
   * This function return updated fields based on the dependencies
   */
  const getUpdatedFields = (fieldValue) => {
    let matchVal = fieldValue;
    if (dependencies) {
      let tempUpdatedFields = [];
      const dependenciesFieldKeys = Object.keys(dependencies);
      if (isArray(fieldValue)) {
        matchVal = fieldValue.find(
          (v) => dependenciesFieldKeys.indexOf(v) !== -1
        );
      }

      const updatedFields = form.fields;
      // Remove old dependent fields
      let dependenciesArr = [];
      for (let [key, value] of Object.entries(dependencies)) {
        dependenciesArr = [...dependenciesArr, ...value];
      }

      const dependenciesFieldNameArr = [];
      dependenciesArr.map((dependenciesArrItem) => {
        dependenciesFieldNameArr.push(dependenciesArrItem.name);
      });

      tempUpdatedFields = updatedFields.filter(
        (dependenciesItem) =>
          dependenciesFieldNameArr.indexOf(dependenciesItem.name) === -1
      );

      if (!isEmpty(matchVal) && isDefined(dependencies[matchVal])) {
        tempUpdatedFields = [...tempUpdatedFields, ...dependencies[matchVal]];
      } else if (!isEmpty(matchVal) && isDefined(dependencies["*"])) {
        tempUpdatedFields = [...tempUpdatedFields, ...dependencies["*"]];
      }

      // Get unique fields array
      const uniqueFields = getUniqueArray(tempUpdatedFields, "name");
      return uniqueFields;
    }
  };

  /**
   * This function return updated fields based on the dependencies
   */
  const handleChange = async (value) => {
    const { error, errorMessage } = validate(props, value, fieldValues);
    const updatedFields = await getUpdatedFields(value);

    // update store with value, error, updated fields
    formDispatch({
      type: "FORM_FIELD_VALUE_UPDATE",
      payload: {
        fieldValues: { [name]: value },
        fieldErrors: { [name]: { error, errorMessage } },
        fields: updatedFields,
      },
    });

    if (error) {
      onError({ error, errorMessage });
    } else {
      onChange(value);
    }
  };

  /**
   * Update properties to handle undefined type, key, fieldValues, and add handleChange function
   */
  const updatedProps = {
    ...props,
    ...{
      type: fieldType,
      key: fieldKey,
      fieldValues,
      defaultOptions: fieldOptions,
      handleChange,
    },
    ...(!isEmpty(fieldValue)
      ? {
          defaultValue: fieldValue,
        }
      : {}),
  };

  /**
   * Call ArrayField if {multiple: true}
   */
  if (arrayType.indexOf(fieldType) === -1 && multiple) {
    return <ArrayField {...updatedProps} />;
  }

  /**
   * Call SectionField if {type: "section"}
   */
  if (fieldType === "section") {
    return <SectionField {...updatedProps} />;
  }

  /**
   * Call if {type: "hidden"}
   */
  if (fieldType === "hidden") {
    return <input {...updatedProps} />;
  }

  switch (fieldType) {
    case "radio":
      field = <Radio options={fieldOptions} {...updatedProps} />;
      break;
    case "boolean":
    case "switch":
      field = <Switch {...updatedProps} />;
      break;
    case "toggle":
      field = <Toggle options={fieldOptions} {...updatedProps} />;
      break;
    case "select":
      field = <Select {...updatedProps} multiple={multiple} />;
      break;
    case "range":
      field = <Range {...updatedProps} />;
      break;
    case "checkbox":
      field = <Checkbox {...updatedProps} />;
      break;
    case "date":
      field = <DateField {...updatedProps} />;
      break;
    case "currency":
    case "integer":
    case "decimal":
    case "number":
    case "mobile":
    case "float":
    case "tel":
      field = <NumberField {...updatedProps} />;
      break;
    case "autocomplete":
      field = <Autocomplete {...updatedProps} />;
      break;
    default:
      field = <InputField {...updatedProps} />;
      break;
  }

  return (
    <FormControl
      error={fieldError}
      aria-describedby={fieldErrorName}
      key={fieldKey}
      className={classes.container}
    >
      {field}
      {description ? <FieldDescription html={description} /> : null}
      {
        <FieldHelpText
          name={name}
          helptext={helptext}
          fieldValues={fieldValues}
        />
      }
      {
        <FieldHelpLink
          name={name}
          helplink={helplink}
          fieldValues={fieldValues}
        />
      }
      {
        <FieldError
          title={title}
          error={fieldError}
          fieldValues={fieldValues}
          errorName={fieldErrorName}
          errorMessage={fieldErrorMessage}
        />
      }
    </FormControl>
  );
};

Field.propTypes = {
  /**
   * Name of the field to get the value.
   */
  name: PropTypes.string.isRequired,
  /**
   * Type of the field eg. (text, number, textarea, tel, email etc.). Default type is text.
   */
  type: PropTypes.string,
  /**
   * Label for the field
   */
  label: PropTypes.string,
  /**
   * Helptext for the field
   */
  helptext: PropTypes.string,
  /**
   * Placeholder for the field
   */
  placeholder: PropTypes.string,
  /**
   * Default value for multiple is false it can be true if type is select
   */
  multiple: PropTypes.bool,
  /**
   * Default value for disabled is false it can be true to mark field disabled
   */
  disabled: PropTypes.bool,
  /**
   * Default value for required is false it can be true to mark field required
   */
  required: PropTypes.bool,
  /**
   * Default value for the field
   */
  defaultValue: PropTypes.any,
  /**
   * Prefix for field
   */
  prefix: PropTypes.string,
  /**
   * Suffix for field
   */
  suffix: PropTypes.string,
  /**
   * Helplink url for field
   */
  helplink: PropTypes.string,
  /**
   * Title for field
   */
  title: PropTypes.string,
  /**
   * Description for field
   */
  description: PropTypes.string,
  /**
   * Fields array for section type of field
   */
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    })
  ),
  /**
   * Dependencies array for section type of field
   */
  dependencies: PropTypes.shape({
    "": PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }),
  /**
   * Options can be function & array of string/object
   */
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
  /**
   * Callback fired when the error is there.
   *
   * @param {object} error The error source of the callback.
   * You can pull out the new error & errorMessage by accessing `error.error` (bool) and `error.errorMessage` (string).
   */
  onError: PropTypes.func,
  /**
   * Callback fired when value changed.
   *
   * @param value of the field.
   * You can pull out the new error & errorMessage by accessing `error.error` (bool) and `error.errorMessage` (string).
   */
  onChange: PropTypes.func,
};

Field.defaultProps = {
  multiple: false,
  disabled: false,
  required: false,
  onError: () => {},
  onChange: () => {},
};

export default withStyles(styles, { withTheme: true })(Field);
