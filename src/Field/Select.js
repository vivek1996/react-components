import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    minWidth: '100px'
  },
  optionItem: {
    height: 'auto',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'normal !important'
  }
}));

const EnhancedSelect = (props) => {
  const classes = useStyles();
  const {
    key, name, label, placeholder, required, disabled, readonly, value,
    optionKey, optionValue, handleChange, title, suffix, prefix, data, multiple
  } = props;

  const [options, setOptions] = React.useState([]);
  const [localValue, setLocalValue] = React.useState(value);
  const loading = options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      let resultOptions = [];
      if (typeof props.options === 'object') {
        resultOptions = props.options;
      } else if (typeof props.options === 'function') {
        resultOptions = await props.options(localValue);
      }

      if (active) {
        setOptions(resultOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <TextField
      select
      multiple={multiple}
      key={key}
      id={key}
      name={name}
      label={label}
      placeholder={placeholder}
      className={classes.textField}
      defaultValue={value || ''}
      onChange={(event) => {
        const { value } = event.target;
        setLocalValue(value);
      }}
      onBlur={(event) => {
        const { value } = event.target;
        handleChange(name, value);
      }}
      margin='normal'
      required={required}
      InputProps={{
        disabled: (typeof disabled === 'function') ? disabled(data) : disabled,
        readOnly: (typeof readonly === 'function') ? readonly(data) : readonly,
        startAdornment: (
          <React.Fragment>
            {loading ? <CircularProgress color='inherit' size={20} /> : null}
            {
              (prefix) ? (
                <InputAdornment position='start'>{prefix}</InputAdornment>
              ) : null
            }
          </React.Fragment>
        ),
        endAdornment: (suffix) ? (
          <InputAdornment position='end'>{suffix}</InputAdornment>
        ) : null,
        inputProps: {
          title: (typeof title === 'function') ? title(data) : title
        }
      }}
      InputLabelProps={{
        shrink: (localValue !== undefined && localValue !== null && localValue !== '' && props.prefix)
      }}
      SelectProps={{
        displayEmpty: false,
        multiple: multiple,
        renderValue: (selected) => {
          if (multiple) {
            if (selected.length === 0 && placeholder) {
              return <em>{placeholder}</em>;
            }

            return selected.join(', ');
          }

          return selected;
        }
      }}
    >
      {(placeholder) && (
        <MenuItem disabled value=''>
          <em>{placeholder}</em>
        </MenuItem>
      )}
      {options.map(option => (
        <MenuItem
          key={`select-option-${name}-${option[optionKey] || option[name] || option.id || option.key || option.value || option}`}
          value={option[optionKey] || option[name] || option.id || option.key || option.value || option}
          className={classes.optionItem}
        >
          { option[optionValue] || option.name || option.label || option.value || option }
        </MenuItem>
      ))}
    </TextField>
  );
}

EnhancedSelect.defaultProps = {
  multiple: false
};

EnhancedSelect.propTypes = {
};

export default EnhancedSelect;
