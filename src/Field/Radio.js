import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

const radioOptions = {
  options: []
}

class EnhancedRadio extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(radioOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.props.onChange(name, value);
  }

  render = () => {
    const props = this.props;
    const { classes } = this.props;
    const { options, value } = this.state;

    return (
      <RadioGroup
        aria-label={props.label}
        className={classes.group}
        value={value}
        id={props.name}
        name={props.name}
        onChange={this.handleChange}
      >
        {options.map(option => {
          return (
            <FormControlLabel 
              value={option.value} 
              control={<Radio />} 
              label={option.label} 
              disabled={(option.disabled) ? true : false} 
              key={`${(new Date()).getTime()}-radio-group-${option.label}`}
            />
          );
        })}
      </RadioGroup>
    );
  }
}

EnhancedRadio.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedRadio);
