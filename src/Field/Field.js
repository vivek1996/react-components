/* eslint-disable react/no-multi-comp */
import React, { useState } from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

import { makeStyles, withStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";

import AddCircle from "@material-ui/icons/AddCircle";
import RemoveCircle from "@material-ui/icons/RemoveCircle";

import flatten from "flat";
import unflatten from "flat";

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
} from "../lib";

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
  const { label, name, value, fields } = props;
  return (
    <>
      <FieldLabel label={label} value={value} />
      <FormGroup row>
        {fields &&
          fields.map((sectionField) => {
            sectionField.name = `${name}.${sectionField.name}`;
            return (
              <Field
                key={`${new Date().getTime()}-field-${sectionField.type}-${
                  sectionField.name
                }`}
                value={value && value[sectionField.name]}
                {...sectionField}
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

    if (parsedFieldValues[name]) {
      parsedFieldValues[name].push(type === "section" ? {} : "");
    } else {
      parsedFieldValues[name] = [type === "section" ? {} : ""];
    }

    const flatFieldValues = flatten(parsedFieldValues || {}, {
      delimiter: ".",
    });
    setFieldValue(flatFieldValues);
    formDispatch({
      type: "FORM_FIELD_UPDATE",
      payload: parsedFieldValues,
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
      type: "FORM_FIELD_UPDATE",
      payload: parsedFieldValues,
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
      {times(counter || 1, (index) => {
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
    label,
    helptext,
    multiple,
    prefix,
    placeholder,
    disabled,
    options,
    defaultValue,
    suffix,
    required,
    helplink,
    title,
    description,
    fields,
    dependencies,
    onChange,
    onError,
    ...restProps
  } = props;

  // use store
  const { form, formDispatch } = useStore();
  const fieldValues = form.values;
  const formErrors = form.errors;
  const fieldErrorObj = formErrors[name] || {};
  const fieldError = fieldErrorObj.error || false;
  const fieldErrorMessage = fieldErrorObj.errorMessage || null;

  // const [fieldProps, setFieldProps] = React.useState();
  // React.useEffect(() => {
  //   console.log('Inside Use Effect - restProps', restProps);
  //   (async () => {
  //     if (fieldProps === undefined) {
  //       const inputProps = await getInputProps(restProps, formData);
  //       console.log('inputProps', inputProps);
  //       setFieldProps(inputProps);
  //     }
  //   })();
  // }, []);
  // console.log('fieldProps', fieldProps);

  const arrayType = ["select", "checkbox"];

  let field = "";
  let fieldOptions = options || [];
  let fieldValue = defaultValue;
  let fieldType = type;

  if (
    fieldValues !== undefined &&
    fieldValues !== null &&
    fieldValues[name] !== undefined &&
    fieldValues[name] !== null
  ) {
    fieldValue = fieldValues[name];
    fieldValue =
      typeof fieldValue === "function" ? fieldValue(fieldValues) : fieldValue;
  } else if (defaultValue !== undefined && typeof defaultValue === "function") {
    fieldValue = defaultValue(fieldValues);
  } else if (defaultValue !== undefined) {
    fieldValue = defaultValue;
  } else if (
    (fieldType === "checkbox" && options !== undefined) ||
    (fieldType === "select" && multiple) ||
    multiple
  ) {
    fieldValue = [];
  }

  if (isArray(options)) {
    fieldOptions = options;
  } else if (typeof options === "function") {
    let optionsFn = options(fieldValues);
    if (optionsFn instanceof Promise) {
      optionsFn.then((options) => {
        fieldOptions = options;
      });
    } else {
      fieldOptions = optionsFn;
    }
  }

  if (fieldType === undefined) {
    if (isArray(fieldOptions) && fieldOptions.length > 0) {
      if (multiple) {
        fieldType = "checkbox";
      } else {
        fieldType = "radio";
      }
    } else if (fields && isArray(fields) && fields.length > 0) {
      fieldType = "section";
    }
  }

  const fieldErrorName = `${name}-error-text`;
  const fieldKey = `field-${fieldType}-${name}`;

  // This function return updated fields based on the dependencies
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

  const handleChange = async (value) => {
    const { error, errorMessage } = validate(props, value, fieldValues);
    const updatedFields = await getUpdatedFields(value);

    // update store with value, error, updated fields
    formDispatch({
      type: "FORM_UPDATE",
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

  const updatedProps = Object.assign({}, props, {
    defaultValue: fieldValue,
    type: fieldType,
    key: fieldKey,
    fieldValues: fieldValues,
    handleChange,
  });

  if (arrayType.indexOf(fieldType) === -1 && multiple) {
    return <ArrayField {...updatedProps} />;
  }

  if (fieldType === "section") {
    return <SectionField {...updatedProps} />;
  }

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
  type: "text",
  onError: () => {},
  onChange: () => {},
};

export default withStyles(styles, { withTheme: true })(Field);
