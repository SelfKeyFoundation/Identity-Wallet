import React from 'react';
import {
	Typography,
	ExpansionPanel,
	ExpansionPanelSummary,
	Grid,
	Divider,
	ExpansionPanelDetails,
	Card,
	CardHeader,
	CardContent,
	List,
	ListItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { typography } from 'selfkey-ui';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Alert } from './alert';

const styles = theme => ({
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

const Account = withStyles(styles)(({ classes, data }) => (
	<Grid item xs>
		<Card>
			<CardHeader title="Account" />
			<Divider />
			<CardContent>
				<List className={classes.padding}>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Type of Account:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={classes.bold}
						>
							{data.type}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Currencies:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={`${classes.bold} ${classes.uppercase}`}
						>
							{data.currencies.map((currency, i) => {
								return i < data.currencies.length - 1
									? `${currency}, `
									: `${currency}`;
							})}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Minimum Deposit Ongoing Balance:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={classes.bold}
						>
							{data.minDeposit}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Cards:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={`${classes.bold} ${classes.headerText}`}
						>
							{data.cards.map((card, i) => {
								return i < data.cards.length - 1 ? `${card}, ` : `${card}`;
							})}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Online Banking:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={`${classes.bold} ${classes.uppercase}`}
						>
							{data.onlineBanking.map((banking, i) => {
								return i < data.onlineBanking.length - 1
									? `${banking}, `
									: `${banking}`;
							})}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Good For:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={`${classes.bold} ${classes.headerText}`}
						>
							{data.goodFor}
						</Typography>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	</Grid>
));

const AccountOpening = withStyles(styles)(({ classes, data }) => (
	<Grid item xs>
		<Card>
			<CardHeader title="Account Opening" />
			<Divider />
			<CardContent>
				<List className={classes.padding}>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Personal Visit Required:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={`${classes.bold} ${classes.headerText}`}
						>
							{data.visitRequired}
						</Typography>
					</ListItem>
					<ListItem className={classes.listItem}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							Average time to open:
						</Typography>
						<Typography
							variant="body2"
							align="right"
							gutterBottom
							className={classes.bold}
						>
							{data.timeToOpen}
						</Typography>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	</Grid>
));

const ExtraKYCRequirements = withStyles(styles)(({ classes, data }) => (
	<Grid container direction="column" className={classes.extraKYC}>
		<Grid item>
			<Typography variant="body1" className={classes.bottomSpace}>
				Extra KYC Requirements
			</Typography>
		</Grid>
		<Grid item>
			<Typography variant="body2">{data.text}</Typography>
		</Grid>
	</Grid>
));

const Eligibility = withStyles(styles)(({ classes, data }) => (
	<Grid container direction="column" className={classes.eligibility}>
		<Grid item>
			<Typography variant="body1" className={classes.bottomSpace}>
				Eligibility
			</Typography>
		</Grid>
		<br />
		<Grid item className={classes.eligibilityGrid}>
			<ol className={classes.eligibilityList}>
				{data.eligibility.map((text, i) => {
					return (
						<li className={classes.li} key={i}>
							<Typography variant="body2">{text}</Typography>
						</li>
					);
				})}
			</ol>
		</Grid>

		{data.alert ? (
			<Alert type={data.alert.type} className={classes.alert}>
				{data.alert.text}
			</Alert>
		) : (
			''
		)}
		<Divider />
	</Grid>
));

export const Accordion = withStyles(styles)(({ classes, data, open, extraKYCRequirements }) => (
	<ExpansionPanel defaultExpanded={open}>
		<ExpansionPanelSummary expandIcon={<ExpandLessIcon />} className={classes.panelSummary}>
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="baseline"
				className={classes.panelSummaryItem}
			>
				<Typography variant="h2">{data.basic.name}</Typography>
			</Grid>
			<Grid container direction="row" justify="flex-start" alignItems="baseline">
				<Grid item className={classes.panelHeaderText}>
					<span className={classes.title}>Min Balance:</span>
					<span className={classes.headerText}>{data.basic.minBalance}</span>
				</Grid>
				<Grid item>
					<span className={classes.title}>Personal Visit Required:</span>
					<span className={classes.headerText}>{data.basic.visitRequired}</span>
				</Grid>
			</Grid>
		</ExpansionPanelSummary>
		<Divider />

		<ExpansionPanelDetails className={classes.flexColumn}>
			<br />
			<Grid container spacing={4}>
				{data.account ? <Account data={data.account} /> : ''}
				{data.accountOpening ? <AccountOpening data={data.accountOpening} /> : ''}
			</Grid>

			{data.eligibility ? <Eligibility data={data} /> : ''}

			{data.extraKYCRequirements ? (
				<ExtraKYCRequirements data={data.extraKYCRequirements} />
			) : (
				''
			)}
		</ExpansionPanelDetails>
	</ExpansionPanel>
));

export default Accordion;
