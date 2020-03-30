import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';

import _ from 'lodash';

import Snackbar from "./Snackbar";
import Toolbar from "./Toolbar";
import Field from "./Field";

const flatten = require('flat');
const { unflatten } = require('flat');

const styles = theme => ({
  formWraper: {
    width: '100%'
  },
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
  }
});

const reducer = (accumulator, currentValue) => {
  accumulator[currentValue.name] = "";
  return accumulator;
}

const defaultDataReducer = (accumulator, currentValue) => {
  if(currentValue && currentValue.hasOwnProperty('name') && accumulator && !accumulator[currentValue.name] && currentValue.value) {
    accumulator[currentValue.name] = (typeof currentValue.value === 'function') ? currentValue.value(accumulator) : currentValue.value;
  }
  
  return accumulator;
}

class EnhancedForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false, success: false, snackBarOpen: false,
      ...props
    };
  }

  componentDidMount = () => {
    const { fields, data } = this.state;
    let defaultFieldValue = fields.reduce(defaultDataReducer, data);
    this.setState({
      data: Object.assign({}, data, defaultFieldValue)
    });
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

      if(validateFlag && field.error) {
        validateFlag = !((typeof field.error === "function") ? field.error(formData) : field.error);
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

  getField = (name) => {
    let formFields = this.state.fields;
    const nameParts = name ? name.split('.') : [];
    let formField = {};
    nameParts.map((namePart, index) => {
      if(Number.isNaN(namePart)) {
        formField = _.find(formFields, {name: namePart});
      }

      const last = index === nameParts.length - 1;
      if(!last) {
        formFields = formField.fields;
      }
    });

    return formField;
  }

  getDependentFields = (fieldName, fieldValue) => {
    let currentField    = this.getField(fieldName);
    let dependentFields = null;
    if(currentField.dependencies) {
      let fields        = (currentField.dependent) ? this.state.fields : this.props.fields;
      if(currentField.dependencies[fieldValue] !== undefined) {
        dependentFields = currentField.dependencies[fieldValue];
      } else if(currentField.dependencies["*"] !== undefined) {
        dependentFields = currentField.dependencies["*"];
      } else {
        dependentFields = [];
      }

      let fieldNameArr  = Object.keys(fields.reduce(reducer, {}));
      dependentFields   = dependentFields.filter(field => fieldNameArr.indexOf(field.name) === -1);

      dependentFields   = dependentFields.map(dependentField => {
        dependentField.dependent = true;
        return dependentField;
      });

      dependentFields   = fields.concat(dependentFields);
    }

    return dependentFields;
  }
  
  handleFieldChange = (fieldName, fieldValue, submit = true) => {
    this.setState((state, props) => {
      let updatedState  = {};
      let data          = state.data;
      let dependentFields   = this.getDependentFields(fieldName, fieldValue);
      if(dependentFields) {
        updatedState.fields   = dependentFields;
        let defaultFieldValue = dependentFields.reduce(defaultDataReducer, data);
        updatedState.data     = Object.assign({}, data, defaultFieldValue);
      } else {
        updatedState.data     = data;
      }

      updatedState.data = (updatedState.data) ? {
        ...updatedState.data,
        [fieldName]: fieldValue
      } : {
        [fieldName]: fieldValue
      };

      return updatedState;
    }, () => {
      if(submit && this.state.loadOnChange && !this.state.loading) {
        this.submitAction();
      }
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    // this.submitAction(this.state.data);
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
            if(!field.hasOwnProperty('error') || (field.hasOwnProperty('error') && typeof field.error === 'boolean'))
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
        const parsedFields = unflatten(this.state.data, {
          delimiter: '.'
        });
        console.log('parsedFields', parsedFields);
        this.state.onSubmit(parsedFields, this);
      }
    });
  }

  render = () => {
    const { classes, title, container } = this.props;
    const { data, fields, buttons, loading, success } = this.state;

    const initialValues = data ? flatten(data, {
      delimiter: '.'
    }) : {};
    console.log('initialValues', initialValues);
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
      [classes.button]: !success,
    });

    const containerClass = classNames(container && classes.container);
    
    return (
      <div className={classes.formWraper}>
        {(title) ? <Toolbar title={title} /> : ""}
        <form 
          onSubmit={this.handleSubmit} 
          autoComplete="off" 
          noValidate={(this.props.novalidate) ? this.props.novalidate : false}
        >
          <div className={containerClass} >
            {fields.map(formField => {
              return (
                <Field 
                  data={initialValues} 
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
                  let disable = (typeof formButton.disable === "function") ? formButton.disable(data, this) : formButton.disable;
                  field = (
                    <Button 
                      variant={(formButton.variant) ? formButton.variant : "contained"}
                      color={(formButton.color) ? formButton.color : "secondary"}
                      className={buttonClassname} 
                      onClick={(e) => formButton.action(this, data, e, btnKey)} 
                      key={btnKey}
                      disabled={disable || (this.state[btnKey] && (this.state[btnKey].disabled || this.state[btnKey].loading)) || success || loading || formButton.disabled}
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
          </div>
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
  buttons: [],
  container: true,
  loading: false, 
  success: false, 
  snackBarOpen: false
};

EnhancedForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedForm);
