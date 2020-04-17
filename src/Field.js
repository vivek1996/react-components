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

import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import amber from '@material-ui/core/colors/amber';
import Range from './Field/Range';
import Select from './Field/Select';
import Toggle from './Field/Toggle';
import NumberField from './Field/Number';
import Radio from './Field/Radio';
import Checkbox from './Field/Checkbox';
import File from './Field/File';
import InputField from './Field/Input';
import Autocomplete from './Field/Autocomplete';
import DateField from './Field/Date';

import _ from 'lodash';

import Grid from '@material-ui/core/Grid';

import AddCircle from '@material-ui/icons/AddCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';

// import { getInputProps } from './lib';

const flatten = require('flat');
const { unflatten } = require('flat');

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const { label, name, data, fields, onChange } = props;
  return (
    <FormGroup row>
      {
        (label) && (
          <FormLabel>
            {(typeof label === 'function') ? label(data) : label}
          </FormLabel>
        )
      }
      {fields && fields.map((nestedField) => {
        const nestedFieldName = `${name}.${nestedField.name}`;
        return (
          <Field
            onChange={onChange}
            parent={name}
            value={data && data[nestedFieldName]}
            { ...nestedField }
          />
        );
      })}
    </FormGroup>
  );
};

const ArrayField = (props) => {
  const { value, label } = props;
  const subFieldCount = Array.isArray(value) ? value.length : 1;
  const [counter, setCounter] = useState(subFieldCount);
  const [formData, setFormData] = useState();
  let fieldProps = {...props};
  delete fieldProps.multiple;
  delete fieldProps.label;
  const addField = () => {
    setCounter(counter + 1);
  };
  const removeField = (fieldName, fieldIndex) => {
    const parsedValues = unflatten(fieldProps.data, {
      delimiter: '.'
    });

    const fieldNameParts = fieldName.split('.');
    let removeFieldPath = '';
    fieldNameParts.map((fieldNamePart, index) => {
      const last = index === fieldNameParts.length - 1;
      if (last) {
        parsedValues[removeFieldPath].splice(fieldIndex, 1);
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

    fieldProps.data = finalValues;
    setFormData(finalValues);
    setCounter(counter - 1);
  };

  fieldProps.data = (formData && Object.keys(formData).length > 0) ? formData : fieldProps.data;
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
  const { helptext, fieldName, data } = props;

  return (helptext !== undefined) ? (
    <FormHelperText id={`${fieldName}-help-text`}>
      {(typeof helptext === 'function') ? helptext(data) : helptext}
    </FormHelperText>
  ) : null;
};

const FieldHelpLink = (props) => {
  const classes = useStyles();
  const { helplink, fieldName, data } = props;

  return (helplink !== undefined) ? (
    <FormHelperText
      id={`${fieldName}-help-link`}
      classes={{
        root: classes.helperTextLink
      }}
    >
      {(typeof helplink === 'function') ? helplink(data) : helplink}
    </FormHelperText>
  ) : null;
};

const FieldError = (props) => {
  const { data, title, error, errorName, errorMessage } = props;
  return (error) ? (
    <FormHelperText id={errorName}>
      {(typeof title === 'function') ? title(data) : title || errorMessage}
    </FormHelperText>
  ) : null;
};

export default function Field (props) {
  const classes = useStyles();

  const {
    data, type, name, label, helptext, multiple,
    prefix, placeholder, disabled, options, value, suffix, required,
    errorMessage, helplink, title, description, fields, parent, onChange, ...restProps
  } = props;

  // More properties handled in useEffect
  // format, disablePast, disableFuture, disableDate, openTo, min, max, readonly, maxlength, minlength, step
  const [error, setError] = React.useState(false);
  // React.useEffect(() => {
  //   console.log('Inside Use Effect', restProps);
  //   (async () => {
  //     if (fieldProps === undefined) {
  //       const inputProps = await getInputProps(restProps, data);
  //       console.log('inputProps', inputProps);
  //       setFieldProps(inputProps);
  //     }
  //   })();
  // }, [restProps]);

  // console.log('fieldProps', fieldProps);

  const fieldName = `${ parent ? `${parent}.${name}` : name }`;
  const fieldErrorName = `${fieldName}-error-text`;

  let fieldKey = `form-control-${fieldName}`;
  let arrayType = ['multiselect', 'checkbox'];
  let field = '';
  let fieldOptions = options || [];
  let fieldValue = value;
  let fieldType = type;

  if (data !== undefined && data !== null && data[name] !== undefined && data[name] !== null) {
    fieldValue = data[name] ;
    fieldValue = (typeof fieldValue === 'function') ? fieldValue(data) : fieldValue;
  } else if (value !== undefined && typeof value === 'function') {
    fieldValue = value(data);
  } else if (value !== undefined) {
    fieldValue = value;
  } else if (arrayType.indexOf(type) > -1 || multiple) {
    fieldValue = [];
  }

  if (Array.isArray(options)) {
    fieldOptions = options;
  } else if (typeof options === 'function') {
    let optionsFn = options(data);
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

  if (fieldType !== 'checkbox' && multiple) {
    return (
      <ArrayField {...props} />
    );
  }

  React.useEffect(() => {
    (async () => {
      if (props.error !== undefined) {
        const fieldErrorFlag = (typeof props.error === 'function') ? props.error(data) : (props.error || false);
        setError(fieldErrorFlag);
      }
    })();
  });

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
      setError(true);
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
      if (error) {
        setError(false);
      }
      onChange && onChange(name, value, submit);
      // this.setState({ error: false }, () => {
      //   this.props.onChange && this.props.onChange(name, value, submit);
      // });
    } else {
      // this.setState({ error: true });
      setError(true);
    }
  }

  const updatedProps = Object.assign({}, props, {
    value: fieldValue
  });

  switch (fieldType) {
    case 'radio':
      field = (
        <FormControl
          component='fieldset'
          required={required}
          className={classes.textField}
          error={error}
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
            data={data}
            options={fieldOptions}
            onChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldError
              data={data}
              title={title}
              error={error}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
          }
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
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
              label={(typeof placeholder === 'function') ? placeholder(data) : placeholder}
            />
          </FormGroup>
          {
            <FieldError
              data={data}
              title={title}
              error={error}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
          }
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
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
            {(typeof prefix === 'function') ? prefix(data) : prefix}
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
            {(typeof suffix === 'function') ? suffix(data) : suffix}
          </FormLabel>
        ) : null}
        {
          <FieldHelpText
            data={data}
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
          error={error}
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
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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
          error={error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Select
            key={fieldKey}
            data={data}
            onChange={handleChange}
            {...updatedProps}
          />
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'multiselect':
      field = (
        <FormControl
          // className={classes.formControl}
          error={error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Select
            multiple
            key={name}
            id={name}
            name={name}
            label={label}
            value={(fieldValue === '' || fieldValue === undefined) ? [] : fieldValue}
            onChange={handleChange}
            margin='dense'
            required={required}
            disabled={disabled}
            input={<Input id='select-multiple-chip' />}
            renderValue={selected => (
              <div className={classes.chips}>
                {
                  selected.map(value => {
                    let selectedOption = {};
                    if (typeof value === 'object') {
                      selectedOption = value;
                    } else {
                      selectedOption = fieldOptions.find(fieldOption =>
                        fieldOption.value === value
                      );
                    }

                    return <Chip key={selectedOption.value} label={selectedOption.label} className={classes.chip} />
                  })
                }
              </div>
            )}
            MenuProps={MenuProps}
          >
            {fieldOptions.map(fieldOption => {
              return (
                <MenuItem
                  key={`${name}-${fieldOption.value}`}
                  value={fieldOption.value}
                >
                  {fieldOption.label}
                </MenuItem>
              )
            })}
          </Select>
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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
          error={error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Range
            data={data}
            handleChange={handleChange}
            {...updatedProps}
          />
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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
          error={error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          { <FieldLabel label={label} /> }
          <Checkbox
            data={data}
            error={error}
            aria-describedby={fieldErrorName}
            key={fieldKey}
            value={fieldValue}
            onChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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
          error={error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <DateField
            data={data}
            handleChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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
          error={(typeof error === 'function') ? error(data) : error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <NumberField
            data={data}
            value={fieldValue}
            handleChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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
          error={(typeof error === 'function') ? error(data) : error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <Autocomplete
            key={fieldKey}
            data={data}
            handleChange={handleChangeData}
            {...updatedProps}
          />
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
              errorName={fieldErrorName}
              errorMessage={errorMessage}
            />
          }
        </FormControl>
      );
      break;
    case 'file':
      field = (
        <File
          key={`file-${name}`}
          {...updatedProps}
        />
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
          error={error}
          aria-describedby={fieldErrorName}
          key={fieldKey}
        >
          <InputField
            data={data}
            handleChange={handleChange}
            {...updatedProps}
          />
          {
            <FieldHelpText
              data={data}
              helptext={helptext}
              fieldName={fieldName}
            />
          }
          {
            <FieldHelpLink
              data={data}
              helplink={helplink}
              fieldName={fieldName}
            />
          }
          {
            <FieldError
              data={data}
              title={title}
              error={error}
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