import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
// import Checkbox from '@material-ui/core/Checkbox';

import green from '@material-ui/core/colors/green';

import amber from '@material-ui/core/colors/amber';
import Range from './Field/Range';
import Select from './Field/Select';
import Toggle from './Field/Toggle';
import NumberField from './Field/Number';
import Radio from './Field/Radio';
import Checkbox from './Field/Checkbox';
import InputField from './Field/Input';
import Autocomplete from './Field/Autocomplete';
import DateField from './Field/Date';

import Grid from '@material-ui/core/Grid';

import AddCircle from '@material-ui/icons/AddCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';

import _ from 'lodash';
import { isDefined, getInputProps } from './lib';

const flatten = require('flat');
const { unflatten } = require('flat');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingRight: theme.spacing(),
    paddingLeft: theme.spacing()
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing()
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing(1 / 4)
  },
  searchRoot: {
    color: 'inherit',
    width: '100%'
  },
  searchInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(4),
    transition: theme.transitions.create('width'),
    width: '100%'
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
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
  formControlToggle: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing()
  },
  formControl: {
    // maxWidth: '200px'
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
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer'
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
              width: '90%',
              display: 'flex'
            }}>
              <Field {...fieldProps} />
            </Grid>
            {
              (counter > 1) && (
                <Grid
                  item
                  style={{
                    width: '10%',
                    display: 'flex',
                    alignItems: 'center'
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
  // const [fieldProps, setFieldProps] = React.useState();
  // React.useEffect(() => { 
  //   console.log('Inside Use Effect', restProps);
  //   (async () => {
  //     if (fieldProps === undefined) {
  //       const inputProps = await getInputProps(restProps, formData);
  //       console.log('inputProps', inputProps);
  //       // setFieldProps(inputProps);
  //     }
  //   })();
  // }, [restProps]);

  // console.log('fieldProps', fieldProps);

  const fieldName = `${ parent ? `${parent}.${name}` : name }`;
  const fieldErrorName = `${fieldName}-error-text`;
  const fieldKey = `form-control-${fieldName}`;
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
  } else if (fieldType === 'checkbox' || (fieldType === 'select' && multiple) || multiple) {
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

    if (formatFlag) {
      if (fieldError) {
        setFieldError(false);
      }
      onChange && onChange(name, value, submit);
    } else {
      setFieldError(true);
    }
  }

  switch (fieldType) {
    case 'radio':
      field = (
        <FormControl
          component='fieldset'
          required={required}
          className={classes.textField}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          { <FieldLabel label={label} /> }
          {
            (description) ? (
              <Description html={description} />
            ) : null
          }
          <Radio
            formData={formData}
            options={fieldOptions}
            handleChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldError
              formData={formData}
              title={title}
              error={fieldError}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
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
        </FormControl>
      )
      break;
    case 'boolean':
      field = (
        <FormControl
          key={fieldKey}
        >
          { <FieldLabel label={label} /> }
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  id={name}
                  name={name}
                  value={fieldValue}
                  onChange={handleChange}
                  disabled={disabled}
                  checked={fieldValue}
                />
              }
              label={(typeof placeholder === 'function') ? placeholder(formData) : placeholder}
            />
          </FormGroup>
          {
            <FieldError
              formData={formData}
              title={title}
              error={fieldError}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
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
        </FormControl>
      )
      break;
    case 'switch':
      field = <FormGroup className={classes.formGroup} row>
        {(prefix) ? (
          <FormLabel
            classes={{
              root: classes.switchLabel
            }}
          >
            {(typeof prefix === 'function') ? prefix(formData) : prefix}
          </FormLabel>
        ) : null}
        <Switch
          id={name}
          label={label}
          name={name}
          value={fieldValue}
          onChange={handleChange}
          disabled={disabled}
          checked={fieldValue}
        />
        {(suffix) ? (
          <FormLabel
            classes={{
              root: classes.switchLabel
            }}
          >
            {(typeof suffix === 'function') ? suffix(formData) : suffix}
          </FormLabel>
        ) : null}
        {
          <FieldHelpText
            formData={formData}
            helptext={helptext}
            fieldName={fieldName}
          />
        }
      </FormGroup>
      break;
    case 'toggle':
      field = (
        <FormControl
          className={classes.formControl}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Toggle
            onChange={handleChangeData}
            key={name}
            name={name}
            options={fieldOptions}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'select':
      field = (
        <FormControl
          // className={classes.formControl}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Select
            key={fieldKey}
            multiple={multiple}
            formData={formData}
            handleChange={handleChangeData}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'hidden':
      field = (
        <input
          key={name}
          id={name}
          name={name}
          type={type}
          value={fieldValue}
          onChange={handleChange}
          required={required}
        />
      );
      break;
    case 'range':
      field = (
        <FormControl
          // className={classes.formControl}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Range
            formData={formData}
            handleChange={handleChangeData}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'checkbox':
      field = (
        <FormControl
          component='fieldset'
          required={required}
          className={classes.textField}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          { <FieldLabel label={label} /> }
          <Checkbox
            formData={formData}
            error={fieldError}
            aria-describedby={fieldErrorName}
            key={fieldKey}
            value={fieldValue}
            handleChange={handleChangeData}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'date':
      field = (
        <FormControl
          className={classes.formControl}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <DateField
            formData={formData}
            handleChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldError
              formData={formData}
              title={title}
              error={fieldError}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'number':
    case 'integer':
    case 'decimal':
    case 'tel':
      field = (
        <FormControl
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <NumberField
            formData={formData}
            value={fieldValue}
            handleChange={handleChangeData}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'autocomplete':
      field = (
        <FormControl
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Autocomplete
            key={fieldKey}
            formData={formData}
            handleChange={handleChangeData}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'nested':
      field = (
        <GroupField
          key={`group-${name}`}
          {...updatedProps}
        />
      );
      break;
    default:
      field = (
        <FormControl
          // className={classes.formControl}
          error={fieldError}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <InputField
            formData={formData}
            handleChange={handleChangeData}
            {...updatedProps}
          />
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
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
  }

  return field;
};

Field.defaultProps = {};

Field.propTypes = {
  // classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

// export default withStyles(styles, { withTheme: true })(Field);
export default Field;