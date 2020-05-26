import React from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import { isEmpty, isArray } from "../../lib";

const styles = (theme) => ({});

const EnhancedCheckbox = (props) => {
  const {
    classes,
    label,
    name,
    required,
    key,
    error,
    disabled,
    defaultValue,
    options,
    handleChange,
    optionKey,
    optionValue,
  } = props;

  const [localValue, setLocalValue] = React.useState();
  React.useEffect(() => {
    setLocalValue(defaultValue);
  }, []);

  const onChange = (event) => {
    const { value, checked } = event.target;
    const prevFieldValue =
      localValue === undefined
        ? options === undefined
          ? ""
          : []
        : isEmpty(localValue) && !isArray(localValue)
        ? []
        : localValue;

    if (isArray(prevFieldValue)) {
      if (checked) {
        const updatedArray = prevFieldValue.concat([value]);
        const uniqueArray = updatedArray.filter(function (item, pos) {
          return updatedArray.indexOf(item) === pos;
        });
        setLocalValue(uniqueArray);
        handleChange(uniqueArray);
      } else {
        const filteredPrevValue = prevFieldValue.filter(function (item, pos) {
          return prevFieldValue.indexOf(value) !== pos;
        });

        const filteredValue =
          filteredPrevValue.length > 0 ? filteredPrevValue : "";
        setLocalValue(filteredValue);
        handleChange(filteredValue);
      }
    } else {
      setLocalValue(checked);
      handleChange(checked);
    }
  };

  return options ? (
    <>
      {label !== undefined ? (
        <FormLabel component="legend">{label}</FormLabel>
      ) : null}
      <FormGroup aria-label={label}>
        {options.map((option) => {
          const optionVal =
            option[optionKey] ||
            option[name] ||
            option.id ||
            option.key ||
            option.value ||
            option;
          const optionLabel =
            option[optionValue] ||
            option.name ||
            option.label ||
            option.value ||
            option;
          const checkedOption =
            !isEmpty(localValue) &&
            isArray(localValue) &&
            localValue.indexOf(optionVal.toString()) > -1;
          return (
            <FormControlLabel
              key={`${new Date().getTime()}-${name}-checkbox-option-${optionVal}`}
              control={
                <Checkbox
                  onChange={onChange}
                  value={optionVal}
                  name={name}
                  disabled={option.disabled}
                  checked={checkedOption}
                />
              }
              label={optionLabel}
            />
          );
        })}
      </FormGroup>
    </>
  ) : (
    <FormGroup aria-label={label} className={classes.group}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={onChange}
            value={defaultValue}
            name={name}
            disabled={disabled}
            checked={defaultValue}
          />
        }
        label={<Typography variant="caption">{label}</Typography>}
      />
    </FormGroup>
  );
};

EnhancedCheckbox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EnhancedCheckbox);
