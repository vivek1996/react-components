import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import LinearProgress from '@material-ui/core/LinearProgress';

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    width: '100%',
	},
	panelDetail: {
		[theme.breakpoints.only('xs')]: {
      display: 'flex',
		},
		display: 'block',
	},
	summaryContent: {
		[theme.breakpoints.down('xs')]: {
      margin: 0,
    },
	},
	summaryPanel: {
		[theme.breakpoints.down('xs')]: {
      padding: '0px 8px',
    },
	},
  heading: {
		fontSize: theme.typography.pxToRem(15),
		[theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(12),
    },
    // flexBasis: '33.33%',
		// flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		// flexBasis: '60%',
		// [theme.breakpoints.between('sm', 'xl')]: {
    //   flexBasis: '75%',
		// },
		flexBasis: '80%',
    textDecoration: 'none'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
		// flexBasis: '15%',
	},
	headingContent: {
		flexBasis: '80%',
	},
	headingAction: {
		[theme.breakpoints.only('xs')]: {
			flexBasis: '24%',
			marginTop: theme.spacing.unit
		},
		[theme.breakpoints.between('sm', 'md')]: {
			flexBasis: '12%',
		},
		[theme.breakpoints.up('md')]: {
      flexBasis: '8%',
		},
		[theme.breakpoints.between('sm', 'xl')]: {
			display: 'flex',
			alignItems: 'center',
			marginLeft: theme.spacing.unit,
			marginRight: theme.spacing.unit,
		}
  },
});

class EnhancedExpansionPanel extends React.Component {
	constructor(props) {
    super(props);

    this.state = Object.assign({
			expanded: null,
			loading: false,
			data: [],
			content: null
		}, props);
  }

	componentWillReceiveProps = (nextProps) => {
		this.setState({ data: nextProps.data, topActions: nextProps.topActions });  
	}

	handleChange = (panel, elem) => (event, expanded) => {
		this.setState({expanded: expanded ? panel : false, content: null, loading: true});

		if(expanded) {
			if(typeof elem.content === "function") {
				let contentFn = elem.content();
				if(contentFn instanceof Promise) {
					contentFn.then(response => {
						this.setState({content: response, loading: false});
					}).catch(error => {
						this.setState({content: error, loading: false});
					});
				} else {
					this.setState({content: contentFn, loading: false});
				}
			} else {
				this.setState({content: elem.content, loading: false});
			}
		} else {
			this.setState({loading: false});
		}
	};

	toggleExpansionPanel = (panel, elem, expanded) => {
		this.setState({expanded: !expanded ? panel : false, content: null, loading: true});

		if(!expanded) {
			if(typeof elem.content === "function") {
				let contentFn = elem.content();
				if(contentFn instanceof Promise) {
					contentFn.then(response => {
						this.setState({content: response, loading: false});
					}).catch(error => {
						this.setState({content: error, loading: false});
					});
				} else {
					this.setState({content: contentFn, loading: false});
				}
			} else {
				this.setState({content: elem.content, loading: false});
			}
		} else {
			this.setState({loading: false});
		}
	};
	
  render = () => {
		const { classes } = this.props;
		const { data, content, expanded, topActions, actions } = this.state;

		let titleLink = {};

		return (
      <div className={classes.root}>
				{data.map((elem, index) => {
					if(elem) {
						let panel = 'panel' + index;
						return (
							<ExpansionPanel expanded={expanded === panel} key={elem.key}>
								<ExpansionPanelSummary 
									classes={{
										root: classes.summaryPanel, // class name, e.g. `classes-nesting-root-x`
										content: classes.summaryContent, // class name, e.g. `classes-nesting-label-x`
									}}
									IconButtonProps={
										{
											onClick: () => {
												return this.toggleExpansionPanel(panel, elem, (expanded === panel))
											}
										}
									}
									expandIcon={<ExpandMoreIcon />}
								>
									{
										(elem.image) ? (
											<Avatar alt={""} src={elem.image} />
										) : null
									}

									{
										titleLink = (elem.link) ? Object.assign({}, {
											component: Link,
											to: elem.link
										}) : []
									}

									{
										(elem.title && elem.subheading) ? (
											<div>
												<Typography 
													{...titleLink}
													className={classes.heading}
												>
													{(typeof elem.title === "function") ? elem.title() : elem.title}
												</Typography>

												<Typography 
													{...titleLink}
													className={classes.heading}
												>
													{(typeof elem.subheading === "function") ? elem.subheading() : elem.subheading}
												</Typography>
											</div>
										) : (
											(elem.title) ? (
												<Typography 
													{...titleLink}
													className={classes.heading}
												>
													{(typeof elem.title === "function") ? elem.title() : elem.title}
												</Typography>
											) : null
										)
									}
									
									<div className={classes.headingAction}>
										{
											(expanded === panel && topActions) 
											? (topActions.map(action => {
												return (action.icon) ? (
													<Fab aria-label={action.title} className={classes.fab} color={action.color} onClick={() => action.action(this, elem)} size="small" key={"fab"}>
														<action.icon />
													</Fab>
												) : (
													<Button aria-label={action.title} variant="contained" color={action.color} onClick={() => action.action(this, elem)} size="small" key={"button"}>
														{action.label}
													</Button>
												);
											})) 
											: (
												<Typography className={classes.secondaryHeading}>
													{(typeof elem.description === "function") ? elem.description() : elem.description}
												</Typography>
											)
										}
									</div>
								</ExpansionPanelSummary>
								{this.state.loading && <LinearProgress />}
								{
									(expanded === panel && content) ? (
										<ExpansionPanelDetails
											classes={{
												root: classes.panelDetail
											}}
										>
											{content}
										</ExpansionPanelDetails>
									) : null
								}

								{
									(expanded === panel && actions) ? 
									(
										<div>
											<Divider />
											<ExpansionPanelActions>
												{
													topActions.map(action => {
														return (
															<Button aria-label={action.title} color={action.color} onClick={() => action.action(this, elem)} size="small">
																{action.title}
															</Button>
														);
													})
												}
											</ExpansionPanelActions>
										</div>
									) : null
								}
							</ExpansionPanel>
						);
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