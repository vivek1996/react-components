import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  textField: {
    minWidth: '100px'
  }
}));

const EnhancedRange = (props) => {
  const classes = useStyles();
  const { key, name, min, step, max, value, fieldValues, handleChange } = props;

  // const { decimal } = props;
  // if (type === 'range') {
  //   value = (isNaN(value) || typeof value === 'string') ? value : value.toFixed(decimal || 2);
  // }

  return (
    <div className={classes.textField}>
      <Slider
        key={key}
        name={name}
        defaultValue={value || 0}
        min={(typeof min === 'function') ? min(fieldValues) : min}
        max={(typeof max === 'function') ? max(fieldValues) : max}
        step={(typeof step === 'function') ? step(fieldValues) : step}
        onChange={(event, value) => {
          handleChange(value);
        }}
        valueLabelDisplay='auto'
        marks={[{value: min, label: min}, {value: max, label: max}]}
      />
    </div>
  );
}

export default EnhancedRange;
