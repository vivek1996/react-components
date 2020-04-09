import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const selectOptions = {
  loading: false,
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
    this.setState({loading: true});
    if (typeof this.props.options === 'object') {
      this.setState({selectOptions: this.props.options, loading: false});
    } else if (typeof this.props.options === 'function') {
      let optionsFn = this.props.options(this.state.data);
      if (optionsFn instanceof Promise) {
        optionsFn.then(options => {
          this.setState({selectOptions: options, loading: false});
        });
      } else {
        this.setState({selectOptions: optionsFn, loading: false});
      }
    }
  }

  render = () => {
    const { classes, key, name, optionKey, optionValue } = this.props;
    const { data, selectOptions, value, loading } = this.state;
    return (
      <TextField
        select
        key={key}
        id={key}
        name={name}
        label={this.props.label}
        type={this.props.type}
        format={this.props.format}
        placeholder={this.props.placeholder}
        className={classes.textField}
        value={value}
        onChange={(event) => {
          const { name, value } = event.target;
          this.props.onChange(name, value);
        }}
        margin="normal"
        required={(this.props.required) ? true : false}
        disabled={(this.props.disabled) ? true : false}
        InputProps={{ 
          disabled: (typeof this.props.disabled === 'function') ? this.props.disabled(data) : this.props.disabled,
          readOnly: (typeof this.props.readonly === 'function') ? this.props.readonly(data) : this.props.readonly,
          startAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color='inherit' size={20} /> : null}
              {
                (this.props.prefix) ? (
                  <InputAdornment position="start">{this.props.prefix}</InputAdornment>
                ) : null
              }
            </React.Fragment>
          ),
          endAdornment: (this.props.suffix) ? (
            <InputAdornment position="end">{this.props.suffix}</InputAdornment>
          ) : null,
          inputProps: {
            title: (typeof this.props.title === 'function') ? this.props.title(data) : this.props.title
          }
        }}
        InputLabelProps={{
          shrink: value !== undefined
        }}
      >
        {selectOptions.map(option => (
          <MenuItem
            key={`select-${name}-${option[optionKey] || option[name] || option.id || option.key || option.value}`}
            value={option[optionKey] || option[name] || option.id || option.key || option.value || option}
            className={classes.optionItem}
          >
            { option[optionValue] || option.name || option.label || option.value || option }
          </MenuItem>
        ))}
      </TextField>
    );
  }
}

EnhancedSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedSelect);
