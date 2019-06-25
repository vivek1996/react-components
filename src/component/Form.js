import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';

import amber from '@material-ui/core/colors/amber';
import { Snackbar, Toolbar } from "./";

import Field from "./Form/Field";

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
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
        this.state.submitAction(this.state.data, this);
      }
    });
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

  // handleChange = event => {
  //   const { name, value, type, checked } = event.target;

  //   const { data } = this.state;
  //   let fieldValue = value;

  //   if(type === 'checkbox') {
  //     fieldValue = checked;
  //   }

  //   let currentField = this.state.fields.find(function(field) {
  //     return field.name === name;
  //   });
    
  //   let formatFlag = true;
  //   if(currentField.type === 'tel') {
  //     formatFlag = this.checkFormat(currentField, fieldValue);
  //   }
    
  //   if(formatFlag) {
  //     if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
  //       this.setState((state, props) => {
  //         let fields;
  //         if(currentField.dependent) {
  //           fields = state.fields;
  //         } else {
  //           fields = props.fields;
  //         }
  
  //         let newFields     = currentField.dependencies[fieldValue];
  //         let fieldNameArr  = Object.keys(fields.reduce(reducer, {}));
  //         let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
          
  //         return {
  //           fields: fields.concat(updatedFields)
  //         }
  //       });
  //     } else if(currentField.dependencies && currentField.dependencies["*"] !== undefined) {
  //       this.setState((state, props) => {
  //         let fields;
  //         if(currentField.dependent) {
  //           fields = state.fields;
  //         } else {
  //           fields = props.fields;
  //         }
  
  //         let newFields = currentField.dependencies["*"];
  //         let fieldNameArr = Object.keys(fields.reduce(reducer, {}));
  //         let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
          
  //         return {
  //           fields: fields.concat(updatedFields)
  //         }
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
  
  handleFieldChange = (name, fieldValue) => {
    this.setState((state, props) => {
      let updatedState = {};
      let currentField = this.getCurrentField(name);
  
      if(currentField.dependencies && currentField.dependencies[fieldValue] !== undefined) {
        let fields;
        if(currentField.dependent) {
          fields = state.fields;
        } else {
          fields = props.fields;
        }

        let newFields     = currentField.dependencies[fieldValue];
        let fieldNameArr  = Object.keys(fields.reduce(reducer, {}));
        let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
        
        updatedState.fields = fields.concat(updatedFields);
      } else if(currentField.dependencies && currentField.dependencies["*"] !== undefined) {
        let fields;
        if(currentField.dependent) {
          fields = state.fields;
        } else {
          fields = props.fields;
        }

        let newFields = currentField.dependencies["*"];
        let fieldNameArr = Object.keys(fields.reduce(reducer, {}));
        let updatedFields = newFields.filter(field => fieldNameArr.indexOf(field.name) === -1);
        
        updatedState.fields = fields.concat(updatedFields);
      }

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
            

            return (
              <Field 
                data={data} 
                onChange={this.handleFieldChange}
                {...formField} 
              />
            );
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
                    disabled={(this.state[btnKey] && (this.state[btnKey].disabled || this.state[btnKey].loading)) || success || loading || formButton.disabled}
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
                    color={(formButton.color) ? formButton.color : "primary"} 
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
