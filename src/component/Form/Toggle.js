import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Toggle from "./ToggleButton";

const styles = theme => ({
  root: {

  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const toggleOptions = {
	toggleOptions: []
}

class EnhancedToggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(toggleOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    let data = this.state.data;
    if(nextProps.enum) {
      this.setState({ 
        value: nextProps.value, 
        data: nextProps.data, 
        toggleOptions: nextProps.enum 
      });
    } else if(typeof nextProps.options === 'function') {
      let optionsFn = nextProps.options(data);
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          this.setState({ 
            value: nextProps.value, 
            data: nextProps.data, 
            toggleOptions: options
          });
        });
      } else {
        this.setState({ 
          value: nextProps.value, 
          data: nextProps.data, 
          toggleOptions: optionsFn
        });
      }
    } else if(typeof nextProps.options === 'object') {
      this.setState({ 
        value: nextProps.value, 
        data: nextProps.data, 
        toggleOptions: nextProps.options
      });
    }
  }

  componentDidMount = () => {
    if(this.props.enum) {
      this.setState({toggleOptions: this.props.enum});
    } else if(typeof this.props.options === 'function') {
      let optionsFn = this.props.options(this.props.data);
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          this.setState({toggleOptions: options});
        });
      } else {
        this.setState({toggleOptions: optionsFn});
      }
    } else if(typeof this.props.options === 'object') {
      this.setState({toggleOptions: this.props.options});
    }
  }

  render = () => {
    const { classes, data, value } = this.props;
    const { toggleOptions } = this.state;
    
    return (
      <FormControl 
        className={classes.root}
        error={(typeof this.props.error === 'function') ? this.props.error(data) : this.props.error} 
        aria-describedby={`${this.props.name}-error-text`}
        key={`form-control-${this.props.name}`}
      >
        {(this.props.label) ? (
          <div>
          <br/>
          <FormLabel>{this.props.label}</FormLabel>
          <br/>
          </div>
        ) : null}
        
        <Toggle
          key={this.props.name}
          name={this.props.name}
          value={value} 
          options={toggleOptions}
          onChange={this.props.onChange}
        />
        
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

EnhancedToggle.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedToggle);
