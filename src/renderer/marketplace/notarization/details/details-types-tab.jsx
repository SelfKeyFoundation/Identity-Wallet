import React, { Component } from 'react';
import {
	withStyles,
	Typography,
	ExpansionPanel,
	ExpansionPanelDetails,
	ExpansionPanelSummary,
	Divider
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const styles = theme => ({
	tabContainer: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		padding: '30px 0',
		width: '100%',
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
		padding: '15px 0 !important'
	},
	panelBox: {
		alignItems: 'unset',
		display: 'flex',
		justifyContent: 'flex-start',
		flexWrap: 'nowrap',
		padding: '15px 0 !important'
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
	},
	panelTextWrap: {
		display: 'flex',
		flexDirection: 'column'
	},
	panelText: {
		alignItems: 'baseline',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: '5px'
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
			<Typography variant="h2" className={classes.panelTitle}>
				{panelDetails.panelTitle}
			</Typography>
			<ul>
				{panelDetails.list.map((item, indx) => {
					return <li key={indx}>{item}</li>;
				})}
			</ul>
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
				<div className={classes.gridPadding}>
					<Typography variant="body1" color="secondary">
						Check out the allowed document types before submitting your request. If you
						have any doubts you can contact us at help@sekfley.org
					</Typography>
				</div>
				{panelDetails.map((panel, indx) => {
					return (
						<div key={indx} className={classes.panelBox}>
							<ExpansionPanel
								onChange={(e, expanded) => this.toggleOption(expanded)}
								className={classes.expansionPanel}
							>
								<ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
									<div className={classes.panelTextWrap}>
										<div className={classes.panelText}>
											<Typography variant="h2">{panel.title}</Typography>
										</div>
										<div className={classes.panelText}>
											<Typography variant="body2" color="secondary">
												{panel.subtitle}
											</Typography>
										</div>
									</div>
								</ExpansionPanelSummary>
								<Divider />
								<PanelDetails panelDetails={panel} />
							</ExpansionPanel>
						</div>
					);
				})}
			</div>
		);
	}
}

export const NotarizationTypesTab = withStyles(styles)(NotarizationTypesTabComponent);

export default NotarizationTypesTab;
