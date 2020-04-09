import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: '100px'
  }
});

class EnhancedAutocomplete extends React.Component {
  state = {
    open: false,
    options: [],
    loading: true
  }

  componentDidMount = async () => {
    if (typeof this.props.options === 'object') {
      this.setState({options: this.props.options, loading: false});
    } else if (typeof this.props.options === 'function') {
      const fnRes = await this.props.options(this.state.data);
      this.setState({options: fnRes, loading: false});
    }
  }

  suggestedOptions = async (name, value) => {
    this.setState({loading: true});
    if (typeof this.props.options === 'object') {
      const results = this.props.options.filter((obj) => {
        return Object.keys(obj).reduce((acc, curr) => {
          return acc || obj[curr].toLowerCase().includes(value);
        }, false);
      });
      this.setState({options: results, loading: false});
    } else if (typeof this.props.options === 'function') {
      const fnRes = await this.props.options(value);
      this.setState({options: fnRes, loading: false});
    }
  }

  setOpen = (value) => {
    this.setState({open: value});
  }

  render = () => {
    const props = this.props;
    const { key, classes, name, optionKey, optionValue } = props;
    const { open, options, loading } = this.state;
    return (
      <Autocomplete
        key={key}
        id={name}
        name={name}
        open={open}
        onOpen={() => {
          this.setOpen(true);
        }}
        onClose={() => {
          this.setOpen(false);
        }}
        onChange={(event, value) => {
          const selectedValue = value[optionKey] || value[name] || value.id || value.key || value.value || value.name || value;
          this.props.handleChange(name, selectedValue);
        }}
        getOptionSelected={(option, selected) => (option[optionKey] || option[name] || option.id || option.key || option.value || option.name || option) === (selected[optionKey] || selected[name] || selected.id || selected.key || selected.value || selected.name || selected)}
        getOptionLabel={(option) => option[optionValue] || option.name || option.label || option.value || option}
        options={options}
        loading={loading}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              className={classes.textField}
              label={props.label}
              onChange={(event) => {
                const { value } = event.target;
                this.suggestedOptions(name, value);
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color='inherit' size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          );
        }}
        filterOptions={(options) => {
          return options;
        }}
      />
    );
  }
};

export default withStyles(styles, { withTheme: true })(EnhancedAutocomplete);