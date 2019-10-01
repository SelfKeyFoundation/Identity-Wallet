import React, { Component } from 'react';
import {
	withStyles,
	Typography,
	Grid,
	ExpansionPanel,
	ExpansionPanelDetails,
	ExpansionPanelSummary,
	Divider
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '30px 0',
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	gridPadding: {
		padding: '15px 20px !important'
	},
	flexColumn: {
		flexDirection: 'column',
		marginTop: '15px'
	},
	expansionPanel: {
		borderRadius: '4px',
		width: '100%'
	},
	panelTitle: {
		marginBottom: '30px'
	}
});

export const panelDetails = [
	{
		title: 'Identity Documents',
		subtitle: 'Certified True Copies',
		panelTitle: 'Documents may include, but are not limited to:',
		list: [
			'Wills',
			'Trusts',
			'Advanced directives',
			'Executorships',
			'Custody and guardianship agreements',
			'Power of attorney',
			'Court documents'
		]
	},
	{
		title: 'Legal Documents',
		subtitle: 'Legal forms often require notarized signatures.',
		panelTitle: '2 ----- Documents may include, but are not limited to:',
		list: [
			'2 - Wills',
			'2 - Trusts',
			'2 - Advanced directives',
			'2 - Executorships',
			'2 - Custody and guardianship agreements',
			'2 - Power of attorney',
			'2 - Court documents'
		]
	}
];

export const PanelDetails = withStyles(styles)(({ classes, panelDetails }) => {
	return (
		<ExpansionPanelDetails className={classes.flexColumn}>
			<Grid item>
				<Typography variant="h2" className={classes.panelTitle}>
					{panelDetails.panelTitle}
				</Typography>
			</Grid>

			<Grid item>
				<ul>
					{panelDetails.list.map((item, indx) => {
						return <li key={indx}>{item}</li>;
					})}
				</ul>
			</Grid>
		</ExpansionPanelDetails>
	);
});

class NotarizationTypesTabComponent extends Component {
	state = { option: null };
	toggleOption = optionIdx => expanded => {
		const { option } = this.state;
		if (!expanded) {
			return this.setState({ option: null });
		}
		if (option !== optionIdx) {
			return this.setState({ option: optionIdx });
		}
	};
	render() {
		const { classes } = this.props;
		// const { option } = this.state;
		return (
			<div className={classes.tabContainer}>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
					spacing={40}
				>
					<Grid item className={classes.gridPadding}>
						<Typography variant="body1" color="secondary">
							Check out the allowed document types before submitting your request. If
							you have any doubts you can contact us at help@sekfley.org
						</Typography>
					</Grid>
					{panelDetails.map((panel, indx) => {
						return (
							<Grid
								container
								key={indx}
								className={classes.gridPadding}
								direction="row"
								justify="flex-start"
								alignItems="unset"
								spacing={0}
								wrap="nowrap"
							>
								<ExpansionPanel
									onChange={(e, expanded) => toggleOpen(expanded)}
									className={classes.expansionPanel}
								>
									<ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
										<Grid container direction="column" spacing={8}>
											<Grid item>
												<Grid
													container
													direction="row"
													justify="flex-start"
													alignItems="baseline"
													spacing={8}
												>
													<Grid item>
														<Typography variant="h2">
															{panel.title}
														</Typography>
													</Grid>
												</Grid>
											</Grid>
											<Grid item>
												<Grid
													container
													direction="row"
													justify="flex-start"
													alignItems="baseline"
													spacing={8}
												>
													<Grid item>
														<Typography
															variant="body2"
															color="secondary"
														>
															{panel.subtitle}
														</Typography>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</ExpansionPanelSummary>
									<Divider />
									<PanelDetails panelDetails={panel} />
								</ExpansionPanel>
							</Grid>
						);
					})}
				</Grid>
			</div>
		);
	}
}

export const NotarizationTypesTab = withStyles(styles)(NotarizationTypesTabComponent);

export default NotarizationTypesTab;
