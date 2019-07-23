import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: '100px'
  },
  optionItem: {
    height: 'auto',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'normal !important'
  }
});


const numberOptions = {};
class EnhancedNumber extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(numberOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  componentDidMount = () => {
    if(this.props.value) {
      this.props.onChange(this.props.name, this.props.value);
    }
  }

  validateValue = (value) => {
    const { type, pattern } = this.props;
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

  handleNumberOnChange = (fieldName, fieldValue) => {
    // let formatFlag = this.validateValue(fieldValue);

    // if(formatFlag) {
      this.setState({value: fieldValue});
    // } else {
    //   this.setState({error: true});
    // }
  }

  handleNumberOnBlur = (fieldName, fieldValue) => {
    if(fieldValue) {
      this.props.onChange(fieldName, fieldValue);
    }
  }

  render = () => {
    const props = this.props;
    const { classes, type } = this.props;
    const { data, value } = this.state;

    return (
      <TextField
        key={props.name}
        id={props.name}
        name={props.name}
        type={type}
        label={props.label}
        placeholder={props.placeholder}
        className={classes.textField}
        value={value}
        onChange={(event) => {
          const { name, value } = event.target;
          this.handleNumberOnChange(name, value);
        }}
        onBlur={(event) => {
          const { name, value } = event.target;
          this.handleNumberOnBlur(name, value);
        }}
        margin="normal"
        required={(props.required) ? true : false}
        disabled={(props.disabled) ? true : false}
        // helperText={(typeof props.helptext === 'function') ? props.helptext(data) : props.helptext}
        InputProps={{ 
          disabled: (typeof props.disabled === 'function') ? props.disabled(data) : props.disabled,
          readOnly: (typeof props.readonly === 'function') ? props.readonly(data) : props.readonly,
          startAdornment: (props.prefix) ? (<InputAdornment position="start">{props.prefix}</InputAdornment>) : null,
          endAdornment: (props.suffix) ? (<InputAdornment position="end">{props.suffix}</InputAdornment>) : null,
          inputProps: {
            title: (typeof props.title === 'function') ? props.title(data) : props.title, 
            min: (typeof props.min === 'function') ? props.min(data) : props.min, 
            max: (typeof props.max === 'function') ? props.max(data) : props.max,
            maxLength: (typeof props.maxlength === 'function') ? props.maxlength(data) : props.maxlength,
            minLength: (typeof props.minlength === 'function') ? props.minlength(data) : props.minlength,
            step: (typeof props.step === 'function') ? props.step(data) : props.step,
            pattern: (typeof props.pattern === 'function') ? props.pattern(data) : props.pattern
          }
        }}
        InputLabelProps={{
          shrink: (value || props.prefix) ? true : false
        }}
      />
    );
  }
}

EnhancedNumber.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedNumber);
