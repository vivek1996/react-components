import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

import Form from "./../../Form";
import Popper from "./Popper";

const styles = (theme) => ({
  root: {
    display: "flex",
    // justifyContent: 'flex-end',
    flexWrap: "inherit",
    overflowX: "hidden",
    overflowY: "hidden",
    "&:hover": {
      overflowX: "auto",
    },
  },
  chip: {
    margin: theme.spacing(1 / 2),
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  chipLabel: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
});

const ChipFilter = (props) => {
  const { classes, options, onFilter } = props;

  const [open, setOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState();
  const [filterData, setFilterData] = React.useState({});

  const clearFilter = (option) => {
    const updatedFilterData = { ...filterData };
    delete updatedFilterData[option.name];
    setFilterData(updatedFilterData);
  };

  const openFilter = (dialogInfo) => {
    setOpen(true);
    setDialog(dialogInfo);
  };

  const closeFilter = (value) => {
    setOpen(false);
    setDialog(null);
  };

  const getSelectedValue = (option) => {
    if (
      filterData[option.name] === undefined ||
      filterData[option.name] === "" ||
      filterData[option.name].length === 0
    ) {
      return option.label;
    } else if (
      ["multiselect", "select", "radio", "checkbox"].indexOf(option.type) > -1
    ) {
      let availableOptions = [];
      if (option.enum) {
        availableOptions = option.enum;
      } else if (option.options) {
        availableOptions = option.options;
      } else if (typeof option.data === "object") {
        availableOptions = option.data;
      } else if (typeof option.data === "function") {
        availableOptions = option.data();
      }

      let selectedOptions = availableOptions
        .map((availableOption) =>
          filterData[option.name].indexOf(availableOption.value.toString()) > -1
            ? availableOption.label
            : ""
        )
        .filter(
          (selectedOption) =>
            selectedOption !== undefined && selectedOption !== ""
        );

      return selectedOptions.length > 1
        ? `${selectedOptions[0]} + ${selectedOptions.length - 1}`
        : selectedOptions;
    } else if (["daterange"].indexOf(option.type) > -1) {
      return `${option.label} : From ${filterData[option.name].start} To ${
        filterData[option.name].end
      }`;
    } else {
      let availableOptions = [];
      if (option.enum) {
        availableOptions = option.enum;
      } else if (option.options) {
        availableOptions = option.options;
      } else if (typeof option.data === "object") {
        availableOptions = option.data;
      } else if (typeof option.data === "function") {
        availableOptions = option.data();
      }

      if (availableOptions.length > 0) {
        let selectedOptions = availableOptions
          .map((availableOption) =>
            filterData[option.name].indexOf(availableOption.value.toString()) >
            -1
              ? availableOption.label
              : ""
          )
          .filter(
            (selectedOption) =>
              selectedOption !== undefined && selectedOption !== ""
          );

        return selectedOptions.length > 1
          ? `${selectedOptions[0]} + ${selectedOptions.length - 1}`
          : selectedOptions;
      } else {
        return `${option.label} ${filterData[option.name]}`;
      }
    }
  };

  React.useEffect(() => {
    onFilter(filterData);
  }, [filterData]);

  return (
    <div className={classes.root}>
      {options.map((option) => {
        return option.filter ? (
          <Chip
            key={option.name}
            icon={
              filterData[option.name] === undefined ||
              filterData[option.name] === "" ||
              filterData[option.name].length === 0 ? (
                <ArrowDropDown />
              ) : null
            }
            color={
              filterData[option.name] !== undefined &&
              filterData[option.name] !== "" &&
              (filterData[option.name].length > 0 ||
                Object.keys(filterData[option.name]).length > 0)
                ? "primary"
                : "default"
            }
            label={getSelectedValue(option)}
            onClick={(node) => {
              let tempOption = Object.assign({}, option);
              delete tempOption.label;
              openFilter({
                title: option.label,
                anchorEl: node.target,
                content: (
                  <Form
                    fields={[tempOption]}
                    buttons={[]}
                    data={filterData}
                    autoSubmit={true}
                    onSubmit={(filterData) => {
                      setFilterData(filterData);
                    }}
                    onClose={closeFilter}
                  />
                ),
              });
            }}
            onDelete={
              filterData[option.name] === undefined ||
              filterData[option.name] === "" ||
              filterData[option.name].length === 0
                ? null
                : () => {
                    clearFilter(option);
                  }
            }
            className={classes.chip}
            aria-owns={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            classes={{
              label: classes.chipLabel,
            }}
          />
        ) : null;
      })}

      <Popper
        flip={true}
        arrow={false}
        arrowRef={null}
        disablePortal={false}
        open={open}
        onClose={closeFilter}
        title={dialog && dialog.title}
        content={dialog && dialog.content}
        anchorEl={dialog && dialog.anchorEl}
        placement={"bottom-start"}
        preventOverflow={"scrollParent"}
      />
    </div>
  );
};

ChipFilter.defaultProps = {
  options: [],
  onFilter: () => {},
};

ChipFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ChipFilter);
