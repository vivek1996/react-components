import validator from "validator";

const validateField = (fieldProps, value, formData) => {
  const {
    required,
    min,
    max,
    minlength,
    maxlength,
    pattern,
    type,
    error,
    validate,
    fields,
    multiple,
  } = fieldProps;
  let errorFlag = false;
  let errorMessage = null;

  const optionType = ["select", "radio", "checkbox"];
  if (multiple && optionType.indexOf(type) === -1) {
    const { multiple, ...restFieldProps } = fieldProps;
    if (Array.isArray(value) && value.length > 0) {
      errorFlag = !value.every((valueObj) => {
        const multipleFieldValidation = validateField(
          restFieldProps,
          valueObj,
          formData
        );
        return !multipleFieldValidation.error;
      });
      errorMessage = errorFlag
        ? type === "nested"
          ? `Please fill section details!`
          : optionType.indexOf(type) > -1
          ? `Please select an option!`
          : `Please enter a value!`
        : null;
    } else if (required) {
      errorFlag = true;
      errorMessage = `Please fill section details!`;
    }
  } else if (type === "section" && fields.length > 0) {
    errorFlag = !fields.every((sectionField) => {
      const sectionFieldValue = value && value[sectionField.name];
      const sectionFieldValidation = validateField(
        sectionField,
        sectionFieldValue,
        value
      );
      return !sectionFieldValidation.error;
    });
    errorMessage = errorFlag ? `Please fill section details!` : null;
  } else if (
    required &&
    (value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0))
  ) {
    errorFlag = true;
    errorMessage =
      optionType.indexOf(type) > -1
        ? `Please select an option!`
        : `Please enter a value!`;
  } else {
    switch (type) {
      case "email":
        errorMessage = `Value must be a valid email`;
        errorFlag = !validator.isEmail(value);
        break;
      case "url":
        errorMessage = `Value must be a url`;
        errorFlag = !validator.isURL(value);
        break;
      case "decimal":
        errorMessage = `Value must be a decimal`;
        errorFlag = !validator.isDecimal(value);
        break;
      case "boolean":
      case "switch":
        errorMessage = `Value must be a boolean`;
        errorFlag = !validator.isBoolean(value);
        break;
      case "postal":
        errorMessage = `Value must be a postal code`;
        errorFlag = !validator.isPostalCode(value, "IN");
        break;
      case "date":
        errorMessage = `Value must be a valid date`;
        if (fieldProps.format) {
          errorFlag = !validator.isDate(value, fieldProps.format);
        } else {
          errorFlag = !validator.isDate(value);
        }
        break;
      case "float":
        errorMessage = `Value must be a float`;
        errorFlag = !validator.isFloat(value);
        if (min !== undefined && max !== undefined) {
          errorMessage = `Value must be between ${min} and ${max}`;
        }

        if (min !== undefined && max === undefined) {
          errorMessage = `Value must be greater than ${min}`;
        }

        if (min === undefined && max !== undefined) {
          errorMessage = `Value must be less than ${max}`;
        }
        break;
      case "integer":
        errorMessage = `Value must be a integer`;
        errorFlag = !validator.isInt(value, { min: min, max: max });
        if (min !== undefined && max !== undefined) {
          errorMessage = `Value must be between ${min} and ${max}`;
        }

        if (min !== undefined && max === undefined) {
          errorMessage = `Value must be greater than ${min}`;
        }

        if (min === undefined && max !== undefined) {
          errorMessage = `Value must be less than ${max}`;
        }
        break;
      default:
        if (
          !errorFlag &&
          (minlength !== undefined || maxlength !== undefined) &&
          !validator.isLength(value, { min: minlength, max: maxlength })
        ) {
          errorFlag = true;
          errorMessage = `Characters length must be between ${minlength} and ${maxlength}`;

          if (minlength !== undefined && maxlength === undefined) {
            errorMessage = `Minimum length of charcters is ${minlength}`;
          }

          if (minlength === undefined && maxlength !== undefined) {
            errorMessage = `Maximum length of charcters is ${maxlength}`;
          }
        }

        if (
          !errorFlag &&
          (min !== undefined || max !== undefined) &&
          !validator.isInt(value.toString(), { min: min, max: max })
        ) {
          errorFlag = true;
          errorMessage = `Value must be between ${min} and ${max}`;
          if (min !== undefined && max === undefined) {
            errorMessage = `Value must be greater than ${min}`;
          }

          if (min === undefined && max !== undefined) {
            errorMessage = `Value must be less than ${max}`;
          }
        }

        let re = pattern !== undefined ? pattern : "";
        if (!errorFlag && (re.length > 0 || typeof re === "object")) {
          errorFlag = !re.test(value);
          errorMessage = `Value does not match given pattern`;
        }

        if (!errorFlag && validate) {
          errorFlag = !(typeof validate === "function"
            ? validate(formData)
            : validate);
          errorMessage = `Please provide right value.`;
        }

        if (!errorFlag && typeof error === "function") {
          errorFlag = error(formData);
          errorMessage = `Please provide right value.`;
        }
        break;
    }
  }

  return {
    error: errorFlag,
    errorMessage: errorMessage,
  };
};

export default validateField;
