import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

import Range from './Field/Range';
import Select from './Field/Select';
import Toggle from './Field/Toggle';
import NumberField from './Field/Number';
import Radio from './Field/Radio';
import Checkbox from './Field/Checkbox';
import InputField from './Field/Input';
import Autocomplete from './Field/Autocomplete';
import DateField from './Field/Date';
import Switch from './Field/Switch';

import Grid from '@material-ui/core/Grid';

import AddCircle from '@material-ui/icons/AddCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';

import _ from 'lodash';
import { isDefined, getInputProps, validate } from './lib';

const flatten = require('flat');
const { unflatten } = require('flat');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: theme.spacing(),
    paddingLeft: 0
  },
  switchLabel: {
    alignItems: 'center',
    display: 'flex'
  },
  helperText: {
    maxWidth: '200px'
  },
  helperTextLink: {
    textAlign: 'right'
  },
  formGroup: {
    // maxWidth: '200px'
  }
}));

function Description(props) {
  return (
    <div
      className='description'
      dangerouslySetInnerHTML={{
        __html: props.html
      }}
    />
  );
}

const GroupField = (props) => {
  const { label, name, formData, fields, onChange } = props;
  return (
    <>
      {
        (label) && (
          <FormLabel>
            {(typeof label === 'function') ? label(formData) : label}
          </FormLabel>
        )
      }
      <FormGroup row>
        {fields && fields.map((nestedField) => {
          const nestedFieldName = `${name}.${nestedField.name}`;
          return (
            <Field
              onChange={onChange}
              parent={name}
              value={formData && formData[nestedFieldName]}
              { ...nestedField }
            />
          );
        })}
      </FormGroup>
    </>
  );
};

const ArrayField = (props) => {
  const { value, label, formData } = props;
  const subFieldCount = Array.isArray(value) ? value.length : 1;
  const [counter, setCounter] = useState(subFieldCount);
  const [fieldValue, setFieldValue] = useState();
  let fieldProps = {...props};
  delete fieldProps.multiple;
  delete fieldProps.label;

  React.useEffect(() => {
    const flatValues = flatten(formData || {}, { delimiter: '.' });
    setFieldValue(flatValues);
  }, [formData]);

  const addField = () => {
    setCounter(counter + 1);
  };

  const removeField = (fieldName, fieldIndex) => {
    const parsedValues = unflatten(fieldValue, {
      delimiter: '.'
    });

    const fieldNameParts = fieldName.split('.');
    let removeFieldPath = '';
    fieldNameParts.map((fieldNamePart, index) => {
      const last = index === fieldNameParts.length - 1;
      if (last) {
        if (isDefined(parsedValues[removeFieldPath])) {
          parsedValues[removeFieldPath].splice(fieldIndex, 1);
        }
      } else {
        if (isNaN(fieldNamePart)) {
          removeFieldPath = (index === 0) ? fieldNamePart : `${removeFieldPath}.${fieldNamePart}`;
        } else {
          removeFieldPath = (index === 0) ? `[${fieldNamePart}]` : `${removeFieldPath}.[${fieldNamePart}]`;
        }
      }
    });

    const finalValues = parsedValues ? flatten(parsedValues, {
      delimiter: '.'
    }) : {};

    setFieldValue(finalValues);
    setCounter(counter - 1);
  };

  return (
    <>
      <Grid
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '8px',
          paddingLeft: 0
        }}
      >
        {
          (label) && (
            <FormLabel>
              {(typeof label === 'function') ? label(formData) : label}
            </FormLabel>
          )
        }
        <AddCircle onClick={() => addField()} />
      </Grid>
      {_.times(counter || 1, (index) => {
        let fieldNameParts = fieldProps.name.split('.');
        const lastPart = fieldNameParts[fieldNameParts.length - 1];
        if (isNaN(lastPart)) {
          fieldProps.name = `${fieldProps.name}.${index}`;
        } else {
          fieldNameParts[fieldNameParts.length - 1] = index;
          const fieldName = fieldNameParts.join('.');
          fieldProps.name = `${fieldName}`;
        }

        fieldProps.value = isDefined(fieldValue) ? fieldValue[fieldProps.name] || '' : '';

        return (
          <Grid container>
            <Grid item style={{
              width: '95%',
              display: 'flex'
            }}>
              <Field {...fieldProps} />
            </Grid>
            {
              (counter > 1) && (
                <Grid
                  item
                  style={{
                    width: '5%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '8px'
                  }}
                >
                  <RemoveCircle
                    onClick={(event) => {
                      removeField(fieldProps.name, index)
                    }}
                  />
                </Grid>
              )
            }
          </Grid>
        );
      })}
    </>
  );
};

const FieldLabel = (props) => {
  const { label } = props;

  return (label !== undefined) ? (
    <FormLabel component='legend'>{label}</FormLabel>
  ) : null;
};

const FieldHelpText = (props) => {
  const { helptext, fieldName, formData } = props;

  return (helptext !== undefined) ? (
    <FormHelperText id={`${fieldName}-help-text`}>
      {(typeof helptext === 'function') ? helptext(formData) : helptext}
    </FormHelperText>
  ) : null;
};

const FieldHelpLink = (props) => {
  const classes = useStyles();
  const { helplink, fieldName, formData } = props;

  return (helplink !== undefined) ? (
    <FormHelperText
      id={`${fieldName}-help-link`}
      classes={{
        root: classes.helperTextLink
      }}
    >
      {(typeof helplink === 'function') ? helplink(formData) : helplink}
    </FormHelperText>
  ) : null;
};

const FieldError = (props) => {
  const { formData, title, error, errorName, errorMessage } = props;
  return (error) ? (
    <FormHelperText id={errorName}>
      {(typeof title === 'function') ? title(formData) : title || errorMessage}
    </FormHelperText>
  ) : null;
};

const Field = (props) => {
  const classes = useStyles();

  const {
    formData, type, name, label, helptext, multiple,
    prefix, placeholder, disabled, options, value, suffix, required, error,
    errorMessage, helplink, title, description, fields, parent, onChange, ...restProps
  } = props;

  // More properties handled in useEffect
  // format, disablePast, disableFuture, disableDate, openTo, min, max, readonly, maxlength, minlength, step
  const [fieldError, setFieldError] = React.useState(false);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState();
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

  const arrayType = ['select', 'checkbox'];

  let field = '';
  let fieldOptions = options || [];
  let fieldValue = value;
  let fieldType = type;

  if (formData !== undefined && formData !== null && formData[name] !== undefined && formData[name] !== null) {
    fieldValue = formData[name] ;
    fieldValue = (typeof fieldValue === 'function') ? fieldValue(formData) : fieldValue;
  } else if (value !== undefined && typeof value === 'function') {
    fieldValue = value(formData);
  } else if (value !== undefined) {
    fieldValue = value;
  } else if ((fieldType === 'checkbox' && options !== undefined) || (fieldType === 'select' && multiple) || multiple) {
    fieldValue = [];
  }

  if (Array.isArray(options)) {
    fieldOptions = options;
  } else if (typeof options === 'function') {
    let optionsFn = options(formData);
    if (optionsFn instanceof Promise) {
      optionsFn.then(options => {
        fieldOptions = options;
      });
    } else {
      fieldOptions = optionsFn;
    }
  }

  if (fieldType === undefined) {
    if (fieldOptions.length > 0) {
      if (multiple) {
        fieldType = 'checkbox';
      } else {
        fieldType = 'radio';
      }
    } else if (fields && fields.length > 0) {
      fieldType = 'nested';
    }
  }

  const fieldName = `${ parent ? `${parent}.${name}` : name }`;
  const fieldErrorName = `${fieldName}-error-text`;
  const fieldKey = `field-${fieldType}-${fieldName}`;
  const updatedProps = Object.assign({}, props, {
    name: fieldName,
    value: fieldValue,
    type: fieldType,
    key: fieldKey
  });

  if (arrayType.indexOf(fieldType) === -1 && multiple) {
    return (
      <ArrayField {...updatedProps} />
    );
  }

  React.useEffect(() => {
    (async () => {
      if (error !== undefined) {
        const fieldErrorFlag = (typeof error === 'function') ? error(formData) : (error || false);
        setFieldError(fieldErrorFlag);
      }
    })();
  }, [error]);

  React.useEffect(() => {
    (async () => {
      if (errorMessage !== undefined) {
        const fieldErrorMessageText = (typeof errorMessage === 'function') ? errorMessage(formData) : errorMessage;
        setFieldErrorMessage(fieldErrorMessageText);
      }
    })();
  }, [errorMessage]);

  const checkFormat = (type, value, pattern) => {
    if (value.length > 0) {
      let re = '';
      switch (type) {
        case 'tel':
          re = (pattern) ? pattern : /^[0-9\b]+$/;
          break;
        default:
          re = (pattern) ? pattern : '';
          break;
      }

      return (re.length > 0 || typeof re === 'object') ? re.test(value) : true;
    } else {
      return true;
    }
  }

  const handleChange = (event) => {
    const { name, value, type, checked, pattern } = event.target;
    let fieldValue = (type === 'checkbox') ? checked : value;
    let formatFlag = true;

    if (type === 'tel') {
      formatFlag = checkFormat(type, value, pattern);
    }

    if (formatFlag) {
      handleChangeData(name, fieldValue);
    } else {
      setFieldError(true);
    }
  }

  const handleChangeData = (name, value, submit = true) => {
    const { format, type, decimal } = props;

    let formatFlag = true;
    if (type === 'date') {
      if (value !== undefined) {
        value = (format) ? value.format(format) : value.format('YYYY-MM-DD');
      }
    }

    if (type === 'range') {
      value = (isNaN(value) || typeof value === 'string') ? value : value.toFixed(decimal || 2);
    }

    if (type === 'tel') {
      formatFlag = checkFormat(type, value);
    }

    const { error, errorMessage } = validate(props, value, formData);
    if (error || !formatFlag) {
      setFieldError(true);
      setFieldErrorMessage(errorMessage);
    } else {
      setFieldError(false);
      setFieldErrorMessage(null);
      onChange && onChange(name, value, submit);
    }

    console.log(`Field - 
      handleChangeData : 
        error - ${error}, errorMessage - ${errorMessage}
    `);
  }

  switch (fieldType) {
    case 'radio':
      field = (
        <Radio
          options={fieldOptions}
          handleChange={handleChangeData}
          {...updatedProps}
        />
      )
      break;
    case 'boolean':
    case 'switch':
      field = (
        <Switch
          handleChange={handleChangeData}
          {...updatedProps}
        />
      )
      break;
    case 'toggle':
      field = (
        <Toggle
          handleChange={handleChangeData}
          options={fieldOptions}
          {...updatedProps}
        />
      );
      break;
    case 'select':
      field = (
        <Select
          multiple={multiple}
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
      break;
    case 'hidden':
      field = (
        <input
          key={fieldKey}
          name={fieldName}
          type={fieldType}
          value={fieldValue}
          onChange={handleChange}
          required={required}
        />
      );
      break;
    case 'range':
      field = (
        <Range
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
      break;
    case 'checkbox':
      field = (
        <Checkbox
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
      break;
    case 'date':
      field = (
        <DateField
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
      break;
    case 'number':
    case 'integer':
    case 'decimal':
    case 'tel':
      field = (
        <NumberField
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
      break;
    case 'autocomplete':
      field = (
        <Autocomplete
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
      break;
    case 'nested':
      field = (
        <GroupField
          {...updatedProps}
        />
      );
      break;
    default:
      field = (
        <InputField
          handleChange={handleChangeData}
          {...updatedProps}
        />
      );
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
      {
        (description) ? (
          <Description html={description} />
        ) : null
      }
      {
        <FieldHelpText
          formData={formData}
          helptext={helptext}
          fieldName={fieldName}
        />
      }
      {
        <FieldHelpLink
          formData={formData}
          helplink={helplink}
          fieldName={fieldName}
        />
      }
      {
        <FieldError
          formData={formData}
          title={title}
          error={fieldError}
          errorName={fieldErrorName}
          errorMessage={fieldErrorMessage}
        />
      }
    </FormControl>
  );
};

Field.defaultProps = {};

Field.propTypes = {
  // classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

// export default withStyles(styles, { withTheme: true })(Field);
export default Field;