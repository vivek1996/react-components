const validate = (field, value, formData) => {
  const { required, min, max, minlength, maxlength, pattern, type } = field;
  let errorFlag = false;
  let errorMessage = '';
  if (required && (value === undefined || value === null || value === "")) {
    errorFlag = true;
    errorMessage = (type === 'select') ? `Please select an option!` : `Please enter a value!`;
  } else if (value !== undefined && value !== null && value !== "") {
    if (errorFlag && min && max && (value < min || value > max)) {
      errorMessage = `Value must be between ${min} and ${max}`;
      errorFlag = true;
    }

    if (errorFlag && min && !max && (value < min)) {
      errorMessage = `Value must be greater than ${min}`;
      errorFlag = true;
    }

    if (errorFlag && !min && max && (value > max)) {
      errorMessage = `Value must be less than ${max}`;
      errorFlag = true;
    }

    if (errorFlag && minlength && maxlength && (value.length > maxlength || value.length < minlength)) {
      errorMessage = `Characters must be between ${minlength} and ${maxlength}`;
      errorFlag = true;
    }

    if (errorFlag && minlength && !maxlength && (value.length < min.length)) {
      errorMessage = `Minimum length of charcters is ${minlength}`;
      errorFlag = true;
    }

    if (errorFlag && !minlength && maxlength && (value.length > maxlength)) {
      errorMessage = `Maximum length of charcters is ${maxlength}`;
      errorFlag = true;
    }

    // if (validateFlag && field.minlength) {
    //   validateFlag = (value.length >= field.minlength) ? true : false;
    // }

    // if (validateFlag && field.maxlength) {
    //   validateFlag = (value.length <= field.maxlength) ? true : false;
    // }

    let re = (pattern) ? pattern : '';
    if (errorFlag && (re.length > 0 || typeof re === "object")) {
      errorFlag = !(re.test(value));
      errorMessage = `Value does not match given pattern`;
    }

    if (errorFlag && field.hasOwnProperty('validate')) {
      errorFlag = !((typeof field.validate === "function") ? field.validate(formData) : field.validate);
      errorMessage = `Please provide right value.`;
    }

    if (errorFlag && field.hasOwnProperty('error') && typeof field.error === "function") {
      errorFlag = field.error(formData);
      errorMessage = `Please provide right value.`;
    }
  }

  return {
    error: errorFlag,
    errorMessage: errorMessage
  };
}

export default validate;