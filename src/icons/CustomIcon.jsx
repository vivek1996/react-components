import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  icon: {
		display: 'inline-flex',
		flexShrink: 0,
		marginRight: theme.spacing.unit * 2
  }
});

class CustomIcon extends React.Component {
	render() {
    	const { name, font, color, size, ...other } = this.props;
	  	return <Icon
		  name='down-circle'
		  color='white'
		  size={30}
		  // style={{}}
		  {...other}
		/>
	}
}

export default withStyles(styles)(CustomIcon);