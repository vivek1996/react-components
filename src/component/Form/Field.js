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
import { Card } from "./../";
import AutoComplete from "./AutoComplete";
import AutoSuggest from "./AutoSuggest";
import Range from "./Range";
import Select from "./Select";
// import Toggle from "./Toggle";
import Toggle from "./Toggle";
import DateRange from "./DateRange";
import RichText from "./RichText";

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

class Field extends React.Component {
  state = {loading: false, success: false, snackBarOpen: false };
  constructor(props) {
    super(props);

    this.state = props;
  }

  // componentWillReceiveProps = (nextProps) => {
  //   let tempNextProps = {};
  //   tempNextProps.data = (typeof nextProps.data === "function") ? nextProps.data() : nextProps.data;

  //   this.setState(Object.assign({}, nextProps, tempNextProps));
  // }

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

  // handleSliderChange = (name, value) => {
  //   const { data } = this.state;
  //   const { fields } = this.props;
  //   let fieldValue = value;

  //   this.setState((state, props) => {
  //     let updatedState = {};
  //     let currentField = state.fields.find(function(field) {
  //       return field.name === name;
  //     });
      
  //     if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
  //       updatedState.fields = fields.concat(currentField.dependencies[fieldValue]);
  //     }

  //     updatedState.data = {
  //       ...data,
  //       [name]: (isNaN(fieldValue) || typeof fieldValue === 'string') ? fieldValue : fieldValue.toFixed((currentField.decimal) ? currentField.decimal : 2)
  //     }

  //     return updatedState;
  //   }, () => {
  //     if (this.state.loadOnChange &&  !this.state.loading) {
  //       this.submitAction(this.state.data);
  //     }
  //   });
  // };

  // richTextChange = (name, value) => {
  //   const { data } = this.state;
  //   const { fields } = this.props;
  //   let fieldValue = value;

  //   this.setState((state, props) => {
  //     let updatedState = {};
  //     let currentField = state.fields.find(function(field) {
  //       return field.name === name;
  //     });
      
  //     if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
  //       updatedState.fields = fields.concat(currentField.dependencies[fieldValue]);
  //     }

  //     updatedState.data = {
  //       ...data,
  //       [name]: fieldValue
  //     }
    
  //     return updatedState;
  //   }, () => {
  //     if (this.state.loadOnChange &&  !this.state.loading) {
  //       this.submitAction(this.state.data);
  //     }
  //   });
  // };

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

  handleChangeData = (name, value) => {
    const { format, type, decimal } = this.props;
    let formatFlag = true;
    if(type === 'date') {
      value = (format) ? value.format(format) :  value.format("YYYY-MM-DD");
    }

    if(type === 'range') {
      value = (isNaN(value) || typeof value === 'string') ? value : value.toFixed((decimal) ? decimal : 2);
    }
    
    if(formatFlag) {
      this.setState({ error: false }, () => {
        this.props.onChange(name, value);
      });
    } else {
      this.setState({ error: true });
    }
  }

  // handleDateChange = (name, value) => {
  //   const { data } = this.state;
  //   const { fields } = this.props;
    
  //   let currentField = this.state.fields.find(function(field) {
  //     return field.name === name;
  //   });

  //   let fieldValue = (currentField.format) ? value.format(currentField.format) :  value.format("YYYY-MM-DD");
  //   let formatFlag = true;
  //   if(formatFlag) {
  //     if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
  //       this.setState({
  //         fields: fields.concat(currentField.dependencies[fieldValue])
  //       });
  //     }
      
  //     this.setState({
  //       data: {
  //         ...data,
  //         [name]: fieldValue
  //       }
  //     }, () => {
  //       if (this.state.loadOnChange &&  !this.state.loading) {
  //         this.submitAction();
  //       }
  //     });
  //   } else {
  //     let updatedFields = this.state.fields.map(field => {
  //       if(field.name === currentField.name) {
  //         currentField.error = true;
  //         return currentField;
  //       } else {
  //         field.error = false;
  //         return field;
  //       }
  //     });
      
  //     this.setState({
  //       fields: updatedFields
  //     });
  //   }
  // }
  
  // handleDateRangeChange = (name, fieldValue) => {
  //   const { data } = this.state;

  //   let currentField = this.getCurrentField(name);
  //   let updatedFields = this.getDependentFields(currentField, fieldValue);

  //   this.setState({
  //     fields: updatedFields,
  //     data: {
  //       ...data,
  //       [name]: fieldValue
  //     }
  //   }, () => {
  //     if (this.state.loadOnChange &&  !this.state.loading) {
  //       this.submitAction();
  //     }
  //   });
  // };

  handleChangeFile = event => {
    const { name, value } = event.target;
    
    const { data } = this.state;
    const { fields } = this.props;
    let fieldValue = value;
    let formatFlag = true;

    let currentField = this.state.fields.find(function(field) {
      return field.name === name;
    });
    
    if(formatFlag) {
      if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
        this.setState({
          fields: fields.concat(currentField.dependencies[fieldValue])
        });
      }
      
      let reader = new FileReader();
      let file = event.target.files[0];

      reader.onloadend = () => {
        file.data = reader.result;
        this.setState({
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

  // handleToggleChange = (name, fieldValue) => {
    // this.setState((state, props) => {
    //   let updatedState = {};
    //   let currentField = state.fields.find(function(field) {
    //     return field.name === name;
    //   });
  
    //   if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
    //     let fields;
    //     if(currentField.dependent) {
    //       fields = state.fields;
    //     } else {
    //       fields = props.fields;
    //     }

    //     let newFields     = currentField.dependencies[fieldValue];
    //     let fieldNameArr  = Object.keys(fields.reduce(reducer, {}));
    //     let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
        
    //     updatedState.fields = fields.concat(updatedFields);
    //   } else if(currentField.dependencies && currentField.dependencies["*"] !== undefined) {
    //     let fields;
    //     if(currentField.dependent) {
    //       fields = state.fields;
    //     } else {
    //       fields = props.fields;
    //     }

    //     let newFields = currentField.dependencies["*"];
    //     let fieldNameArr = Object.keys(fields.reduce(reducer, {}));
    //     let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
        
    //     updatedState.fields = fields.concat(updatedFields);
    //   }

    //   if(state.data) {
    //     state.data[name] = fieldValue;
    //   }
      
    //   updatedState.data = (state.data) ? state.data : {
    //     [name]: fieldValue
    //   };

    //   return updatedState;
    // }, () => {
    //   if(this.state.loadOnChange && !this.state.loading) {
    //     this.submitAction();
    //   }
    // });
  // }

  handleAutoSuggestChange = name => (event, { newValue }) => {
    const { data } = this.state;
    const { fields } = this.props;

    let currentField = this.state.fields.find(function(field) {
      return field.name === name;
    });

    if(currentField.dependencies && currentField.dependencies[newValue] !== undefined) {
      this.setState({
        fields: fields.concat(currentField.dependencies[newValue]),
        data: { 
          ...data, 
          [name]: newValue
        }
      });
    } else if(currentField.dependencies && currentField.dependencies["*"] !== undefined) {
      this.setState({
        fields: fields.concat(currentField.dependencies["*"]),
        data: { 
          ...data, 
          [name]: newValue
        }
      });
    } else {
      this.setState({
        data: { 
          ...data, 
          [name]: newValue
        }
      });
    }
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

  submitAction = () => {
    console.log("submtAction");
  }

  render = () => {
    const { classes } = this.props;
    const { 
      data, type, name, label, helptext, helplink, error, multiple,
      prefix, placeholder, disabled, options, value, suffix, required, format,
      disablePast, disableFuture, disableDate, preview, openTo, min, max, readonly, 
      title, maxlength, minlength, step
    } = this.state;

    const fieldLabel = (label !== undefined) ? (
      <FormLabel component="legend">{label}</FormLabel>
    ) : null;
  
    const fieldHelpText = (this.props.helptext !== undefined) ? (
      <FormHelperText id={`${name}-help-text`}>
        {(typeof this.props.helptext === 'function') ? this.props.helptext(data) : this.props.helptext}
      </FormHelperText>
    ) : null;

    const fieldHelpLink = (this.props.helplink !== undefined) ? (
      <FormHelperText 
        id={`${name}-help-link`}
        classes={{
          root: classes.helperTextLink
        }}
      >
        {(typeof this.props.helplink === 'function') ? this.props.helplink(this, data) : this.props.helplink}
      </FormHelperText>
    ) : null;

    const fieldErrorName  = `${name}-error-text`;
    const fieldErrorData  = (typeof this.props.error === 'function') ? this.props.error(data) : (this.props.error || false);
    const fieldError      = (fieldErrorData) ? (
      <FormHelperText id={fieldErrorName}>
        {(typeof this.props.title === 'function') ? this.props.title(data) : this.props.title}
      </FormHelperText>
    ) : null;

    let fieldKey = `form-control-${name}`;
    let arrayType = ["multiselect", "checkbox"];
    let field = '';
    let fieldOptions = [];
    let fieldValue = "";

    if(data !== undefined && data !== null && data[name] !== undefined) {
      fieldValue = data[name] ;
      fieldValue = (typeof fieldValue === 'function') ? fieldValue(data) : fieldValue;
    } else if(value && typeof value === 'function') {
      fieldValue = value(data);
    } else if(value) {
      fieldValue = value;
    } else if(arrayType.indexOf(type) > -1 || multiple) {
      fieldValue = [];
    }

    if(Array.isArray(options)) {
      fieldOptions = options;
    } else if(typeof options === 'function') {
      fieldOptions = options();
    }
    
    switch(type) {
      case 'radio':
        field = (
          <FormControl 
            component="fieldset" 
            required 
            className={classes.textField} 
            key={fieldKey}
          >
            { fieldLabel }
            <RadioGroup
              aria-label={label}
              className={classes.group}
              value={fieldValue}
              id={name}
              name={name}
              onChange={this.handleChange}
            >
              {fieldOptions.map(option => {
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
        this.props = Object.assign({}, this.props, {value: fieldValue});
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
              value={fieldValue} 
              options={fieldOptions}
              // onChange={this.props.onChange}


              {...this.props}
            />
            
            { fieldHelpText }

            { fieldHelpLink }

            { fieldError }
          </FormControl>
          
        )
        break;
      case 'toggle-2':
        this.props = Object.assign({}, this.props, {value: fieldValue});
        field = (
          <Toggle
            data={data}
            value={fieldValue}
            // onChange={this.handleToggleChange}
            onChange={this.handleChangeData}
            classes={{
              root: classes.formControlToggle
            }}
            {...this.props}
          />
        )
        break;
      case 'select':
        this.props = Object.assign({}, this.props, {value: fieldValue});
        field = (
          <Select
            data={data}
            value={fieldValue}
            onChange={this.handleChange}
            {...this.props}
          />
        );
        break;
      case 'multiselect':
        field = (
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
        );
        break;
      case 'autocomplete':
        field = (
          <AutoComplete
            multiple
            key={name}
            id={name}
            name={name}
            label={label}
            value={fieldValue}
            onChange={this.handleChange}
            margin="dense"
            required={(required) ? true : false}
            disabled={(disabled) ? true : false}
            helperText={placeholder}
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
        field = (
          <FormControl 
            className={classes.formControl} 
            error={fieldErrorData} 
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <AutoSuggest
              data={data}
              key={name}
              placeholder={placeholder}
              suggestions={fieldOptions}
              fetchApi={options}
              name={name}
              value={fieldValue}
              onChange={this.handleAutoSuggestChange}
              // onChange={this.props.onChange}
              onSelect={this.onSuggestionSelected}
            />
            
            { fieldError }

            { fieldHelpText }

            { fieldHelpLink }
          </FormControl>
        );
        break;
      case 'search':
        field = (
          <AutoSuggest
            key={name}
            placeholder={(placeholder) ? placeholder : 'Search…'}
            suggestions={fieldOptions}
            fetchApi={options}
            name={name}
            value={fieldValue}
            onChange={this.handleAutoSuggestChange}
            // onChange={this.props.onChange}
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
            key={name}
            id={name}
            name={name}
            label={label}
            type={type}
            format={format}
            placeholder={placeholder}
            className={classes.textField}
            onChange={this.handleChangeFile}
            margin="normal"
            required={(required) ? true : false}
            disabled={(disabled) ? true : false}
            helperText={placeholder}
          />
        );
        break;
      case 'image':
        field = (
          <div>
            {(preview && (typeof value === 'function' || data[name])) ? (
              <Card media={fieldValue.data} />
            ) : null}
            <TextField
              key={name}
              id={name}
              name={name}
              label={label}
              type='file'
              format={format}
              placeholder={placeholder}
              className={classes.textField}
              onChange={this.handleChange}
              onChange={this.props.onChange}
              margin="normal"
              required={(required) ? true : false}
              disabled={(disabled) ? true : false}
              helperText={placeholder}
              InputProps={{ 
                inputProps: { 
                  accept: "image/*"
                } 
              }}
            />
          </div>
        );
        break;
      case 'richtext':
        field = (
          <RichText
            data={data}
            value={fieldValue}
            onChange={this.richTextChange}
            onChange={this.handleChangeData}
            {...this.props}
          />
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
        this.props = Object.assign({}, this.props, {value: fieldValue});
        field = (
          <Range
            key={`range-${name}`}
            data={data}
            value={fieldValue}
            // onChange={this.handleSliderChange}
            onChange={this.handleChangeData}
            {...this.props}
          />
        );
        break;
      case 'checkbox':
        field = (fieldOptions) ? (
          <FormControl component="fieldset" required={required} className={classes.textField} key={fieldKey} error={fieldErrorData} aria-describedby={fieldErrorName} >
            { fieldLabel }
            <FormGroup
              aria-label={label}
              className={classes.group}
            >
              {fieldOptions.map(option => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        onChange={this.handleCheckboxChange} 
                        value={option.value} 
                        name={name}
                        disabled={(option.disabled) ? true : false}
                        checked={(fieldValue.indexOf(option.value.toString()) > -1) ? true : false}
                      />
                    }
                    label={option.label}
                  />
                );
              })}
            </FormGroup>

            { fieldError }
          </FormControl>
        ) : (
          <FormControl component="fieldset" required={required} className={classes.textField} key={fieldKey} error={fieldErrorData} aria-describedby={fieldErrorName} >
            <FormGroup
              aria-label={label}
              className={classes.group}
            >
              <FormControlLabel
                control={
                  <Checkbox 
                    onChange={this.handleCheckboxChange} 
                    value={value} 
                    name={name}
                    disabled={(disabled) ? true : false}
                    checked={fieldValue}
                  />
                }
                label={
                  <Typography variant="caption" >
                    {label}
                  </Typography>
                }
              />
            </FormGroup>
            
            { fieldError }
          </FormControl>
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
      case 'daterange':
        field = (
          <DateRange
            data={data}
            value={fieldValue}
            fields={this.state.fields}
            // onChange={this.handleDateRangeChange}
            onChange={this.handleChangeData}
            {...this.props}
          />
        );
        break;
      default:
        field = (fieldOptions.length > 0) ? (
          (multiple !== undefined && multiple) ?
          (
            <FormControl component="fieldset" required={(required) ? true : false} 
              className={classes.textField} 
              key={fieldKey}
            >
              { fieldLabel }
              <FormGroup
                aria-label={label}
                className={classes.group}
              >
                {fieldOptions.map(option => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox 
                          onChange={this.handleCheckboxChange} 
                          value={option.value} 
                          name={name}
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
            <FormControl 
              component="fieldset" 
              required={(required) ? true : false} 
              className={classes.textField} 
              key={fieldKey}>
              { fieldLabel }
              <RadioGroup
                aria-label={label}
                className={classes.group}
                value={fieldValue}
                id={name}
                name={name}
                onChange={this.handleChange}
              >
                {fieldOptions.map(option => {
                  return (<FormControlLabel value={option.value} control={<Radio />} label={option.label} disabled={(option.disabled) ? true : false} />);
                })}
              </RadioGroup>
            </FormControl>
          )
        ) : (
          <FormControl 
            className={classes.formControl} 
            error={fieldErrorData} 
            aria-describedby={fieldErrorName}
            key={fieldKey}
          >
            <TextField
              key={name}
              id={name}
              name={name}
              type={type}
              label={label}
              placeholder={placeholder}
              className={classes.textField}
              value={fieldValue}
              onChange={this.handleChange}
              margin="normal"
              required={(required) ? true : false}
              disabled={(disabled) ? true : false}
              // helperText={(typeof helptext === 'function') ? helptext(data) : helptext}
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
            
            { 
              fieldHelpText 
            }

            { 
              fieldHelpLink 
            }

            { 
              fieldError 
            }
          </FormControl>
        );
        break;
    }

    return field;
  }
}

Field.defaultProps = {
  buttons: []
};

Field.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(Field);
