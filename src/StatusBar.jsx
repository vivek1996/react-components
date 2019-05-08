import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  connectorActive: {
    borderColor: '#00bf6f',
    '& $connectorLine': {
      // borderColor: theme.palette.secondary.main,
      borderColor: '#00bf6f',
    },
  },
  connectorCompleted: {
    '& $connectorLine': {
      // borderColor: theme.palette.primary.main,
      borderColor: '#00bf6f',
    },
  },
  connectorDisabled: {
    borderColor: theme.palette.grey[100],
    // '& $connectorLine': {
    //   // borderColor: theme.palette.grey[100],
    //   borderColor: '#00bf6f',
    // },
  },
  connectorLine: {
    transition: theme.transitions.create('border-color'),
    borderWidth: '2px'
  },
  inprocess: {
    color: 'red'
  },
  completed: {
    color: '#00bf6f'
  }
});

class StatusBar extends React.Component {
  state = {
    activeStep: 0,
    skipped: new Set(),
  };

  isStepOptional = step => step === 1;

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  render() {
    const { classes, steps } = this.props;
    const { activeStep } = this.state;
    const connector = (
      <StepConnector
        classes={{
          active: classes.connectorActive,
          completed: classes.connectorCompleted,
          disabled: classes.connectorDisabled,
          line: classes.connectorLine,
        }}
      />
    );

    return (
      <Stepper activeStep={activeStep} connector={connector} alternativeLabel>
        {steps.map(step => {
          const props = {};
          const labelProps = {};

          if (step.completed) {
            props.completed = true;
            labelProps.StepIconProps = {
              classes:{
                completed: classes.completed
              }
            };
          }

          if (step.error) {
            labelProps.error = true;
          }

          if (step.icon) {
            labelProps.icon = step.icon;
          }

          if (step.inprocess) {
            labelProps.StepIconProps = {
              active: true,
              classes:{
                active: classes.inprocess
              }
            };
          }

          return (
            <Step key={step.label} {...props}>
              <StepLabel {...labelProps}>{step.label}</StepLabel>
            </Step>
          );
        })}
        {/* <Step key={1} {...props}>
          <StepLabel icon={<LinkIcon />} StepIconComponent={LinkIcon} StepIconProps={{completed: true}}>{'label 1'}</StepLabel>
          <StepLabel>{'label 1'}</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>{'label 2'}</StepLabel>
        </Step>
        <Step key={3}>
          <StepLabel>{'label 3'}</StepLabel>
        </Step> */}
      </Stepper>
    );
  }
}

StatusBar.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(StatusBar);