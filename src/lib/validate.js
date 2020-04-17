const validate = (field, value, formData) => {
  const { required, min, max, minlength, maxlength, pattern, type, error, validate } = field;
  let errorFlag = false;
  let errorMessage = '';
  if (required && (value === undefined || value === null || value === '')) {
    errorFlag = true;
    errorMessage = (['select', 'radio', 'multiselect', 'checkbox'].indexOf(type) > -1) ? `Please select an option!` : `Please enter a value!`;
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

export default validate;
