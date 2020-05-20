/* eslint-disable react/no-multi-comp */
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
import { isDefined, getInputProps, validate, useStore, isArray, isObject, isEmpty, getUniqueArray } from './lib';

const flatten = require('flat');
const { unflatten } = require('flat');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: theme.spacing(),
    paddingLeft: 0
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
  const { label, name, value, fields } = props;
  return (
    <>
      {
        (label) && (
          <FormLabel>
            {(typeof label === 'function') ? label(value) : label}
          </FormLabel>
        )
      }
      <FormGroup row>
        {fields && fields.map((nestedField) => {
          nestedField.name = `${name}.${nestedField.name}`;
          return (
            <Field
              key={
                `${(new Date()).getTime()}-field-${nestedField.type}-${nestedField.name}`
              }
              value={value && value[nestedField.name]}
              { ...nestedField }
            />
          );
        })}
      </FormGroup>
    </>
  );
};

const ArrayField = (props) => {
  const { value, label, type, name } = props;
  const { formData, formDataDispatch } = useStore();
  const subFieldCount = Array.isArray(value) && value.length > 0 ? value.length : 1;
  const [counter, setCounter] = useState(1);
  const [fieldValue, setFieldValue] = useState();
  let fieldProps = {...props};
  delete fieldProps.multiple;
  delete fieldProps.label;

  React.useEffect(() => {
    setCounter(subFieldCount);
  }, []);

  React.useEffect(() => {
    const flatValues = flatten(formData || {}, { delimiter: '.' });
    setFieldValue(flatValues);
  }, [formData]);

  const addField = () => {
    setCounter(counter + 1);
    const parsedFieldValues = unflatten(fieldValue, {
      delimiter: '.'
    });

    if (parsedFieldValues[name]) {
      parsedFieldValues[name].push(type === 'nested' ? {} : '');
    } else {
      parsedFieldValues[name] = [(type === 'nested' ? {} : '')];
    }

    const flatFieldValues = flatten(parsedFieldValues || {}, { delimiter: '.' });
    setFieldValue(flatFieldValues);
    formDataDispatch({ type: 'FIELD_VALUE_UPDATE', payload: parsedFieldValues });
  };

  const removeField = (fieldName, fieldIndex) => {
    const parsedFieldValues = unflatten(fieldValue, {
      delimiter: '.'
    });

    const fieldNameParts = fieldName.split('.');
    let removeFieldPath = '';
    fieldNameParts.map((fieldNamePart, index) => {
      const last = index === fieldNameParts.length - 1;
      if (last) {
        if (isDefined(parsedFieldValues[removeFieldPath])) {
          parsedFieldValues[removeFieldPath].splice(fieldIndex, 1);
        }
      } else {
        if (isNaN(fieldNamePart)) {
          removeFieldPath = (index === 0) ? fieldNamePart : `${removeFieldPath}.${fieldNamePart}`;
        } else {
          removeFieldPath = (index === 0) ? `[${fieldNamePart}]` : `${removeFieldPath}.[${fieldNamePart}]`;
        }
      }
    });

    const finalValues = parsedFieldValues ? flatten(parsedFieldValues, {
      delimiter: '.'
    }) : {};

    setFieldValue(finalValues);
    setCounter(counter - 1);
    formDataDispatch({ type: 'FIELD_VALUE_UPDATE', payload: parsedFieldValues });
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
              {(typeof label === 'function') ? label(fieldValue) : label}
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
          <Grid
            container
            key={`${(new Date()).getTime()}-array-field-${fieldProps.name}`}
          >
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
  const { helptext, name, fieldValues } = props;

  return (helptext !== undefined) ? (
    <FormHelperText id={`${name}-help-text`}>
      {(typeof helptext === 'function') ? helptext(fieldValues) : helptext}
    </FormHelperText>
  ) : null;
};

const FieldHelpLink = (props) => {
  const { helplink, name, fieldValues } = props;

  return (helplink !== undefined) ? (
    <FormHelperText
      id={`${name}-help-link`}
      style={{textAlign: 'right'}}
    >
      {(typeof helplink === 'function') ? helplink(fieldValues) : helplink}
    </FormHelperText>
  ) : null;
};

const FieldError = (props) => {
  const { fieldValues, title, error, errorName, errorMessage } = props;
  return (error) ? (
    <FormHelperText id={errorName}>
      {(typeof title === 'function') ? title(fieldValues) : title || errorMessage}
    </FormHelperText>
  ) : null;
};

const Field = (props) => {
  const classes = useStyles();

  const {
    type, name, label, helptext, multiple,
    prefix, placeholder, disabled, options, value, suffix, required, error,
    errorMessage, helplink, title, description, fields, dependencies,
    dependent, onChange, onError, ...restProps
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

  const arrayType = ['select', 'checkbox'];

  let field = '';
  let fieldOptions = options || [];
  let fieldValue = value;
  let fieldType = type;

  if (fieldValues !== undefined && fieldValues !== null && fieldValues[name] !== undefined && fieldValues[name] !== null) {
    fieldValue = fieldValues[name] ;
    fieldValue = (typeof fieldValue === 'function') ? fieldValue(fieldValues) : fieldValue;
  } else if (value !== undefined && typeof value === 'function') {
    fieldValue = value(fieldValues);
  } else if (value !== undefined) {
    fieldValue = value;
  } else if ((fieldType === 'checkbox' && options !== undefined) || (fieldType === 'select' && multiple) || multiple) {
    fieldValue = [];
  }

  if (isArray(options)) {
    fieldOptions = options;
  } else if (typeof options === 'function') {
    let optionsFn = options(fieldValues);
    if (optionsFn instanceof Promise) {
      optionsFn.then(options => {
        fieldOptions = options;
      });
    } else {
      fieldOptions = optionsFn;
    }
  }

  if (fieldType === undefined) {
    if (isArray(fieldOptions) && fieldOptions.length > 0) {
      if (multiple) {
        fieldType = 'checkbox';
      } else {
        fieldType = 'radio';
      }
    } else if (fields && isArray(fields) && fields.length > 0) {
      fieldType = 'nested';
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
        matchVal = fieldValue.find(v => dependenciesFieldKeys.indexOf(v) !== -1);
      }

      const updatedFields = form.fields;
      // Remove old dependent fields
      let dependenciesArr = [];
      for (let [key, value] of Object.entries(dependencies)) {
        dependenciesArr = [...dependenciesArr, ...value]
      }

      const dependenciesFieldNameArr = [];
      dependenciesArr.map(dependenciesArrItem => {
        dependenciesFieldNameArr.push(dependenciesArrItem.name);
      });

      tempUpdatedFields = updatedFields.filter(dependenciesItem => dependenciesFieldNameArr.indexOf(dependenciesItem.name) === -1);

      if (!isEmpty(matchVal) && isDefined(dependencies[matchVal])) {
        tempUpdatedFields = [...tempUpdatedFields, ...dependencies[matchVal]];
      } else if (!isEmpty(matchVal) && isDefined(dependencies['*'])) {
        tempUpdatedFields = [...tempUpdatedFields, ...dependencies['*']];
      }

      // Get unique fields array
      const uniqueFields = getUniqueArray(tempUpdatedFields, 'name');
      return uniqueFields;
    }
  }

  const handleChange = async (value) => {
    const { error, errorMessage } = validate(props, value, fieldValues);
    const updatedFields = await getUpdatedFields(value);

    // update store with value, error, updated fields
    formDispatch({ type: 'FORM_UPDATE', payload: { 
      fieldValues: { [name]: value },
      fieldErrors: { [name]: { error, errorMessage } },
      fields: updatedFields
    }});

    if (error) {
      onError({ error, errorMessage });
    } else {
      onChange(value);
    }
  }

  const updatedProps = Object.assign({}, props, {
    value: fieldValue,
    type: fieldType,
    key: fieldKey,
    fieldValues: fieldValues,
    handleChange
  });

  if (arrayType.indexOf(fieldType) === -1 && multiple) {
    return (
      <ArrayField {...updatedProps} />
    );
  }

  if (fieldType === 'nested') {
    return (
      <GroupField {...updatedProps} />
    );
  }

  if (fieldType === 'hidden') {
    return (
      <input {...updatedProps} />
    );
  }

  switch (fieldType) {
    case 'radio':
      field = (
        <Radio
          options={fieldOptions}
          {...updatedProps}
        />
      )
      break;
    case 'boolean':
    case 'switch':
      field = (<Switch {...updatedProps} />)
      break;
    case 'toggle':
      field = (
        <Toggle
          options={fieldOptions}
          {...updatedProps}
        />
      );
      break;
    case 'select':
      field = (
        <Select
          {...updatedProps}
          multiple={multiple}
        />
      );
      break;
    case 'range':
      field = (<Range {...updatedProps} />
      );
      break;
    case 'checkbox':
      field = (<Checkbox {...updatedProps} />);
      break;
    case 'date':
      field = (<DateField {...updatedProps} />);
      break;
    case 'currency':
    case 'integer':
    case 'decimal':
    case 'number':
    case 'mobile':
    case 'float':
    case 'tel':
      field = (<NumberField {...updatedProps} />);
      break;
    case 'autocomplete':
      field = (<Autocomplete {...updatedProps} />);
      break;
    default:
      field = (<InputField {...updatedProps} />);
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

Field.propTypes = {};

Field.defaultProps = {
  onError: () => {},
  onChange: () => {}
};

export default Field;
