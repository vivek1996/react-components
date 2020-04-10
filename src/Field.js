import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

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

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';

import amber from '@material-ui/core/colors/amber';
import Range from "./Field/Range";
import Select from "./Field/Select";
import Toggle from "./Field/Toggle";
import NumberField from "./Field/Number";
import Radio from "./Field/Radio";
import Checkbox from "./Field/Checkbox";
import File from "./Field/File";
import InputField from "./Field/Input";
import Autocomplete from "./Field/Autocomplete";

import _ from 'lodash';

import Grid from '@material-ui/core/Grid';

import AddCircle from '@material-ui/icons/AddCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';

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

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  searchRoot: {
    color: 'inherit',
    width: '100%',
  },
  searchInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 4,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
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
    marginTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit
  },
  formControl: {
    // maxWidth: '200px'
  },
  formGroup: {
    // maxWidth: '200px'
  },
});

function Description(props) {
  return (
    <div 
      className="description" 
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
      if(last) {
        parsedValues[removeFieldPath].splice(fieldIndex, 1);
      } else {
        if(isNaN(fieldNamePart)) {
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
        if(isNaN(lastPart)) {
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

class Field extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps = (nextProps) => {
    let tempNextProps = {};
    tempNextProps.data = (typeof nextProps.data === "function") ? nextProps.data() : nextProps.data;

    this.setState(Object.assign({}, nextProps, tempNextProps));
  }

  checkFormat = (type, value, pattern) => {
    if(value.length > 0) {
      let re = '';
      switch(type) {
        case 'tel':
          re = (pattern) ? pattern : /^[0-9\b]+$/;
          break;
        default:
          re = (pattern) ? pattern : '';
          break;
      }
      
      return (re.length > 0 || typeof re === "object") ? re.test(value) : true;
    } else {
      return true;
    }
  }

  handleChange = (event) => {
    const { name, value, type, checked, pattern } = event.target;
    let fieldValue = (type === 'checkbox') ? checked : value;
    let formatFlag = true;
    if(type === 'tel') {
      formatFlag = this.checkFormat(type, value, pattern);
    }

    if(formatFlag) {
      this.handleChangeData(name, fieldValue);
    } else {
      this.setState({ error: true });
    }
  }

  handleChangeData = (name, value, submit = true) => {
    const { format, type, decimal } = this.props;
    let formatFlag = true;
    if (type === 'date') {
      value = (format) ? value.format(format) :  value.format("YYYY-MM-DD");
    }

    if (type === 'range') {
      value = (isNaN(value) || typeof value === 'string') ? value : value.toFixed((decimal) ? decimal : 2);
    }

    if (type === 'tel') {
      formatFlag = this.checkFormat(type, value);
    }

    if (formatFlag) {
      this.setState({ error: false }, () => {
        this.props.onChange && this.props.onChange(name, value, submit);
      });
    } else {
      this.setState({ error: true });
    }
  }

  render = () => {
    const props = this.props;
    const { classes } = props;
    const { 
      data, type, name, label, helptext, error, multiple,
      prefix, placeholder, disabled, options, value, suffix, required, format,
      disablePast, disableFuture, disableDate, openTo, min, max, readonly, 
      title, maxlength, minlength, step, description, fields, parent
    } = this.state;

    const fieldName   = `${ parent ? `${parent}.${name}` : name }`;
    const fieldLabel = (label !== undefined) ? (
      <FormLabel component="legend">{label}</FormLabel>
    ) : null;
  
    const fieldHelpText = (props.helptext !== undefined) ? (
      <FormHelperText id={`${fieldName}-help-text`}>
        {(typeof props.helptext === 'function') ? props.helptext(data) : props.helptext}
      </FormHelperText>
    ) : null;

    const fieldHelpLink = (props.helplink !== undefined) ? (
      <FormHelperText 
        id={`${fieldName}-help-link`}
        classes={{
          root: classes.helperTextLink
        }}
      >
        {(typeof props.helplink === 'function') ? props.helplink(this, data) : props.helplink}
      </FormHelperText>
    ) : null;

    const fieldErrorName  = `${fieldName}-error-text`;
    const fieldErrorData  = (typeof props.error === 'function') ? props.error(data) : (props.error || false);
    const fieldError      = (fieldErrorData) ? (
      <FormHelperText id={fieldErrorName}>
        {(typeof props.title === 'function') ? props.title(data) : props.title || props.errorMessage}
      </FormHelperText>
    ) : null;

    let fieldKey = `form-control-${fieldName}`;
    let arrayType = ["multiselect", "checkbox"];
    let field = '';
    let fieldOptions = options;
    let fieldValue = "";
    let fieldType = type;

    if(data !== undefined && data !== null && data[name] !== undefined && data[name] !== null) {
      fieldValue = data[name] ;
      fieldValue = (typeof fieldValue === 'function') ? fieldValue(data) : fieldValue;
    } else if(value !== undefined && typeof value === 'function') {
      fieldValue = value(data);
    } else if(value !== undefined) {
      fieldValue = value;
    } else if(arrayType.indexOf(type) > -1 || multiple) {
      fieldValue = [];
    }

    if(Array.isArray(options)) {
      fieldOptions = options;
    } else if(typeof options === 'function') {
      let optionsFn = options(data);
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          fieldOptions = options;
        });
      } else {
        fieldOptions = optionsFn;
      }
    }

    if(fieldType === undefined) {
      if(fieldOptions.length > 0) {
        if(multiple) {
          fieldType = 'checkbox';
        } else {
          fieldType = 'radio';
        }
      } else if (fields && fields.length > 0) {
        fieldType = 'nested';
      }
    }

    if(fieldType !== 'checkbox' && multiple) {
      return (
        <ArrayField {...props} />
      );
    }

    const updatedProps = Object.assign({}, this.props, {
      value: fieldValue
    });

    switch(fieldType) {
      case 'radio':
        field = (
          <FormControl 
            component="fieldset" 
            required 
            className={classes.textField} 
            key={fieldKey}
          >
            { fieldLabel }
            {
              (description) ? (
                <Description html={description} />
              ) : null
            }
            <Radio
              data={data}
              value={fieldValue}
              options={fieldOptions}
              onChange={this.handleChangeData}
              {...updatedProps}
            />
          </FormControl>
        )
        break;
      case 'boolean':
        field = (
          <FormControl 
            key={fieldKey}
          >
            { fieldLabel }
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    id={name}
                    name={name}
                    value={fieldValue}
                    onChange={this.handleChange}
                    disabled={(disabled) ? true : false}
                    checked={fieldValue}
                  />
                }
                label={(typeof placeholder === 'function') ? placeholder(data) : placeholder}
              />
            </FormGroup>
            { fieldError }
            { fieldHelpText }
            { fieldHelpLink }
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
            label={"helllo"}
            name={name}
            value={fieldValue}
            onChange={this.handleChange}
            disabled={(disabled) ? true : false}
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
          { fieldHelpText }
        </FormGroup>
        break;
      case 'toggle':
        field = (
          <FormControl 
            className={classes.formControl} 
            error={fieldErrorData} 
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <Toggle
              // onChange={this.handleToggleChange}
              onChange={this.handleChangeData}
              key={name}
              name={name}
              options={fieldOptions}
              {...updatedProps}
            />
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
          </FormControl>
        );
        break;
      case 'select':
        field = (
          <FormControl
            // className={classes.formControl} 
            error={fieldErrorData}
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <Select
              key={fieldKey}
              data={data}
              onChange={this.handleChange}
              {...updatedProps}
            />
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
          </FormControl>
        );
        break;
      case 'multiselect':
        field = (
          <FormControl
            // className={classes.formControl} 
            error={fieldErrorData}
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
              onChange={this.handleChange}
              margin="dense"
              required={(required) ? true : false}
              disabled={(disabled) ? true : false}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {
                    selected.map(value => {
                      let selectedOption = {};
                      if(typeof value === 'object') {
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
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
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
            onChange={this.handleChange}
            required={(required) ? true : false}
          />
        );
        break;
      case 'range':
        field = (
          <FormControl
            // className={classes.formControl} 
            error={fieldErrorData}
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <Range
              data={data}
              handleChange={this.handleChange}
              {...updatedProps}
            />
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
          </FormControl>
        );
        break;
      case 'checkbox':
        field = (
          <Checkbox
            data={data}
            error={fieldErrorData} 
            aria-describedby={fieldErrorName}
            key={fieldKey}
            value={fieldValue}
            onChange={this.handleChangeData}
            {...updatedProps}
          />
        );
        break;
      case 'date':
        field = (
          <FormControl 
            className={classes.formControl} 
            error={fieldErrorData} 
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                key={name}
                id={name}
                name={name}
                label={label}
                placeholder={placeholder}
                className={classes.textField}
                value={(fieldValue) ? fieldValue : null}
                openTo={(openTo) ? openTo : 'day'}
                views={["year", "month", "day"]}
                // onChange={date => this.handleDateChange(name, date)}
                onChange={date => this.handleChangeData(name, date)}
                margin="normal"
                format={(format) ? format : 'DD/MM/YYYY'}
                required={(required) ? true : false}
                disabled={(disabled) ? true : false}
                disablePast={(disablePast) ? disablePast : false}
                shouldDisableDate={(typeof disableDate === 'function') 
                  ? (day) => {
                    return disableDate(day, data);
                  } : null
                }
                disableFuture={(disableFuture) ? disableFuture : false}
                helperText={(typeof helptext === 'function') ? helptext(data) : helptext}
                minDate={(typeof min === 'function') ? min(data) : min}
                maxDate={(typeof max === 'function') ? max(data) : max}
                InputProps={{ 
                  disabled: (typeof disabled === 'function') ? disabled(data) : disabled,
                  readOnly: (typeof readonly === 'function') ? readonly(data) : readonly,
                  startAdornment: (prefix) ? (<InputAdornment position="start">{prefix}</InputAdornment>) : null,
                  endAdornment: (suffix) ? (<InputAdornment position="end">{suffix}</InputAdornment>) : null,
                  inputProps: {
                    title: (typeof title === 'function') ? title(data) : title, 
                    min: (typeof min === 'function') ? min(data) : min, 
                    max: (typeof max === 'function') ? max(data) : max,
                    maxLength: (typeof maxlength === 'function') ? maxlength(data) : maxlength,
                    minLength: (typeof minlength === 'function') ? minlength(data) : minlength,
                    step: (typeof step === 'function') ? step(data) : step
                  }
                }}
              />
            </MuiPickersUtilsProvider>
            
            { fieldError }
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
              handleChange={this.handleChangeData}
              {...updatedProps}
            />
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
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
              handleChange={this.handleChangeData}
              {...updatedProps}
            />
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
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
            error={fieldErrorData} 
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <InputField
              data={data}
              handleChange={this.handleChange}
              {...updatedProps}
            />
            { fieldHelpText }
            { fieldHelpLink }
            { fieldError }
          </FormControl>
        );
        break;
    }

    return field;
  }
}

Field.defaultProps = {};

Field.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Field);