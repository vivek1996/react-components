import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
	marginTop: "30px",
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ControlledExpansionPanels extends React.Component {
	constructor(props) {
		super(props);

		this.state = props;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ expanded: nextProps.expanded, content: nextProps.content, data: nextProps.data });  
	}
//   state = {
//     expanded: null,
//   };

//   handleChange = panel => (event, expanded) => {
// 	console.log("handleChange", panel, event, expanded);
// 	if(expanded) {
// 		console.log("Expanded");
// 	} else {
// 		console.log("Collapsed");
// 	}
//     this.setState({
//       expanded: expanded ? panel : false,
//     });
//   };

  render() {
		const { classes } = this.props;
		const { expanded, data, content } = this.state;
	
		return (
      <div className={classes.root}>
		{data.map((elem, index) => {
			if(elem) {
				let ePanel = <ExpansionPanel expanded={expanded === 'panel' + index} onChange={this.state.handleChange('panel' + index, elem)} key={elem.key}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>{elem.title}</Typography>
						<Typography className={classes.secondaryHeading}>{elem.description}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{content}
					</ExpansionPanelDetails>
				</ExpansionPanel>;
				
				return ePanel;
			} else {
				return "";
			}
		})}
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);