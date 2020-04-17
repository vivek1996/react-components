import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    minWidth: '100px'
  }
});

const radioOptions = {
  options: []
}

class EnhancedCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(radioOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  handleChange = event => {
    const { name, value, checked } = event.target;
    const { data } = this.props;

    let prevFieldValue = ((data[name] === undefined) ? [] : data[name]);

    if(Array.isArray(prevFieldValue)) {
      if(checked) {
        let updatedArray = prevFieldValue.concat([value]);
        let uniqueArray = updatedArray.filter(function(item, pos) {
          return updatedArray.indexOf(item) === pos; 
        });

        this.props.onChange(name, uniqueArray);
      } else {
        let filteredPrevValue = prevFieldValue.filter(function(item, pos) {
            return prevFieldValue.indexOf(value) !== pos;
        });

        this.props.onChange(name, filteredPrevValue);
      }
    } else {
      this.props.onChange(name, value);
    }
  }

  render = () => {
    // return (
    //   <RadioGroup
    //     aria-label={props.label}
    //     className={classes.group}
    //     value={value}
    //     id={props.name}
    //     name={props.name}
    //     onChange={this.handleChange}
    //   >
    //     {options.map(option => {
    //       return (
    //         <FormControlLabel 
    //           value={option.value} 
    //           control={<Radio />} 
    //           label={option.label} 
    //           disabled={(option.disabled) ? true : false} 
    //           key={`${(new Date()).getTime()}-radio-group-${option.label}`}
    //         />
    //       );
    //     })}
    //   </RadioGroup>
  // );

    const props = this.props;
    const { classes, label, name, required, key, error, disabled } = this.props;
    const { options, value } = this.state;

    return (options) ? (
      <FormGroup
        aria-label={label}
        className={classes.group}
      >
        {options.map(option => {
          return (
            <FormControlLabel
              control={
                <Checkbox 
                  onChange={this.handleChange} 
                  value={option.value} 
                  name={name}
                  disabled={(option.disabled) ? true : false}
                  checked={(value.indexOf(option.value.toString()) > -1) ? true : false}
                />
              }
              label={option.label}
            />
          );
        })}
      </FormGroup>
    ) : (
      <FormGroup
        aria-label={label}
        className={classes.group}
      >
        <FormControlLabel
          control={
            <Checkbox 
              onChange={this.handleChange} 
              value={value} 
              name={name}
              disabled={(disabled) ? true : false}
              checked={value}
            />
          }
          label={
            <Typography variant='caption' >
              {label}
            </Typography>
          }
        />
      </FormGroup>
    );
  }
}

EnhancedCheckbox.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedCheckbox);
