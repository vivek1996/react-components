import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import moment from "moment";
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css';

const styles = theme => ({});
const dateRangeOptions = {}

class EnhancedDateRange extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(dateRangeOptions, props);
  }

  onSelect = (dates, states) => {
    this.setState({dates, states});
    this.props.onChange(this.props.name, {
      start: moment(dates.start).format("YYYY-MM-DD"),
      end: moment(dates.end).format("YYYY-MM-DD"),
    });
  }

  render = () => {
    const { data } = this.state;

    return (
      <FormControl 
        error={(typeof this.props.error === 'function') ? this.props.error(data) : this.props.error} 
        aria-describedby={`${this.props.name}-error-text`}
        key={`form-control-${this.props.name}`}
      >
        <DateRangePicker
          selectionType='range'
          minimumDate={(this.props.min) ? this.props.min : moment().startOf('month').subtract(3, 'months')}
          maximumDate={(this.props.max) ? this.props.max : moment()}
          format={(this.props.format) ? this.props.format : "YYYY-MM-DD"}
          value={this.state.dates}
          onSelect={this.onSelect} 
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

EnhancedDateRange.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EnhancedDateRange);