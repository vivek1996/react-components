import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';

import _ from 'lodash';

import Toolbar from './Toolbar';
import Field from './Field';

import { validate, isDefined, isFunction } from './lib';

const { unflatten } = require('flat');

const styles = (theme) => ({
  formWraper: {
    width: '100%'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: theme.spacing()
  },
  button: {
    margin: theme.spacing()
  },
  buttonSuccess: {
    margin: theme.spacing(),
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonWrapper: {
    margin: theme.spacing(),
    position: 'relative'
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
  accumulator[currentValue.name] = '';
  return accumulator;
}

const defaultDataReducer = (accumulator, currentValue) => {
  if (currentValue && currentValue.hasOwnProperty('name') && accumulator && !accumulator[currentValue.name] && currentValue.value !== undefined) {
    accumulator[currentValue.name] = (typeof currentValue.value === 'function') ? currentValue.value(accumulator) : currentValue.value;
  }

  return accumulator;
}

const EnhancedForm = (props) => {
  const { classes, title, container, novalidate, data, initialValues,
    fields, buttons, autoSubmit, onSubmit } = props;
  const containerClass = classNames(container && classes.container);

  const initialFormData = data || initialValues;
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);
  const [formFields, setFormFields] = React.useState(fields);

  const buttonClassname = classNames({
    [classes.buttonSuccess]: success,
    [classes.button]: !success
  });

  React.useEffect(() => {
    if (isFunction(initialFormData)) {
      (async () => {
        const tempInitialValues = await initialFormData();
        setFormData(tempInitialValues);
      })();
    }

    const defaultFieldValue = fields.reduce(defaultDataReducer, initialFormData);
    setFormData(Object.assign({}, defaultFieldValue, initialFormData));
  }, []);

  React.useEffect(() => {
    const defaultFieldValue = formFields.reduce(defaultDataReducer, formData);
    setFormData(Object.assign({}, defaultFieldValue, formData));
  }, [formFields]);

  const getField = (name) => {
    let tempFormFields = formFields;
    const nameParts = name ? name.split('.') : [];
    let formField = {};
    nameParts.map((namePart, index) => {
      if (Number.isNaN(namePart)) {
        formField = _.find(tempFormFields, {name: namePart});
      }

      const last = index === nameParts.length - 1;
      if (!last) {
        tempFormFields = formField.fields;
      }
    });

    return formField;
  }

  const getDependentFields = (fieldName, fieldValue) => {
    let currentField = getField(fieldName);
    let dependentFields = [];
    if (currentField.dependencies) {
      let tempFields = (currentField.dependent) ? formFields : fields;
      if (currentField.dependencies[fieldValue] !== undefined) {
        dependentFields = currentField.dependencies[fieldValue];
      } else if (currentField.dependencies['*'] !== undefined) {
        dependentFields = currentField.dependencies['*'];
      }

      let fieldNameArr = Object.keys(tempFields.reduce(reducer, {}));
      dependentFields = dependentFields.filter(field => fieldNameArr.indexOf(field.name) === -1);

      dependentFields = dependentFields.map(dependentField => {
        dependentField.dependent = true;
        return dependentField;
      });

      dependentFields = tempFields.concat(dependentFields);
    }

    return dependentFields;
  }

  const handleFieldChange = async (fieldName, fieldValue, submit = true) => {
    setFormData({...formData, [fieldName]: fieldValue});
    const dependentFields = await getDependentFields(fieldName, fieldValue);
    if (dependentFields.length > 0) {
      setFormFields(dependentFields);
    }

    if (submit && autoSubmit && !loading) {
      submitForm();
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  }

  const submitForm = () => {
    let formValidationFlag = true;
    const updatedFields = formFields.map((field) => {
      if (field.readonly === undefined || !field.readonly) {
        const { error, errorMessage } = validate(field, formData[field.name], formData);
        if (error) {
          formValidationFlag = false;
          if (!field.hasOwnProperty('error') || (field.hasOwnProperty('error') && typeof field.error === 'boolean'))
            field.error = true;

          return {...field, errorMessage};
        }

        field.error = false;
        return {...field, errorMessage};
      } else {
        field.error = false;
        return field;
      }
    });

    setFormFields(updatedFields);

    if (!loading && formValidationFlag) {
      setLoading(true);
      setSuccess(false);
      const parsedFields = unflatten(formData, {
        delimiter: '.'
      });
      onSubmit(parsedFields);
    }
  }

  return (
    <div className={classes.formWraper}>
      {(title) ? <Toolbar title={title} /> : ''}
      <form
        onSubmit={handleSubmit}
        autoComplete='off'
        noValidate={novalidate}
      >
        <div className={containerClass} >
          {formFields.map(formField => {
            return (
              <Field
                formData={formData}
                onChange={handleFieldChange}
                {...formField}
              />
            );
          })}

          {buttons.map(formButton => {
            let button = '';
            switch (formButton.type) {
              case 'button':
                const btnKey = `button-${formButton.label.replace(' ', '-')}`;
                let disable = (typeof formButton.disable === 'function') ? formButton.disable(data) : formButton.disable;
                button = (
                  <Button
                    variant={(formButton.variant) ? formButton.variant : 'contained'}
                    color={(formButton.color) ? formButton.color : 'secondary'}
                    className={buttonClassname}
                    onClick={(e) => formButton.action(formData, e, btnKey)}
                    key={btnKey}
                    disabled={disable || success || loading || formButton.disabled}
                  >
                    {success ? <CheckIcon /> : ''} {formButton.label}
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                )
                break;
              default:
                button = (
                  <Button
                    variant='contained'
                    color={(formButton.color) ? formButton.color : 'primary'}
                    type='submit'
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

            return button;
          })}
        </div>
      </form>
    </div>
  );
}

EnhancedForm.defaultProps = {
  buttons: [],
  container: true,
  loading: false,
  success: false
};

EnhancedForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedForm);
