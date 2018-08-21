import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import CircularProgress from '@material-ui/core/CircularProgress';

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
	progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class EnhancedExpansionPanel extends React.Component {
	state = {
		expanded: null,
		loading: false,
		data: [],
		content: null
	};

	componentWillReceiveProps = (nextProps) => {
		this.setState({ data: nextProps.data });  
	}

	handleChange = (panel, elem) => (event, expanded) => {
		this.setState({expanded: expanded ? panel : false, content: null, loading: true});

		if(expanded) {
			if(typeof elem.content === "function") {
				elem.content().then(response => {
					this.setState({content: response, loading: false});
				}).catch(error => {
					this.setState({content: error, loading: false});
				});
			} else {
				this.setState({content: elem.content, loading: false});
			}
		} else {
			this.setState({loading: false});
		}
	};

  render = () => {
		const { classes } = this.props;
		const { data, content, expanded } = this.state;
	
		return (
      <div className={classes.root}>
				{this.state.loading && <CircularProgress className={classes.progress} />}
				{data.map((elem, index) => {
					if(elem) {
						let ePanel = <ExpansionPanel expanded={expanded === 'panel' + index} onChange={this.handleChange('panel' + index, elem)} key={elem.key}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className={classes.heading}>{elem.title}</Typography>
								<Typography className={classes.secondaryHeading}>{elem.description}</Typography>
							</ExpansionPanelSummary>
							{
								(content) ? (
									<ExpansionPanelDetails>
										{content}
									</ExpansionPanelDetails>
								) : null
							}
						</ExpansionPanel>;
						
						return ePanel;
					} else {
						return null;
					}
				})}
      </div>
    );
  }
}

EnhancedExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedExpansionPanel);