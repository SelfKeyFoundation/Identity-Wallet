import React from 'react';
import {
	withStyles,
	Grid,
	Typography,
	Divider,
	ExpansionPanelDetails,
	ExpansionPanel,
	ExpansionPanelSummary
} from '@material-ui/core';
import { AttributesTable, Alert } from '../../../common';
import { typography } from 'selfkey-ui';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const styles = theme => ({
	container: {},
	tabContent: {
		marginTop: '15px',
		marginBottom: '15px'
	},
	li: {
		marginBottom: '20px'
	},
	panelSummary: {
		'& div:first-child': {
			flexDirection: 'column'
		}
	},
	panelHeaderText: {
		marginRight: '40px'
	},
	title: {
		color: typography,
		marginRight: '10px'
	},
	headerText: {
		fontWeight: 600,
		textTransform: 'capitalize'
	},
	panelSummaryItem: {
		marginBottom: '10px'
	},
	bold: {
		fontWeight: 600
	},
	uppercase: {
		textTransform: 'uppercase'
	},
	alert: {
		marginBottom: '40px'
	},
	listItem: {
		alignItems: 'baseline',
		display: 'flex',
		paddingLeft: 0,
		paddingRight: 0
	},
	listItemText: {
		width: '37%'
	},
	extraKYC: {
		marginBottom: '30px',
		marginTop: '40px'
	},
	bottomSpace: {
		marginBottom: '15px'
	},
	eligibility: {
		marginTop: '40px'
	},
	eligibilityGrid: {
		marginBottom: '25px'
	},
	eligibilityList: {
		listStyle: 'decimal',
		paddingLeft: '25px'
	},
	padding: {
		paddingLeft: 0,
		paddingRight: 0
	},
	flexColumn: {
		flexDirection: 'column'
	}
});

const ExtraKYCRequirements = withStyles(styles)(({ classes, text }) => (
	<Grid container direction="column" className={classes.extraKYC}>
		<Grid item>
			<Typography variant="body1" className={classes.bottomSpace}>
				Extra KYC Requirements
			</Typography>
		</Grid>
		<Grid item>
			{!!text && <Typography variant="body2">{text}</Typography>}
			{!text && (
				<Typography variant="body2">
					<span style={{ fontWeight: 700 }}>
						Bank Specific KYC Requirements might apply.
					</span>{' '}
					If this is the case you will be asked for additional documents tp fill, after
					the basic KYC information and documents have been validated.
				</Typography>
			)}
		</Grid>
	</Grid>
));

export const BankingAccountOption = withStyles(styles)(
	({ classes, account, isOpen, title, toggleOpen }) => {
		const accountOptions = [
			{
				name: 'Type of Account:',
				value: account.type
			},
			{
				name: 'Currencies:',
				value: account.currencies
			},
			{
				name: 'Minimum Deposit Ongoing Balance:',
				value: `${account.minDeposit} ${account.minDepositCurrency}`
			},
			{
				name: 'Cards:',
				value: account.cards
			},
			{
				name: 'Online Banking:',
				value: account.onlineBanking
			},
			{
				name: 'Good for:',
				value: account.goodFor.join(', ')
			}
		];
		const openingOptions = [
			{
				name: 'Personal Visit Required:',
				value: account.personalVisit ? 'Yes' : 'No'
			},
			{
				name: 'Average time to open:',
				value: account.avgOpenTime
			}
		];
		return (
			<ExpansionPanel expanded={isOpen} onChange={(e, expanded) => toggleOpen(expanded)}>
				<ExpansionPanelSummary
					expandIcon={<ExpandLessIcon />}
					className={classes.panelSummary}
				>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="baseline"
						className={classes.panelSummaryItem}
					>
						<Typography variant="h2">{title}</Typography>
					</Grid>
					<Grid container direction="row" justify="flex-start" alignItems="baseline">
						<Grid item className={classes.panelHeaderText}>
							<span className={classes.title}>Min Balance:</span>
							<span className={classes.headerText}>{account.minDepositCurrency}</span>
						</Grid>
						<Grid item>
							<span className={classes.title}>Personal Visit Required:</span>
							<span className={classes.headerText}>
								{account.personalVisit ? 'Yes' : 'No'}
							</span>
						</Grid>
					</Grid>
				</ExpansionPanelSummary>
				<Divider />
				<ExpansionPanelDetails className={classes.flexColumn}>
					<br />
					<Grid container spacing={32}>
						<Grid item xs>
							<AttributesTable title="Account" attributes={accountOptions} />
						</Grid>

						<Grid item xs>
							<AttributesTable title="Account Opening" attributes={openingOptions} />
						</Grid>
					</Grid>

					<Grid item>
						<Grid container direction="column" className={classes.eligibility}>
							<Grid item>
								<Typography variant="h2">Eligibility</Typography>
							</Grid>
							<br />
							<Grid item className={classes.eligibilityGrid}>
								<Typography variant="body2">
									{account.eligibilityExpanded}
								</Typography>
							</Grid>
							<Alert type="warning" classname={classes.alert}>
								Please make sure you understand the bank requirements and that you
								are able/willing to fulfill them before placing your order.
							</Alert>
						</Grid>
					</Grid>
					<Grid item>
						<Divider />
					</Grid>
					<Grid item>
						<ExtraKYCRequirements />
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
);

export default BankingAccountOption;
