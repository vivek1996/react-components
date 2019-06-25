import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.typography.button,
    
    // padding: theme.spacing.unit,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,

    // justifyContent: 'center',
    // padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  toggleButton: {
    minWidth: '42%',
    padding: "".concat(theme.spacing.unit - 4, "px ").concat(theme.spacing.unit * 1.5, "px"),
    borderRadius: 2,
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '#f5f5f5',
    color: 'rgba(0, 0, 0, .3)',
    // '&:hover': {
    //   textDecoration: 'none',
    //   // Reset on mouse devices
    //   backgroundColor: theme.palette.primary.main,
    //   '@media (hover: none)': {
    //     backgroundColor: 'transparent'
    //   },
    //   '&$disabled': {
    //     backgroundColor: 'transparent'
    //   }
    // },
    '&:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    },
    '&:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  toggleButtonSelected: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    '&:after': {
      backgroundColor: theme.palette.primary.main,
      opacity: .1
    },
    '& + &:before': {
      opacity: .1
    }
  }
});

class Toggle extends React.Component {
	state = {
    isSelected: false
	}

  handleClick = (event) => {
    const name = (event.target.name) ? event.target.name : event.target.getAttribute('name');
    const value = (event.target.value) ? event.target.value : event.target.getAttribute('value');
    
    if(this.state.isSelected !== value) {
      this.setState({ isSelected: value }, () => {
        this.props.onChange(name, value);
      });
    }
  }

  componentDidMount = () => {
    if(this.props.value) {
      this.setState({ isSelected: this.props.value }, () => {
        this.props.onChange(this.props.name, this.props.value);
      });
    }
  }

	render = () => {
    const {classes, options, name} = this.props;
    const {isSelected} = this.state;

		return (
			<div className={classes.root}>
				{options.map(option => {
          let optionValue = (typeof option === 'object' && option.hasOwnProperty('value')) ? option.value : option;
          let optionLabel = (typeof option === 'object' && option.hasOwnProperty('label')) ? option.label : option;
          let selected = (isSelected === optionValue) ? true : false;
          
					return (
            <Typography 
              value={optionValue}
              key={`${(new Date()).getTime()}-toggle-button-${optionLabel}`}
              name={name}
              onClick={this.handleClick}
              className={classNames(classes.toggleButton, selected && classes.toggleButtonSelected)}
              classes={{
                root: classes.toggleButton
              }}
            >
              {optionLabel}
            </Typography>
					);
				})}
			</div>
		);
	}
}

Toggle.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Toggle);