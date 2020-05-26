import React from "react";
// import { classNames } from 'classnames';
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";

const classNames = require("classnames");

const styles = (theme) => ({
  root: {},
  spacing: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(),
  },
  optionsContainer: {
    ...theme.typography.button,
    color: theme.palette.common.white,
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(2),
  },
  toggleButton: {
    padding: ""
      .concat(theme.spacing(1 / 2), "px ")
      .concat(theme.spacing(1.5), "px"),
    borderRadius: 2,
    justifyContent: "center",
    display: "flex",
    backgroundColor: "#f5f5f5",
    color: "rgba(0, 0, 0, .3)",
    "&:not(:first-child)": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    "&:not(:last-child)": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  toggleButtonSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
    "&:after": {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.1,
    },
    "& + &:before": {
      opacity: 0.1,
    },
  },
});

const EnhancedToggle = (props) => {
  const {
    classes,
    name,
    label,
    defaultValue,
    fieldValues,
    options,
    handleChange,
    optionKey,
    optionValue,
  } = props;

  const [toggleOptions, setToggleOptions] = React.useState([]);
  React.useEffect(() => {
    let fieldOptions = options;
    (async () => {
      if (typeof options === "function") {
        fieldOptions = await options(fieldValues);
      }
      setToggleOptions(fieldOptions);
    })();
  }, [options]);

  const handleClick = (event) => {
    // const name = (event.target.name) ? event.target.name : event.target.getAttribute('name');
    const value = event.target.value
      ? event.target.value
      : event.target.getAttribute("value");

    handleChange(value);
  };

  return (
    <>
      {label !== undefined ? (
        <FormLabel component="legend">{label}</FormLabel>
      ) : null}
      <FormGroup aria-label={label}>
        <div className={classes.optionsContainer}>
          {toggleOptions.map((option) => {
            const toggleOptionValue =
              option[optionKey] ||
              option[name] ||
              option.id ||
              option.key ||
              option.value ||
              option;
            const selected = defaultValue === toggleOptionValue;
            return (
              <Typography
                value={toggleOptionValue}
                key={`${new Date().getTime()}-toggle-option-${name}-${toggleOptionValue}`}
                name={name}
                onClick={handleClick}
                className={classNames(
                  classes.toggleButton,
                  selected && classes.toggleButtonSelected
                )}
                classes={{
                  root: classes.toggleButton,
                }}
              >
                {option[optionValue] ||
                  option.name ||
                  option.label ||
                  option.value ||
                  option}
              </Typography>
            );
          })}
        </div>
      </FormGroup>
    </>
  );
};

EnhancedToggle.defaultProps = {
  options: [],
};

EnhancedToggle.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EnhancedToggle);
