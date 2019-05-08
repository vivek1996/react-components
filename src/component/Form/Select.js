import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  optionItem: {
    height: 'auto',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'normal !important'
  }
});

const selectOptions = {
  selectOptions: []
}

class EnhancedSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(selectOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  componentDidMount = () => {
    if(typeof this.props.options === 'object') {
      this.setState({selectOptions: this.props.options});
    } else if(typeof this.props.options === 'function') {
      let optionsFn = this.props.options();
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          this.setState({selectOptions: options});
        });
      } else {
        this.setState({selectOptions: optionsFn});
      }
    }
  }

  render = () => {
    const { classes } = this.props;
    const { data, selectOptions, value } = this.state;

    return (
      <FormControl 
        error={(typeof this.props.error === 'function') ? this.props.error(data) : this.props.error} 
        aria-describedby={`${this.props.name}-error-text`}
        key={`form-control-${this.props.name}`}
      >
        <TextField
          select
          key={this.props.name}
          id={this.props.name}
          name={this.props.name}
          label={this.props.label}
          type={this.props.type}
          format={this.props.format}
          placeholder={this.props.placeholder}
          className={classes.textField}
          value={value}
          onChange={this.props.onChange}
          margin="normal"
          required={(this.props.required) ? true : false}
          disabled={(this.props.disabled) ? true : false}
          InputLabelProps={{
            shrink: (value) ? true : false
          }}
        >
          {selectOptions.map(option => (
            <MenuItem 
              key={`select-${this.props.name}-${option.id || option.value}`}
              value={ option.id || option.value }
              className={classes.optionItem}
            >
              { option.name || option.label }
            </MenuItem>
          ))}
        </TextField>

        {
          (this.props.error) ? (
            <FormHelperText id={`${this.props.name}-error-text`}>
              {(typeof this.props.title === 'function') ? this.props.title(data) : this.props.title}
            </FormHelperText>
          ) : null
        }

        {
          (this.props.helptext) ? (
            <FormHelperText id={`${this.props.name}-help-text`}>
            {(typeof this.props.helptext === 'function') ? this.props.helptext(data) : this.props.helptext}
            </FormHelperText>
          ) : null
        }

        {
          (this.props.helplink) ? (
            <FormHelperText id={`${this.props.name}-help-text`}>
              {(typeof this.props.helplink === 'function') ? this.props.helplink(data) : this.props.helplink}
            </FormHelperText>
          ) : null
        }
      </FormControl>
    );
  }
}

EnhancedSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedSelect);
