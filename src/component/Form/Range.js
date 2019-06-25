import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
  wrapper: {
    display: 'flex'
  },
  container: {
    padding: '22px 0px',
  },
  rangeMin: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing.unit
  },
  rangeMax: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit
  },
});

const rangeOptions = {};

class EnhancedRange extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(rangeOptions, props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ value: nextProps.value, data: nextProps.data });
  }

  componentDidMount = () => {
    if(this.props.value) {
      this.props.onChange(this.props.name, this.props.value);
    }
  }

  render = () => {
    const { classes } = this.props;
    const { data, value } = this.state;
    return (
      <FormControl error={this.props.error} aria-describedby={`${this.props.name}-error-text`}>
        {
          (this.props.label) 
          ? <FormLabel >{this.props.label}</FormLabel>
          : null
        }

        <div key={`wrapper-${this.props.name}`} className={classes.wrapper}>
          <div className={classes.rangeMin}>
            {
              (
                (typeof this.props.minText === 'function') ? this.props.minText(data) : this.props.minText
              ) || (
                (typeof this.props.min === 'function') ? this.props.min(data) : this.props.min
              )
            }
          </div>
          <Slider
            key={`slider-${this.props.name}`}
            id={this.props.name}
            name={this.props.name}
            classes={{ container: classes.container }}
            value={
              (typeof value === 'function') 
              ? value(data) 
              : ((value === undefined || value === "") ? 0 : parseFloat(value))
            }
            min={
              (typeof this.props.min === 'function') ? this.props.min(data) : this.props.min.value || this.props.min
            }
            max={
              (typeof this.props.max === 'function') ? this.props.max(data) : this.props.max.value ||this.props.max
            }
            step={(typeof this.props.step === 'function') ? this.props.step(data) : this.props.step}
            onChange={(event, value) => {
              this.props.onChange(this.props.name, value);
            }}
          />
          <div className={classes.rangeMax}>
            {
              (
                (typeof this.props.maxText === 'function') ? this.props.maxText(data) : this.props.maxText
              ) || (
                (typeof this.props.max === 'function') ? this.props.max(data) : this.props.max
              )
            }
          </div>
        </div>
        {
          (this.props.error) ? (
            <FormHelperText id={`${this.props.name}-error-text`} component="span">
            {this.props.title}
            </FormHelperText>
          ) : null
        }

        {
          (this.props.helptext) ? (
            <FormHelperText id={`${this.props.name}-help-text`} component="span">
            {(typeof this.props.helptext === 'function') ? this.props.helptext(data) : this.props.helptext}
            </FormHelperText>
          ) : null
        }
      </FormControl>
    );
  }
}

EnhancedRange.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedRange);
