import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import async from 'async';

import { Dialog, Form } from "./";

const styles = theme => ({
  root: {
    // flexGrow: 1,
    // height: 250,
    padding: theme.spacing.unit * 2
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    fontSize: 16,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          ref: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={`${props.data.label} : ${props.data.value}`}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={event => {
        props.removeProps.onClick();
        props.removeProps.onMouseDown(event);
      }}
    />
  );
}

const components = {
  Option,
  Control,
  NoOptionsMessage,
  Placeholder,
  SingleValue,
  MultiValue,
  ValueContainer,
};

class Filter extends React.Component {
  state = {
    filterData: [],
    filter: null,
    dialogOpen: false,
    dialog: {},
  };

  handleChange = () => value => {
    if(value.length > 0) {
      this.openDialog(value);
    } else {
      this.setState({ filter: value, filterData: {} });
      this.props.loadData();
    }
  };

  openDialog = (filterForm) => {
    this.setState({ dialogOpen: true, filterForm: filterForm });
  };

  closeDialog = value => {
    if(typeof value === 'object') {
      this.setState({ filter: value });
    }
    this.setState({ dialogOpen: false });
  };

  render = () => {
    const { classes, options } = this.props;
    let filterValues = options.filter(function(option){
      return option.filter;
    });

    return (filterValues.length > 0) ? (
        <div className={classes.root}>
          <Select
            classes={classes}
            options={filterValues}
            components={components}
            value={this.state.filter}
            onChange={this.handleChange()}
            placeholder="Add a filter"
            isMulti
          />

          <Dialog 
            title={"Filter Data"}
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
            type={this.state.dialog.type} 
            content={<Form 
              fields={this.state.filterForm}
              buttons={[
                { type: 'submit', label: 'Apply' },
                { 
                  type: 'button',
                  color: 'default',
                  label: 'Cancel',
                  action: (event) => {
                    event.props.onClose();
                  }
                }
              ]}
              data={this.state.filterData}
              submitAction={(filterData) => {
                let filterDataObj = {};
                Object.keys(filterData).forEach(k => {
                  if(typeof filterData[k] === 'string') {
                    filterDataObj[k] = filterData[k];
                  } else if(typeof filterData[k] === 'number') {
                    filterDataObj[k] = filterData[k];
                  } else if (filterData[k] !== "" && filterData[k] !== undefined) {
                    filterDataObj[k] = filterData[k];
                  }
                });

                if(Object.keys(filterData).length > 0) {
                  this.props.loadData({where: filterDataObj});
                }
                
                this.setState({filterData: filterData});
                let currentObject = this;
                let filterForm = this.state.filterForm;
                async.each(filterForm, function (field, fieldFn) {
                  if(filterData[field.name] !== "" && filterData[field.name] !== undefined) {
                    field['value'] =  filterData[field.name];
                  } else {
                    delete filterForm[filterForm.indexOf(field)];
                  }
                  
                  fieldFn();
                }, function (error) {
                  if(error) { console.log(error); }

                  currentObject.closeDialog(filterForm);
                });
              }}
              onClose={this.closeDialog}
            />}
            text={this.state.dialog.text}
          />
        </div>
      ) 
    : null;
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);