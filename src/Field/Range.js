import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    minWidth: '100px'
  }
}));

const EnhancedRange = (props) => {
  const classes = useStyles();
  const { name, min, step, onChange, max } = props;
  const [value, setValue] = React.useState(props.value);
  const [data, setData] = React.useState(props.data);

  React.useEffect(() => {
    setData(props.data);
    setValue(props.value);
  });

  return (
    <div className={classes.textField}>
      <Slider
        key={`slider-${name}`}
        id={name}
        name={name}
        defaultValue={
          (typeof value === 'function') ? value(data) : (
            (value === undefined || value === '') ? 0 : parseFloat(value)
          )
        }
        value={value}
        min={(typeof min === 'function') ? min(data) : min}
        max={(typeof max === 'function') ? max(data) : max}
        step={(typeof step === 'function') ? step(data) : step}
        onChange={(event, value) => {
          onChange(name, value);
        }}
        valueLabelDisplay='auto'
        marks={[{value: min, label: min}, {value: max, label: max}]}
      />
    </div>
  );
}

export default EnhancedRange;
