import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  textField: {
    minWidth: "100px",
  },
}));

export default function EnhancedAutocomplete(props) {
  const classes = useStyles();
  const { minlength, key, name, optionKey, optionValue, handleChange } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState();
  // const loading = open && options.length === 0;
  const loading = open;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      let resultOptions = [];
      if (typeof props.options === "object") {
        if (value) {
          resultOptions = props.options.filter((obj) => {
            return Object.keys(obj).reduce((acc, curr) => {
              return acc || obj[curr].toLowerCase().includes(value);
            }, false);
          });
        } else {
          resultOptions = props.options;
        }
      } else if (typeof props.options === "function") {
        if (value && value.length >= (minlength || 3)) {
          resultOptions = await props.options(value);
        }
      }

      if (active) {
        setOptions(resultOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, value]);

  return (
    <Autocomplete
      key={key}
      name={name}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, value) => {
        const selectedValue =
          value[optionKey] ||
          value[name] ||
          value.id ||
          value.key ||
          value.value ||
          value.name ||
          value;
        handleChange(selectedValue);
      }}
      getOptionSelected={(option, selected) =>
        (option[optionKey] ||
          option[name] ||
          option.id ||
          option.key ||
          option.value ||
          option.name ||
          option) ===
        (selected[optionKey] ||
          selected[name] ||
          selected.id ||
          selected.key ||
          selected.value ||
          selected.name ||
          selected)
      }
      getOptionLabel={(option) =>
        option[optionValue] ||
        option.name ||
        option.label ||
        option.value ||
        option
      }
      options={options}
      loading={loading}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            className={classes.textField}
            label={props.label}
            onChange={(event) => {
              const { value } = event.target;
              setValue(value);
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        );
      }}
      filterOptions={(options) => {
        return options;
      }}
    />
  );
}

EnhancedAutocomplete.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})),
};

EnhancedAutocomplete.defaultProps = {
  options: null,
};
