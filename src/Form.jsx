import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';

import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';

import amber from '@material-ui/core/colors/amber';
import { Snackbar, Toolbar, Card } from "./";
import AutoComplete from "./Form/AutoComplete";
import AutoSuggest from "./Form/AutoSuggest";
import Range from "./Form/Range";
import Select from "./Form/Select";
import Toggle from "./Form/Toggle";
import DateRange from "./Form/DateRange";

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

const styles = theme => ({
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
  button: {
    margin: theme.spacing.unit,
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
  buttonSuccess: {
    margin: theme.spacing.unit,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonWrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    zIndex: 10000
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

const reducer = (accumulator, currentValue) => {
  accumulator[currentValue.name] = "";
  return accumulator;
}

class EnhancedForm extends React.Component {
  state = {loading: false, success: false, snackBarOpen: false };
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps = (nextProps) => {
    let tempNextProps = {};
    tempNextProps.data = (typeof nextProps.data === "function") ? nextProps.data() : nextProps.data;

    this.setState(Object.assign({}, nextProps, tempNextProps));
  }

  handleSnackBarClose = (event, reason) => {
    this.setState({ snackBarOpen: false, snackBarMessage: null });
  };

  handleCheckboxChange = event => {
    const { name, value, checked } = event.target;

    const { data } = this.state;
    const { fields } = this.props;
    let fieldValue = checked;
    let prevValue = ((data[name] === undefined) ? [] : data[name]);

    let currentField = this.state.fields.find(function(field) {
      return field.name === name;
    });

    if(checked) {
      if(currentField.dependencies && currentField.dependencies[value] !== undefined) {
        this.setState({
          fields: fields.concat(currentField.dependencies[value])
        });
      }

      this.setState((state, props) => {
        let prevFieldValue = ((state.data[name] === undefined) ? [] : state.data[name]);
        if(Array.isArray(prevFieldValue)) {
          let updatedArray = prevFieldValue.concat([value]);
          let uniqueArray = updatedArray.filter(function(item, pos) {
            return updatedArray.indexOf(item) === pos; 
          });

          return {
            data: {
              ...data,
              [name]: uniqueArray
            }
          }
        } else {
          return {
            data: {
              ...data,
              [name]: fieldValue
            }
          }
        }
      }, () => {
        if (this.state.loadOnChange && !this.state.loading) {
          this.submitAction(this.state.data);
        }
      });
    } else {
      this.setState((state, props) => {
        let prevFieldValue = ((state.data[name] === undefined) ? [] : state.data[name]);
        if(Array.isArray(prevFieldValue)) {
          let filteredPrevValue = prevValue.filter(function(item, pos) {
              return prevValue.indexOf(value) !== pos; 
          });

          return  {
            data: {
              ...data,
              [name]: filteredPrevValue
            }
          }
        } else {
          return {
            data: {
              ...data,
              [name]: fieldValue
            }
          }
        }
      }, () => {
        if (this.state.loadOnChange && !this.state.loading) {
          this.submitAction(this.state.data);
        }
      });
    }
  }

  handleSliderChange = (name, value) => {
    const { data } = this.state;
    const { fields } = this.props;
    let fieldValue = value;

    this.setState((state, props) => {
      let updatedState = {};
      let currentField = state.fields.find(function(field) {
        return field.name === name;
      });
      
      if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
        updatedState.fields = fields.concat(currentField.dependencies[fieldValue]);
      }

      updatedState.data = {
        ...data,
        [name]: (isNaN(fieldValue) || typeof fieldValue === 'string') ? fieldValue : fieldValue.toFixed((currentField.decimal) ? currentField.decimal : 2)
      }

      return updatedState;
    }, () => {
      if (this.state.loadOnChange &&  !this.state.loading) {
        this.submitAction(this.state.data);
      }
    });
  };

  validateValue = (field, value, formData) => {
    let validateFlag = true;
    if(value !== undefined && value !== null && value !== "") {
      if(validateFlag && field.minlength) {
        validateFlag = (value.length >= field.minlength) ? true : false;
      }

      if(validateFlag && field.maxlength) {
        validateFlag = (value.length <= field.maxlength) ? true : false;
      }

      let re = (field.pattern) ? field.pattern : '';
      if(validateFlag && (re.length > 0 || typeof re === "object")) {
        validateFlag = re.test(value);
      }

      if(validateFlag && field.validate) {
        validateFlag = (typeof field.validate === "function") ? field.validate(formData) : field.validate;
      }

      return validateFlag;
    } else {
      return !validateFlag;
    }
  }

  checkFormat = (field, value) => {
    if(value.length > 0) {
      let re = '';
      switch(field.type) {
        case 'tel':
          re = (field.pattern) ? field.pattern : /^[0-9\b]+$/;
          break;
        default:
          re = (field.pattern) ? field.pattern : '';
          break;
      }
      
      return (re.length > 0 || typeof re === "object") ? re.test(value) : true;
    } else {
      return true;
    }
  }

  getDependentFields = (currentField, fieldValue) => {
    let dependentFields = (currentField.dependencies && (currentField.dependencies[fieldValue] || currentField.dependencies["*"])) || [];

    let fields        = (currentField.dependent) ? this.state.fields : this.props.fields;
    let fieldNameArr  = Object.keys(fields.reduce(reducer, {}));
    let updatedFields = dependentFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
    
    return fields.concat(updatedFields);
  }

  getCurrentField = (name) => {
    return this.state.fields.find(function(field) {
      return field.name === name;
    });
  }

  handleChange = event => {
    const { name, value, type, checked } = event.target;

    const { data } = this.state;
    let fieldValue = value;

    if(type === 'checkbox') {
      fieldValue = checked;
    }

    let currentField = this.getCurrentField(name);
    let formatFlag = true;
    if(currentField.type === 'tel') {
      formatFlag = this.checkFormat(currentField, fieldValue);
    }
    
    if(formatFlag) {
      let updatedFields = this.getDependentFields(currentField, fieldValue);
      // if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
      //   this.setState((state, props) => {
      //     let fields;
      //     if(currentField.dependent) {
      //       fields = state.fields;
      //     } else {
      //       fields = props.fields;
      //     }
  
      //     let newFields     = currentField.dependencies[fieldValue];
      //     let fieldNameArr  = Object.keys(fields.reduce(reducer, {}));
      //     let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
          
      //     return {
      //       fields: fields.concat(updatedFields)
      //     }
      //   });
      // } else if(currentField.dependencies && currentField.dependencies["*"] !== undefined) {
      //   this.setState((state, props) => {
      //     let fields;
      //     if(currentField.dependent) {
      //       fields = state.fields;
      //     } else {
      //       fields = props.fields;
      //     }
  
      //     let newFields = currentField.dependencies["*"];
      //     let fieldNameArr = Object.keys(fields.reduce(reducer, {}));
      //     let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
          
      //     return {
      //       fields: fields.concat(updatedFields)
      //     }
      //   });
      // }
      
      this.setState({
        fields: updatedFields,
        data: {
          ...data,
          [name]: fieldValue
        }
      }, () => {
        if (this.state.loadOnChange &&  !this.state.loading) {
          this.submitAction();
        }
      });
    } else {
      let updatedFields = this.state.fields.map(field => {
        if(field.name === currentField.name) {
          currentField.error = true;
          return currentField;
        } else {
          field.error = false;
          return field;
        }
      });
      
      this.setState({
        fields: updatedFields
      });
    }
  }

  handleDateChange = (name, value) => {
    const { data } = this.state;
    let currentField = this.getCurrentField(name);

    let fieldValue = (currentField.format) ? value.format(currentField.format) :  value.format("YYYY-MM-DD");
    let formatFlag = true;
    if(formatFlag) {
      let updatedFields = this.getDependentFields(currentField, fieldValue);
      
      this.setState({
        fields: updatedFields,
        data: {
          ...data,
          [name]: fieldValue
        }
      }, () => {
        if (this.state.loadOnChange &&  !this.state.loading) {
          this.submitAction();
        }
      });
    } else {
      let updatedFields = this.state.fields.map(field => {
        if(field.name === currentField.name) {
          currentField.error = true;
          return currentField;
        } else {
          field.error = false;
          return field;
        }
      });
      
      this.setState({
        fields: updatedFields
      });
    }
  }

  handleDateRangeChange = (name, fieldValue) => {
    const { data } = this.state;

    let currentField = this.getCurrentField(name);
    let updatedFields = this.getDependentFields(currentField, fieldValue);

    this.setState({
      fields: updatedFields,
      data: {
        ...data,
        [name]: fieldValue
      }
    }, () => {
      if (this.state.loadOnChange &&  !this.state.loading) {
        this.submitAction();
      }
    });
  };
  
  handleChangeFile = event => {
    const { name, value } = event.target;
    const { data } = this.state;
    let fieldValue = value;
    let formatFlag = true;

    let currentField = this.getCurrentField(name);

    if(formatFlag) {
      let updatedFields = this.getDependentFields(currentField, fieldValue);
      
      let reader = new FileReader();
      let file = event.target.files[0];

      reader.onloadend = () => {
        file.data = reader.result;
        this.setState({
          fields: updatedFields,
          data: {
            ...data,
            [name]: file
          }
        }, () => {
          if (this.state.loadOnChange &&  !this.state.loading) {
            this.submitAction();
          }
        });
      }

      reader.readAsDataURL(file)
    } else {
      let updatedFields = this.state.fields.map(field => {
        if(field.name === currentField.name) {
          currentField.error = true;
          return currentField;
        } else {
          field.error = false;
          return field;
        }
      });
      
      this.setState({
        fields: updatedFields
      });
    }
  }

  handleToggleChange = (name, fieldValue) => {
    let currentField = this.getCurrentField(name);
    let updatedFields = this.getDependentFields(currentField, fieldValue);

    this.setState((state, props) => {
      let updatedState = {};
      updatedState.fields = updatedFields;

      if(state.data) {
        state.data[name] = fieldValue;
      }
      
      updatedState.data = (state.data) ? state.data : {
        [name]: fieldValue
      };

      return updatedState;
    }, () => {
      if(this.state.loadOnChange && !this.state.loading) {
        this.submitAction();
      }
    });
  }

  handleAutoSuggestChange = name => (event, { newValue }) => {
    const { data } = this.state;
    let currentField  = this.getCurrentField(name);
    let updatedFields = this.getDependentFields(currentField, newValue);

    this.setState({
      fields: updatedFields,
      data: { 
        ...data, 
        [name]: newValue
      }
    });
  };

  handleAutoSuggestClick = event => {
    const { name, value } = event.target;

    if(event.which === 13) {
      const { data } = this.state;
      this.setState({
        data: {
          ...data, 
          [name]: value
        }
      }, () => {
        if (this.state.loadOnChange) {
          this.submitAction();
        }
      });
    }
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    const { data, fields } = this.state;

    let selectedData = {};
    fields.map(field => {
      let fieldName = field.name;
      selectedData[fieldName] = (suggestion[fieldName] !== undefined) 
           ? suggestion[fieldName] 
           : ((typeof field.value === 'function') ? field.value(suggestion) : '') ;
      return false;
    });
    
    this.setState({
      data: {
        ...data, 
        ...selectedData
      }
    }, () => {
      if (this.state.loadOnChange) {
        this.submitAction(this.state.data);
      }
    });
  }

  handleCheckboxChange = event => {
    const { name, value, checked } = event.target;

    const { data } = this.state;
    let fieldValue = checked;
    let prevValue = ((data[name] === undefined) ? [] : data[name]);

    let currentField = this.getCurrentField(name);

    if(checked) {
      let updatedFields = this.getDependentFields(currentField, value);

      this.setState((state, props) => {
        let prevFieldValue = ((state.data[name] === undefined) ? [] : state.data[name]);
        if(Array.isArray(prevFieldValue)) {
          let updatedArray = prevFieldValue.concat([value]);
          let uniqueArray = updatedArray.filter(function(item, pos) {
            return updatedArray.indexOf(item) === pos; 
          });

          return {
            fields: updatedFields,
            data: {
              ...data,
              [name]: uniqueArray
            }
          }
        } else {
          return {
            fields: updatedFields,
            data: {
              ...data,
              [name]: fieldValue
            }
          }
        }
      }, () => {
        if (this.state.loadOnChange && !this.state.loading) {
          this.submitAction(this.state.data);
        }
      });
    } else {
      this.setState((state, props) => {
        let prevFieldValue = ((state.data[name] === undefined) ? [] : state.data[name]);
        if(Array.isArray(prevFieldValue)) {
          let filteredPrevValue = prevValue.filter(function(item, pos) {
              return prevValue.indexOf(value) !== pos; 
          });

          return  {
            data: {
              ...data,
              [name]: filteredPrevValue
            }
          }
        } else {
          return {
            data: {
              ...data,
              [name]: fieldValue
            }
          }
        }
      }, () => {
        if (this.state.loadOnChange && !this.state.loading) {
          this.submitAction(this.state.data);
        }
      });
    }
  }

  handleSliderChange = (name, value) => {
    const { data } = this.state;
    let fieldValue = value;

    let currentField  = this.getCurrentField(name);
    let updatedFields = this.getDependentFields(currentField, fieldValue);

    this.setState((state, props) => {
      let updatedState = {};
      updatedState.fields = updatedFields;

      updatedState.data = {
        ...data,
        [name]: (isNaN(fieldValue) || typeof fieldValue === 'string') ? fieldValue : fieldValue.toFixed((currentField.decimal) ? currentField.decimal : 2)
      }

      return updatedState;
    }, () => {
      if (this.state.loadOnChange &&  !this.state.loading) {
        this.submitAction(this.state.data);
      }
    });
  };
  
  handleSubmit = event => {
    event.preventDefault();

    this.submitAction(this.state.data);
  }

  submitAction = () => {
    let formValidationFlag = true;
    this.setState((state, props) => {
      let formData = state.data;
      let updatedState = {};
      let updatedFields = state.fields.map(field => {
        if(field.required && (field.readonly === undefined || field.readonly)) {
          if(this.validateValue(field, formData[field.name], formData)) {
            field.error = false;
            return field;
          } else {
            formValidationFlag = false;
            field.error = true;
            return field;
          }
        } else {
          field.error = false;
          return field;
        }
      });

      updatedState.fields = updatedFields;

      if(!state.loading && formValidationFlag) {
        updatedState.success = false;
        updatedState.loading = true;
      }

      return updatedState;
    }, () => {
      if(this.state.loading && formValidationFlag) {
        this.props.submitAction(this.state.data, this);
      }
    });
  }

  render = () => {
    const { classes, title } = this.props;
    const { data, fields, buttons, loading, success } = this.state;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
      [classes.button]: !success,
    });

    return (
      <div>
        {(title) ? <Toolbar title={title} /> : ""}
        <form className={classes.container} onSubmit={this.handleSubmit} autoComplete="off" noValidate={(this.props.novalidate) ? this.props.novalidate : false}>
          {fields.map(formField => {
            let field = '';
            let fieldOptions;
            let fieldValue = "";

            let arrayType = ["multiselect", "checkbox"];
            if(data !== undefined && data !== null && data[formField.name] !== undefined) {
              fieldValue = data[formField.name] ;
              fieldValue = (typeof fieldValue === 'function') ? fieldValue(data) : fieldValue;
            } else if(formField.value && typeof formField.value === 'function') {
              fieldValue = formField.value(data);
            } else if(formField.value) {
              fieldValue = formField.value;
            } else if(arrayType.indexOf(formField.type) > -1 || formField.multiple) {
              fieldValue = [];
            }

            switch(formField.type) {
              case 'radio':
                field = <FormControl component="fieldset" required className={classes.textField} key={`form-control-${formField.name}`}>
                  <FormLabel component="legend">{formField.label}</FormLabel>
                  <RadioGroup
                    aria-label={formField.label}
                    className={classes.group}
                    value={fieldValue}
                    id={formField.name}
                    name={formField.name}
                    onChange={this.handleChange}
                  >
                    {formField.options.map(option => {
                      return (
                        <FormControlLabel 
                          value={option.value} 
                          control={<Radio />} 
                          label={option.label} 
                          disabled={(option.disabled) ? true : false} 
                          key={`${(new Date()).getTime()}-radio-group-${option.label}`}
                      />);
                    })}
                  </RadioGroup>
                </FormControl>
                break;
              case 'boolean':
                field = (
                  <FormControl key={`form-control-${formField.name}`}>
                    {
                      (formField.label) ? (
                        <FormLabel >{formField.label}</FormLabel>
                      ) : null
                    }
                    
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            id={formField.name}
                            name={formField.name}
                            value={fieldValue}
                            onChange={this.handleChange}
                            disabled={(formField.disabled) ? true : false}
                            checked={fieldValue}
                          />
                        }
                        label={(typeof formField.placeholder === 'function') ? formField.placeholder(data) : formField.placeholder}
                      />
                    </FormGroup>
                    
                    {
                      (formField.error) ? (
                        <FormHelperText id={`${formField.name}-error-text`}>
                          {(typeof formField.title === 'function') ? formField.title(data) : formField.title}
                        </FormHelperText>
                      ) : null
                    }

                    {
                      (formField.helptext) ? (
                        <FormHelperText id={`${formField.name}-help-text`}>
                          {(typeof formField.helptext === 'function') ? formField.helptext(data) : formField.helptext}
                        </FormHelperText>
                      ) : null
                    }

                    {
                      (formField.helplink) ? (
                        <FormHelperText 
                          id={`${formField.name}-help-link`}
                          classes={{
                            root: classes.helperTextLink
                          }}
                        >
                          {(typeof formField.helplink === 'function') ? formField.helplink(this, data) : formField.helplink}
                        </FormHelperText>
                      ) : null
                    }
                  </FormControl>
                )
                break;
              case 'switch':
                field = <FormGroup className={classes.formGroup} row>
                  {(formField.prefix) ? (<FormLabel
                    classes={{
                      root: classes.switchLabel
                    }}
                  >{(typeof formField.prefix === 'function') ? formField.prefix(data) : formField.prefix}</FormLabel>) : null}
                  <Switch
                    id={formField.name}
                    label={"helllo"}
                    name={formField.name}
                    value={fieldValue}
                    onChange={this.handleChange}
                    disabled={(formField.disabled) ? true : false}
                    checked={fieldValue}
                  />
                  {(formField.suffix) ? (<FormLabel
                    classes={{
                      root: classes.switchLabel
                    }}
                  >{(typeof formField.suffix === 'function') ? formField.suffix(data) : formField.suffix}</FormLabel>) : null}
                  <FormHelperText
                    classes={{
                      root: classes.helperText
                    }}
                  >{(typeof formField.helperText === 'function') ? formField.helperText(data) : formField.helperText}</FormHelperText>
                </FormGroup>
                break;
              case 'toggle':
                formField = Object.assign({}, formField, {value: fieldValue});
                field = (
                  <Toggle
                    data={data}
                    value={fieldValue}
                    onChange={this.handleToggleChange}
                    {...formField}
                  />
                )
                break;
              case 'toggle-2':
                formField = Object.assign({}, formField, {value: fieldValue});
                field = (
                  <Toggle
                    data={data}
                    value={fieldValue}
                    onChange={this.handleToggleChange}
                    classes={{
                      root: classes.formControlToggle
                    }}
                    {...formField}
                  />
                )
                break;
              case 'select':
                formField = Object.assign({}, formField, {value: fieldValue});
                field = (
                  <Select
                    data={data}
                    value={fieldValue}
                    onChange={this.handleChange}
                    {...formField}
                  />
                );
                break;
              case 'multiselect':
                if(typeof formField.options === 'object') {
                  fieldOptions = formField.options;
                } else if(typeof formField.options === 'function') {
                  fieldOptions = formField.options();
                }

                field = (
                  <Select
                    multiple
                    key={formField.name}
                    id={formField.name}
                    name={formField.name}
                    label={formField.label}
                    value={(fieldValue === '' || fieldValue === undefined) ? [] : fieldValue}
                    onChange={this.handleChange}
                    margin="dense"
                    required={(formField.required) ? true : false}
                    disabled={(formField.disabled) ? true : false}
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
                          key={`${formField.name}-${fieldOption.value}`}
                          value={fieldOption.value}
                        >
                          {fieldOption.label}
                        </MenuItem>
                      )
                    })}
                  </Select>
                );
                break;
              case 'autocomplete':
                if(typeof formField.options === 'object') {
                  fieldOptions = formField.options;
                } else if(typeof formField.options === 'function') {
                  fieldOptions = formField.options();
                }
                
                field = (
                  <AutoComplete
                    multiple
                    key={formField.name}
                    id={formField.name}
                    name={formField.name}
                    label={formField.label}
                    value={fieldValue}
                    onChange={this.handleChange}
                    margin="dense"
                    required={(formField.required) ? true : false}
                    disabled={(formField.disabled) ? true : false}
                    helperText={formField.placeholder}
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
                  />
                );
                break;
              case 'autosuggest':
                if(typeof formField.options === 'object') {
                  fieldOptions = formField.options;
                } else if(typeof formField.options === 'function') {
                  fieldOptions = formField.options();
                } else {
                  fieldOptions = [];
                }

                field = (
                  <FormControl className={classes.formControl} 
                    error={(typeof formField.error === 'function') ? formField.error(data) : formField.error} 
                    aria-describedby={`${formField.name}-error-text`}
                    key={`form-control-${formField.name}`}
                  >
                    <AutoSuggest
                      data={data}
                      key={formField.name}
                      placeholder={formField.placeholder}
                      suggestions={fieldOptions}
                      fetchApi={formField.options}
                      name={formField.name}
                      value={fieldValue}
                      onChange={this.handleAutoSuggestChange}
                      onSelect={this.onSuggestionSelected}
                    />
                    {
                      (formField.error) ? (
                        <FormHelperText id={`${formField.name}-error-text`}>
                          {(typeof formField.title === 'function') ? formField.title(data) : formField.title}
                        </FormHelperText>
                      ) : null
                    }

                    {
                      (formField.helptext) ? (
                        <FormHelperText id={`${formField.name}-help-text`}>
                          {(typeof formField.helptext === 'function') ? formField.helptext(data) : formField.helptext}
                        </FormHelperText>
                      ) : null
                    }

                    {
                      (formField.helplink) ? (
                        <FormHelperText 
                          id={`${formField.name}-help-link`}
                          classes={{
                            root: classes.helperTextLink
                          }}
                        >
                          {(typeof formField.helplink === 'function') ? formField.helplink(this, data) : formField.helplink}
                        </FormHelperText>
                      ) : null
                    }
                  </FormControl>
                );
                break;
              case 'search':
                if(typeof formField.options === 'object') {
                  fieldOptions = formField.options;
                } else if(typeof formField.options === 'function') {
                  fieldOptions = formField.options();
                } else {
                  fieldOptions = [];
                }

                field = (
                  <AutoSuggest
                    key={formField.name}
                    placeholder={(formField.placeholder) ? formField.placeholder : 'Search…'}
                    suggestions={fieldOptions}
                    fetchApi={formField.options}
                    name={formField.name}
                    value={fieldValue}
                    onChange={this.handleAutoSuggestChange}
                    onSelect={this.onSuggestionSelected}
                    onKeyDown={this.handleAutoSuggestClick}
                    disableUnderline={true}
                    classes={{
                      root: classes.searchRoot,
                      input: classes.searchInput,
                    }}
                  />
                );
                break;
              case 'file':
                field = (
                  <TextField
                    key={formField.name}
                    id={formField.name}
                    name={formField.name}
                    label={formField.label}
                    type={formField.type}
                    format={formField.format}
                    placeholder={formField.placeholder}
                    className={classes.textField}
                    onChange={this.handleChangeFile}
                    margin="normal"
                    required={(formField.required) ? true : false}
                    disabled={(formField.disabled) ? true : false}
                    helperText={formField.placeholder}
                  />
                );
                break;
              case 'image':
                field = (
                  <div>
                    {(formField.preview && (typeof formField.value === 'function' || data[formField.name])) ? (
                      <Card media={fieldValue.data} />
                    ) : null}
                    <TextField
                      key={formField.name}
                      id={formField.name}
                      name={formField.name}
                      label={formField.label}
                      type='file'
                      format={formField.format}
                      placeholder={formField.placeholder}
                      className={classes.textField}
                      onChange={this.handleChange}
                      margin="normal"
                      required={(formField.required) ? true : false}
                      disabled={(formField.disabled) ? true : false}
                      helperText={formField.placeholder}
                      InputProps={{ 
                        inputProps: { 
                          accept: "image/*"
                        } 
                      }}
                    />
                  </div>
                );
                break;
              case 'hidden':
                field = (
                  <input
                    key={formField.name}
                    id={formField.name}
                    name={formField.name}
                    type={formField.type}
                    value={fieldValue}
                    onChange={this.handleChange}
                    required={(formField.required) ? true : false}
                  />
                );
                break;
              case 'range':
                formField = Object.assign({}, formField, {value: fieldValue});
                field = (
                  <Range
                    key={`range-${formField.name}`}
                    data={data}
                    value={fieldValue}
                    onChange={this.handleSliderChange}
                    {...formField}
                  />
                );
                break;
              case 'checkbox':
                if(formField.enum) {
                  fieldOptions = formField.enum;
                } else if(formField.options) {
                  fieldOptions = formField.options;
                } else if(typeof formField.options === 'function') {
                  fieldOptions = formField.options();
                }
                
                field = (fieldOptions) ? (
                  <FormControl component="fieldset" required={formField.required} className={classes.textField} key={`form-control-${formField.name}`} error={formField.error} aria-describedby={`${formField.name}-error-text`} >
                    <FormLabel component="legend">{formField.label}</FormLabel>
                    <FormGroup
                      aria-label={formField.label}
                      className={classes.group}
                    >
                      {fieldOptions.map(option => {
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox 
                                onChange={this.handleCheckboxChange} 
                                value={option.value} 
                                name={formField.name}
                                disabled={(option.disabled) ? true : false}
                                checked={(fieldValue.indexOf(option.value.toString()) > -1) ? true : false}
                              />
                            }
                            label={option.label}
                          />
                        );
                      })}
                    </FormGroup>
                    {
                      (formField.error) ? (
                        <FormHelperText id={`${formField.name}-error-text`}>
                          {formField.title}
                        </FormHelperText>
                      ) : null
                    }
                  </FormControl>
                ) : (
                  <FormControl component="fieldset" required={formField.required} className={classes.textField} key={`form-control-${formField.name}`} error={formField.error} aria-describedby={`${formField.name}-error-text`} >
                    <FormGroup
                      aria-label={formField.label}
                      className={classes.group}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox 
                            onChange={this.handleCheckboxChange} 
                            value={formField.value} 
                            name={formField.name}
                            disabled={(formField.disabled) ? true : false}
                            checked={fieldValue}
                          />
                        }
                        label={
                          <Typography variant="caption" >
                            {formField.label}
                          </Typography>
                        }
                      />
                    </FormGroup>
                    {
                      (formField.error) ? (
                        <FormHelperText id={`${formField.name}-error-text`}>
                          {formField.title}
                        </FormHelperText>
                      ) : null
                    }
                  </FormControl>
                );
                break;
              case 'date':
                field = (
                  <FormControl 
                    className={classes.formControl} 
                    error={formField.error} 
                    aria-describedby={`${formField.name}-error-text`}
                    key={`form-control-${formField.name}`}
                  >
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        key={formField.name}
                        id={formField.name}
                        name={formField.name}
                        label={formField.label}
                        placeholder={formField.placeholder}
                        className={classes.textField}
                        value={(fieldValue) ? fieldValue : null}
                        openTo={(formField.openTo) ? formField.openTo : 'day'}
                        views={["year", "month", "day"]}
                        onChange={date => this.handleDateChange(formField.name, date)}
                        margin="normal"
                        format={(formField.format) ? formField.format : 'DD/MM/YYYY'}
                        required={(formField.required) ? true : false}
                        disabled={(formField.disabled) ? true : false}
                        disablePast={(formField.disablePast) ? formField.disablePast : false}
                        shouldDisableDate={(typeof formField.disableDate === 'function') 
                          ? (day) => {
                            return formField.disableDate(day, data);
                          } : null
                        }
                        disableFuture={(formField.disableFuture) ? formField.disableFuture : false}
                        helperText={(typeof formField.helperText === 'function') ? formField.helperText(data) : formField.helperText}
                        minDate={(typeof formField.min === 'function') ? formField.min(data) : formField.min}
                        maxDate={(typeof formField.max === 'function') ? formField.max(data) : formField.max}
                        InputProps={{ 
                          disabled: (typeof formField.disabled === 'function') ? formField.disabled(data) : formField.disabled,
                          readOnly: (typeof formField.readonly === 'function') ? formField.readonly(data) : formField.readonly,
                          startAdornment: (formField.prefix) ? (<InputAdornment position="start">{formField.prefix}</InputAdornment>) : null,
                          endAdornment: (formField.suffix) ? (<InputAdornment position="end">{formField.suffix}</InputAdornment>) : null,
                          inputProps: {
                            title: (typeof formField.title === 'function') ? formField.title(data) : formField.title, 
                            min: (typeof formField.min === 'function') ? formField.min(data) : formField.min, 
                            max: (typeof formField.max === 'function') ? formField.max(data) : formField.max,
                            maxLength: (typeof formField.maxlength === 'function') ? formField.maxlength(data) : formField.maxlength,
                            minLength: (typeof formField.minlength === 'function') ? formField.minlength(data) : formField.minlength,
                            step: (typeof formField.step === 'function') ? formField.step(data) : formField.step
                          }
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    {
                      (formField.error) ? (
                        <FormHelperText id={`${formField.name}-error-text`}>
                          {formField.title}
                        </FormHelperText>
                      ) : null
                    }
                  </FormControl>
                );
                break;
                case 'daterange':
                  field = (
                    <DateRange
                      data={data}
                      value={fieldValue}
                      fields={this.state.fields}
                      onChange={this.handleDateRangeChange}
                      {...formField}
                    />
                  );
                break;
              default:
                if(formField.enum) {
                  fieldOptions = formField.enum;
                } else if(formField.options) {
                  fieldOptions = formField.options;
                } else if(typeof formField.options === 'function') {
                  fieldOptions = formField.options();
                }
                
                field = (fieldOptions) ? (
                  (formField.multiple !== undefined && formField.multiple) ?
                  (
                    <FormControl component="fieldset" required 
                      className={classes.textField} 
                      key={`form-control-${formField.name}`}
                    >
                      <FormLabel component="legend">{formField.label}</FormLabel>
                      <FormGroup
                        aria-label={formField.label}
                        className={classes.group}
                      >
                        {fieldOptions.map(option => {
                          return (
                            <FormControlLabel
                              control={
                                <Checkbox 
                                  onChange={this.handleCheckboxChange} 
                                  value={option.value} 
                                  name={formField.name}
                                  disabled={(option.disabled) ? true : false}
                                  checked={(fieldValue.indexOf(option.value.toString()) > -1) ? true : false}
                                />
                              }
                              label={option.label}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  ) : (
                    <FormControl component="fieldset" required className={classes.textField} key={`form-control-${formField.name}`}>
                      <FormLabel component="legend">{formField.label}</FormLabel>
                      <RadioGroup
                        aria-label={formField.label}
                        className={classes.group}
                        value={fieldValue}
                        id={formField.name}
                        name={formField.name}
                        onChange={this.handleChange}
                      >
                        {fieldOptions.map(option => {
                          return (<FormControlLabel value={option.value} control={<Radio />} label={option.label} disabled={(option.disabled) ? true : false} />);
                        })}
                      </RadioGroup>
                    </FormControl>
                  )
                ) : (
                  <FormControl className={classes.formControl} 
                    error={(typeof formField.error === 'function') ? formField.error(data) : formField.error} 
                    aria-describedby={`${formField.name}-error-text`}
                    key={`form-control-${formField.name}`}
                  >
                    <TextField
                      key={formField.name}
                      id={formField.name}
                      name={formField.name}
                      type={formField.type}
                      label={formField.label}
                      placeholder={formField.placeholder}
                      className={classes.textField}
                      value={fieldValue}
                      onChange={this.handleChange}
                      margin="normal"
                      required={(formField.required) ? true : false}
                      disabled={(formField.disabled) ? true : false}
                      helperText={(typeof formField.helperText === 'function') ? formField.helperText(data) : formField.helperText}
                      InputProps={{ 
                        disabled: (typeof formField.disabled === 'function') ? formField.disabled(data) : formField.disabled,
                        readOnly: (typeof formField.readonly === 'function') ? formField.readonly(data) : formField.readonly,
                        startAdornment: (formField.prefix) ? (<InputAdornment position="start">{formField.prefix}</InputAdornment>) : null,
                        endAdornment: (formField.suffix) ? (<InputAdornment position="end">{formField.suffix}</InputAdornment>) : null,
                        inputProps: {
                          title: (typeof formField.title === 'function') ? formField.title(data) : formField.title, 
                          min: (typeof formField.min === 'function') ? formField.min(data) : formField.min, 
                          max: (typeof formField.max === 'function') ? formField.max(data) : formField.max,
                          maxLength: (typeof formField.maxlength === 'function') ? formField.maxlength(data) : formField.maxlength,
                          minLength: (typeof formField.minlength === 'function') ? formField.minlength(data) : formField.minlength,
                          step: (typeof formField.step === 'function') ? formField.step(data) : formField.step
                        }
                      }}
                    />
                    
                    {
                      (formField.helptext) ? (
                        <FormHelperText id={`${formField.name}-help-text`}>
                          {(typeof formField.helptext === 'function') ? formField.helptext(data) : formField.helptext}
                        </FormHelperText>
                      ) : null
                    }

                    {
                      (formField.helplink) ? (
                        <FormHelperText 
                          id={`${formField.name}-help-link`}
                          classes={{
                            root: classes.helperTextLink
                          }}
                        >
                          {(typeof formField.helplink === 'function') ? formField.helplink(this, data) : formField.helplink}
                        </FormHelperText>
                      ) : null
                    }

                    {
                      (formField.error) ? (
                        <FormHelperText id={`${formField.name}-error-text`}>
                          {(typeof formField.title === 'function') ? formField.title(data) : formField.title}
                        </FormHelperText>
                      ) : null
                    }
                  </FormControl>
                );
                break;
            }

            return field;
          })}

          {buttons.map(formButton => {
            let field = '';
            switch(formButton.type) {
              case 'button':
                const btnKey = `button-${formButton.label.replace(' ', '-')}`;
                field = (
                  <Button 
                    variant={(formButton.variant) ? formButton.variant : "contained"}
                    color={(formButton.color) ? formButton.color : "secondary"}
                    className={buttonClassname} 
                    onClick={(e) => formButton.action(this, data, e, btnKey)} 
                    key={btnKey}
                    disabled={(this.state[btnKey] && this.state[btnKey].disabled) || success || loading || formButton.disabled}
                  >
                    {(this.state[btnKey] && this.state[btnKey].success) ? <CheckIcon /> : ''} {formButton.label}
                    {(this.state[btnKey] && this.state[btnKey].loading) && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                )
                break;
              default:
                field = (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    disabled={loading} 
                    className={buttonClassname} 
                    key={`${(new Date()).getTime()}-button-${formButton.label}`}
                  >
                    {success ? <CheckIcon /> : ''} {formButton.label}
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                )
                break;
            }

            return field;
          })}
        </form>

        <Snackbar 
          variant={this.state.snackBarType}
          snackBarDuration={10000}
          snackBarOpen={this.state.snackBarOpen}
          snackBarMessage={this.state.snackBarMessage}
          onClose={this.handleSnackBarClose}
        />
      </div>
    );
  }
}

EnhancedForm.defaultProps = {
  buttons: []
};

EnhancedForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedForm);
