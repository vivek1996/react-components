import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles, TextField, Button, Toolbar, Typography } from '@material-ui/core';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedToolbar = props => {
  const { classes, title } = props;

  return (
    <Toolbar
      className={classNames(classes.root)}
    >
      <div className={classes.title}>
        <Typography variant="title" id="title">
          {title}
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
      </div>
    </Toolbar>
  );
};

EnhancedToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

EnhancedToolbar = withStyles(toolbarStyles)(EnhancedToolbar);

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  paper: {
    width: '100%',
    minWidth: 'auto',
    marginTop: theme.spacing.unit * 6,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  }
});

class EnhancedForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentDidMount = () => {
    console.log("componentDidMount");
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(nextProps);  
  }

  componentWillUnmount = () => {
    console.log("componentWillUnmount");
  }

  handleChange = event => {
    const { name, value, type } = event.target;
    const { data } = this.state;

    let fieldValue = value;
    if(type === "checkbox") {
      fieldValue = event.target.checked;
    }

    this.setState({
      data: {
        ...data,
        [name]: fieldValue
      }
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.state.submitAction(this.state.data);
  }

  render = () => {
    const { classes, title } = this.props;
    const { data, fields, buttons } = this.state;

    return (
      <div>
        {(title) ? <EnhancedToolbar title={title} /> : ""}
        <form className={classes.container} onSubmit={this.handleSubmit} autoComplete="off">
          {fields.map(formField => {
            let field = '';
            switch(formField.type) {
              case 'radio':
                field = <FormControl component="fieldset" required className={classes.formControl}>
                  <FormLabel component="legend">{formField.label}</FormLabel>
                  <RadioGroup
                    aria-label={formField.label}
                    className={classes.group}
                    value={data[formField.name]}
                    id={formField.name}
                    name={formField.name}
                    onChange={this.handleChange}
                  >
                    {formField.options.map(option => {
                      return (<FormControlLabel value={option.value} control={<Radio />} label={option.label} disabled={(option.disabled) ? true : false} />);
                    })}
                  </RadioGroup>
                </FormControl>
                break;
              case 'boolean':
                field = <FormControl component="fieldset">
                  <FormLabel component="legend">{formField.label}</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id={formField.name}
                          checked={data[formField.name]}
                          name={formField.name}
                          onChange={this.handleChange}
                          disabled={(formField.disabled) ? true : false}
                        />
                      }
                      label={formField.placeholder}
                    />
                  </FormGroup>
                  <FormHelperText></FormHelperText>
                </FormControl>
                break;
              default:
                field = <TextField
                  key={formField.name}
                  id={formField.name}
                  name={formField.name}
                  label={formField.label}
                  type={formField.type}
                  placeholder={formField.placeholder}
                  className={classes.textField}
                  value={data[formField.name]}
                  onChange={this.handleChange}
                  margin="normal"
                  required={(formField.required) ? true : false}
                  disabled={(formField.disabled) ? true : false}
                />
                break;
            }

            return field;
          })}

          {buttons.map(formButton => {
            let field = '';
            switch(formButton.type) {
              case 'button':
                field = <Button variant="contained" color="secondary" className={classes.button} onClick={() => formButton.action(this)}>
                  {formButton.label}
                </Button>
                break;
              default:
                field = <Button variant="contained" color="primary" className={classes.button} type="submit">
                  {formButton.label}
                </Button>
                break;
            }

            return field;
          })}
        </form>
      </div>
    );
  }
}

EnhancedForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedForm);