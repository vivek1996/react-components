const getPropValue = async (prop, data) => {
  if (prop !== undefined) {
    const propVal = ((typeof prop === 'function') ? await prop(data) : prop);
    return propVal;
  }

  return prop;
};

// label: (typeof label === 'function') ? label(data) : label,
// helptext: (typeof helptext === 'function') ? helptext(data) : helptext,
// helplink: (typeof helplink === 'function') ? helplink(data) : helplink,
// title: (typeof title === 'function') ? title(data) : title,
// error: (typeof error === 'function') ? error(data) : error,
// placeholder: (typeof placeholder === 'function') ? placeholder(data) : placeholder,
const propMapper = {
  'title': 'title',
  'error': 'error',
  'label': 'label',
  'helptext': 'helptext',
  'helplink': 'helplink',
  'placeholder': 'placeholder'
};

// disabled: (typeof disabled === 'function') ? disabled(data) : disabled,
// readOnly: (typeof readonly === 'function') ? readonly(data) : readonly,
// startAdornment: (prefix) ? (<InputAdornment position='start'>{prefix}</InputAdornment>) : null,
// endAdornment: (suffix) ? (<InputAdornment position='end'>{suffix}</InputAdornment>) : null,
const inputPropMapper = {
  'disabled': 'disabled',
  'readonly': 'readOnly',
  'prefix': 'startAdornment',
  'suffix': 'endAdornment'
};

// title: (typeof title === 'function') ? title(data) : title,
// min: (typeof min === 'function') ? min(data) : min,
// max: (typeof max === 'function') ? max(data) : max,
// maxLength: (typeof maxlength === 'function') ? maxlength(data) : maxlength,
// minLength: (typeof minlength === 'function') ? minlength(data) : minlength,
// step: (typeof step === 'function') ? step(data) : step
const inputAttributeMapper = {
  'min': 'min',
  'max': 'max',
  'step': 'step',
  'title': 'title',
  'minlength': 'minLength',
  'maxlength': 'maxLength'
};

const getInputProps = async (props) => {
  const { data, ...rest } = props;
  const defaultProps = {};
  const defaultInputProps = {};
  const defaultInputAttributes = {};

  for (const property in rest) {
    const propValue = await getPropValue(props[property], data);
    console.log(`${property} - ${propValue}`);
    if (propValue !== undefined) {
      if (Object.keys(propMapper).indexOf(property) > -1) {
        defaultProps[propMapper[property]] = propValue;
      }
      if (Object.keys(inputPropMapper).indexOf(property) > -1) {
        defaultInputProps[inputPropMapper[property]] = propValue;
      }
      if (Object.keys(inputAttributeMapper).indexOf(property) > -1) {
        defaultInputAttributes[inputAttributeMapper[property]] = propValue;
      }
    }
  }

  if (Object.keys(defaultInputProps).length > 0) {
    defaultProps.InputProps = defaultInputProps;
    if (Object.keys(defaultInputAttributes).length > 0) {
      defaultProps.InputProps.inputProps = defaultInputAttributes;
    }
  }

  return defaultProps;
}

export default getInputProps;
