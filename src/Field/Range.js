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
  const { key, name, min, step, max, value, formData, handleChange } = props;

  return (
    <div className={classes.textField}>
      <Slider
        key={key}
        name={name}
        defaultValue={value || 0}
        min={(typeof min === 'function') ? min(formData) : min}
        max={(typeof max === 'function') ? max(formData) : max}
        step={(typeof step === 'function') ? step(formData) : step}
        onChange={(event, value) => {
          handleChange(name, value);
        }}
        valueLabelDisplay='auto'
        marks={[{value: min, label: min}, {value: max, label: max}]}
      />
    </div>
  );
}

export default EnhancedRange;
