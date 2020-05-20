const validateField = (fieldProps, value, formData) => {
  const {
    required, min, max, minlength, maxlength, pattern, type, error, validate, fields,
    multiple
  } = fieldProps;
  let errorFlag = false;
  let errorMessage = null;

  const optionType = ['select', 'radio', 'checkbox'];
  if (multiple && optionType.indexOf(type) === -1) {
    const { multiple, ...restFieldProps } = fieldProps;
    if (Array.isArray(value) && value.length > 0) {
      errorFlag = !(value.every((valueObj) => {
        const multipleFieldValidation = validateField(restFieldProps, valueObj, formData);
        return !multipleFieldValidation.error;
      }));
      errorMessage = errorFlag ? (type === 'nested') ? `Please fill section details!` : ((optionType.indexOf(type) > -1) ? `Please select an option!` : `Please enter a value!`) : null;
    } else if (required) {
      errorFlag = true;
      errorMessage = `Please fill section details!`;
    }
  } else if (type === 'nested' && fields.length > 0) {
    errorFlag = !(fields.every((nestedField) => {
      const nestedFieldValue = value && value[nestedField.name];
      const nestedFieldValidation = validateField(nestedField, nestedFieldValue, value);
      return !nestedFieldValidation.error;
    }));
    errorMessage = errorFlag ? `Please fill section details!` : null;
  } else if (required && (value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0))) {
    errorFlag = true;
    errorMessage = (optionType.indexOf(type) > -1) ? `Please select an option!` : `Please enter a value!`;
  } else if (value !== undefined && value !== null && value !== '') {
    if (!errorFlag && min && max && (value < min || value > max)) {
      errorMessage = `Value must be between ${min} and ${max}`;
      errorFlag = true;
    }

    if (!errorFlag && min && !max && (value < min)) {
      errorMessage = `Value must be greater than ${min}`;
      errorFlag = true;
    }

    if (!errorFlag && !min && max && (value > max)) {
      errorMessage = `Value must be less than ${max}`;
      errorFlag = true;
    }

    if (!errorFlag && minlength && maxlength && (value.length > maxlength || value.length < minlength)) {
      errorMessage = `Characters must be between ${minlength} and ${maxlength}`;
      errorFlag = true;
    }

    if (!errorFlag && minlength && !maxlength && (value.length < minlength)) {
      errorMessage = `Minimum length of charcters is ${minlength}`;
      errorFlag = true;
    }

    if (!errorFlag && !minlength && maxlength && (value.length > maxlength)) {
      errorMessage = `Maximum length of charcters is ${maxlength}`;
      errorFlag = true;
    }

    let re = (pattern !== undefined) ? pattern : '';
    if (!errorFlag && (re.length > 0 || typeof re === 'object')) {
      errorFlag = !(re.test(value));
      errorMessage = `Value does not match given pattern`;
    }

    if (!errorFlag && validate) {
      errorFlag = !((typeof validate === 'function') ? validate(formData) : validate);
      errorMessage = `Please provide right value.`;
    }

    if (!errorFlag && typeof error === 'function') {
      errorFlag = error(formData);
      errorMessage = `Please provide right value.`;
    }
  }

  return {
    error: errorFlag,
    errorMessage: errorMessage
  };
}

export default validateField;
