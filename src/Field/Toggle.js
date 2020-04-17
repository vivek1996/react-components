import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    
  },
  spacing: {
    marginTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing()
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing()
  },
  options: {
    ...theme.typography.button,
    // padding: theme.spacing.unit,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center'
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,

    // justifyContent: 'center',
    // padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  toggleButton: {
    minWidth: '42%',
    padding: ''.concat(theme.spacing(1 / 2), 'px ').concat(theme.spacing(1.5), 'px'),
    borderRadius: 2,
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '#f5f5f5',
    color: 'rgba(0, 0, 0, .3)',
    // '&:hover': {
    //   textDecoration: 'none',
    //   // Reset on mouse devices
    //   backgroundColor: theme.palette.primary.main,
    //   '@media (hover: none)': {
    //     backgroundColor: 'transparent'
    //   },
    //   '&$disabled': {
    //     backgroundColor: 'transparent'
    //   }
    // },
    '&:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    },
    '&:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  toggleButtonSelected: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    '&:after': {
      backgroundColor: theme.palette.primary.main,
      opacity: .1
    },
    '& + &:before': {
      opacity: .1
    }
  }
});

class EnhancedToggle extends React.Component {
  state = {
    data: {}
  };
  
  componentWillReceiveProps = (nextProps) => {
    let data = nextProps.data || this.state.data || {};
    if(typeof nextProps.options === 'function') {
      let optionsFn = nextProps.options(data);
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          this.setState({ 
            value: nextProps.value, 
            data: nextProps.data, 
            options: options
          });
        });
      } else {
        this.setState({ 
          value: nextProps.value, 
          data: nextProps.data, 
          options: optionsFn
        });
      }
    } else if(typeof nextProps.options === 'object') {
      this.setState({ 
        value: nextProps.value, 
        data: nextProps.data, 
        options: nextProps.options
      });
    }
  }

  componentDidMount = () => {
    if(this.props.enum) {
      this.setState({options: this.props.enum});
    } else if(typeof this.props.options === 'function') {
      let optionsFn = this.props.options(this.props.data);
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          this.setState({options: options});
        });
      } else {
        this.setState({options: optionsFn});
      }
    } else if(typeof this.props.options === 'object') {
      this.setState({options: this.props.options});
    }
  }

  handleClick = (event) => {
    const name = (event.target.name) ? event.target.name : event.target.getAttribute('name');
    const value = (event.target.value) ? event.target.value : event.target.getAttribute('value');
    
    if(this.props.value !== value) {
      this.props.onChange(name, value);
    }
  }

  render = () => {
    const { classes, spacing, name, label, error, value, data, options } = this.props;
    const spacingClass = classNames(classes.root, spacing && classes.spacing);
    let fieldOptions = options;
    if(typeof options === 'function') {
      let optionsFn = options(data);
      if(optionsFn instanceof Promise) {
        optionsFn.then(options => {
          fieldOptions = options;
        });
      } else {
        fieldOptions = optionsFn;
      }
    }
    
    return (
      <FormControl 
        className={spacingClass}
        error={(typeof error === 'function') ? error(data) : error} 
        aria-describedby={`${name}-error-text`}
        key={`form-control-${name}`}
      >
        {(label) ? (
          <div>
          <br/>
          <FormLabel>{label}</FormLabel>
          <br/>
          </div>
        ) : null}
        
        <div className={classes.options}>
          {fieldOptions.map(option => {
            let optionValue = (typeof option === 'object' && option.hasOwnProperty('value')) ? option.value : option;
            let optionLabel = (typeof option === 'object' && option.hasOwnProperty('label')) ? option.label : option;
            let selected = (value === optionValue) ? true : false;
            
            return (
              <Typography 
                value={optionValue}
                key={`${(new Date()).getTime()}-toggle-button-${name}-${optionLabel}`}
                name={name}
                onClick={this.handleClick}
                className={classNames(classes.toggleButton, selected && classes.toggleButtonSelected)}
                classes={{
                  root: classes.toggleButton
                }}
              >
                {optionLabel}
              </Typography>
            );
          })}
        </div>
        
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

EnhancedToggle.defaultProps = {
  spacing: true,
  options: []
};

EnhancedToggle.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedToggle);
