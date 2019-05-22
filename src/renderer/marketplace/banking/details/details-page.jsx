import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';
import { MoneyIcon } from 'selfkey-ui';
import { FlagCountryName, ResumeBox, ProgramPrice } from '../../common';
import { KycRequirementsList } from '../../../kyc/requirements/requirements-list';
import { BankingDetailsPageTabs } from './details-tabs';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	backButtonContainer: {
		left: '20px',
		position: 'absolute',
		top: '20px'
	},
	bold: {
		fontWeight: 600
	},
	flagCell: {
		width: '10px'
	},
	title: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
	content: {
		background: '#262F39',
		padding: '22px 30px',
		width: '100%',
		justifyContent: 'space-between'
	},
	resumeTable: {
		'& div': {
			padding: '10px 15px',
			width: '125px'
		},
		'& label': {
			fontSize: '13px',
			color: '#93B0C1'
		},
		'& h4': {
			marginTop: '0.25em',
			minHeight: '30px',
			color: '#00C0D9'
		}
	},
	programBrief: {
		display: 'flex',
		border: '1px solid #303C49',
		borderRadius: '4px',
		background: '#2A3540'
	},
	applyButton: {
		maxWidth: '270px',
		textAlign: 'right',
		'& button': {
			width: '100%',
			marginBottom: '1em'
		},
		'& div.price': {
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '16px',
			fontWeight: 'bold',
			color: '#00C0D9'
		},
		'& span.price-key': {
			color: '#93B0C1',
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '12px',
			display: 'block',
			fontWeight: 'normal',
			marginTop: '5px'
		}
	},
	tabsRoot: {
		borderBottom: '1px solid #697C95',
		width: '100%'
	},
	tabsIndicator: {
		backgroundColor: '#00C0D9'
	},
	tabRoot: {
		color: '#FFFFFF',
		textAlign: 'center',
		padding: '0',
		minWidth: '150px'
	},
	tabLabelContainer: {
		padding: '0',
		textTransform: 'Capitalize'
	},
	tabWrapper: {
		padding: '0',
		textTransform: 'Capitalize'
	},
	tabLabel: {
		color: '#FFFFFF'
	},
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
		},
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
	tabDescription: {
		marginTop: '40px'
	},
	moneyIcon: {
		marginRight: '18px'
	},

	page: {
		position: 'relative',
		paddingTop: '80px'
	}
});

export const BankingApplicationButton = withStyles(styles)(
	({ classes, canOpenBankAccount, startApplication, loading }) => (
		<React.Fragment>
			{canOpenBankAccount && !loading && (
				<Button variant="contained" size="large" onClick={startApplication}>
					<MoneyIcon className={classes.moneyIcon} />
					Open Bank Account
				</Button>
			)}

			{canOpenBankAccount && loading && (
				<Button variant="contained" size="large" disabled>
					Loading ...
				</Button>
			)}
		</React.Fragment>
	)
);

export const BankingDetailsPage = withStyles(styles)(props => {
	const {
		classes,
		applicationStatus,
		countryCode,
		region,
		contact,
		onPay,
		onBack,
		loading,
		canOpenBankAccount,
		resume = [],
		startApplication,
		keyRate,
		price,
		tab,
		kycRequirements,
		onTabChange
	} = props;
	return (
		<div className={classes.page}>
			<div className={classes.backButtonContainer}>
				<Button variant="outlined" color="secondary" onClick={onBack}>
					<Typography variant="subtitle2" color="secondary" className={classes.bold}>
						‹ Back
					</Typography>
				</Button>
			</div>
			<div className={classes.container}>
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.title}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						{region}
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<ApplicationStatusBar
						status={applicationStatus}
						contact={contact}
						paymentAction={onPay}
					/>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="stretch"
						className={classes.content}
					>
						<Grid item>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="flex-start"
							>
								<Grid item>
									<ResumeBox itemSets={resume} />
								</Grid>
								<Grid item className={classes.applyButton}>
									<BankingApplicationButton
										canOpenBankAccount={canOpenBankAccount}
										price={price}
										loading={loading}
										startApplication={startApplication}
										keyRate={keyRate}
									/>
									<ProgramPrice price={price} rate={keyRate} label="Pricing: $" />
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<BankingDetailsPageTabs
								{...props}
								tab={tab}
								onTabChange={onTabChange}
							/>
						</Grid>
						<Grid item>
							<KycRequirementsList
								requirements={kycRequirements}
								loading={loading}
								title="KYC Requirements and Forms"
							/>
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
});

export default BankingDetailsPage;
