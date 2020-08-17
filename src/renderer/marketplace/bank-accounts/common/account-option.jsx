import React from 'react';
import {
	Grid,
	Typography,
	Divider,
	ExpansionPanelDetails,
	ExpansionPanel,
	ExpansionPanelSummary,
	Radio
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { AttributesTable, Alert } from '../../../common';
import { typography, DropdownIcon } from 'selfkey-ui';
import { sanitize } from '../../common';

const styles = theme => ({
	container: {},
	tabContent: {
		marginTop: '15px',
		marginBottom: '15px'
	},
	li: {
		marginBottom: '20px'
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
		marginBottom: '10px',
		width: '100%'
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
	},
	selectionSection: {
		borderColor: '#384656',
		borderRadius: '5px 0 0 5px',
		borderStyle: 'solid',
		borderWidth: '1px 0px 1px 1px',
		padding: '3%'
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
					If this is the case you will be asked for additional documents to fill, after
					the basic KYC information and documents have been validated.
				</Typography>
			)}
		</Grid>
	</Grid>
));

export const BankingAccountOption = withStyles(styles)(
	({
		classes,
		account,
		jurisdiction,
		isOpen,
		title,
		toggleOpen,
		onSelectOption,
		selectedValue,
		showBankName = false
	}) => {
		const accountOptions = [
			{
				name: 'Type of Account:',
				value: jurisdiction.data.type
			},
			{
				name: 'Currencies:',
				value: account.currencies ? account.currencies.join(', ') : ''
			},
			{
				name: 'Minimum Deposit Ongoing Balance:',
				value: `${account.minInitialDeposit}`
			},
			{
				name: 'Cards:',
				value: account.cards ? account.cards.join(', ') : ''
			},
			{
				name: 'Online Banking:',
				value: account.onlineBanking ? account.onlineBanking.join(', ') : ''
			},
			{
				name: 'Good for:',
				value: account.goodFor ? account.goodFor.join(', ') : ''
			}
		];
		const openingOptions = [
			{
				name: 'Personal Visit Required:',
				value: account.personalVisitRequired ? 'Yes' : 'No'
			},
			{
				name: 'Average time to open:',
				value: account.timeToOpen
			}
		];
		showBankName = showBankName && account.bankName;
		const optionValue = `${account.bankName} ${account.accountTitle}`;
		const gridSize = showBankName ? 11 : 12;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="unset"
				spacing={0}
				wrap="nowrap"
			>
				{showBankName && (
					<Grid item xs={1} className={classes.selectionSection}>
						<Radio
							checked={selectedValue === optionValue}
							onChange={onSelectOption}
							value={optionValue}
							name="radio-button-option"
							aria-label={account.bankName}
						/>
					</Grid>
				)}

				<Grid item xs={gridSize}>
					<ExpansionPanel
						expanded={isOpen}
						onChange={(e, expanded) => toggleOpen && toggleOpen(expanded)}
						style={{ borderRadius: '0 4px 4px 0' }}
					>
						<ExpansionPanelSummary expandIcon={<DropdownIcon />}>
							<Grid container direction="column" spacing={1}>
								<Grid item>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="baseline"
										spacing={1}
									>
										<Grid item>
											<Typography variant="h2">
												{showBankName ? account.bankName : title}
											</Typography>
										</Grid>
										{account.accountTitle && (
											<Grid item>
												<Typography variant="subheading">
													{' '}
													- {account.accountTitle}
												</Typography>
											</Grid>
										)}
									</Grid>
								</Grid>
								<Grid item>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="baseline"
									>
										<Grid item className={classes.panelHeaderText}>
											<span className={classes.title}>Min Balance:</span>
											<span className={classes.headerText}>
												{account.minInitialDeposit}
											</span>
										</Grid>
										<Grid item>
											<span className={classes.title}>
												Personal Visit Required:
											</span>
											<span className={classes.headerText}>
												{account.personalVisitRequired ? 'Yes' : 'No'}
											</span>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</ExpansionPanelSummary>
						<Divider />
						<ExpansionPanelDetails className={classes.flexColumn}>
							<br />
							<Grid container spacing={4}>
								<Grid item xs>
									<AttributesTable title="Account" attributes={accountOptions} />
								</Grid>

								<Grid item xs>
									<AttributesTable
										title="Account Opening"
										attributes={openingOptions}
									/>
								</Grid>
							</Grid>

							<Grid item>
								<Grid container direction="column" className={classes.eligibility}>
									<Grid item className={classes.eligibilityGrid}>
										<Typography
											variant="body2"
											dangerouslySetInnerHTML={{
												__html: sanitize(account.details)
											}}
										/>
									</Grid>

									<Grid item>
										<Typography variant="h2">Eligibility</Typography>
									</Grid>
									<br />
									<Grid item className={classes.eligibilityGrid}>
										<Typography variant="body2">
											{account.eligibility}
										</Typography>
									</Grid>
									<Alert type="warning" classname={classes.alert}>
										<Typography variant="subtitle2" color="secondary">
											Please make sure you understand the bank requirements
											and that you are able/willing to fulfill them before
											placing your order.
										</Typography>
									</Alert>
								</Grid>
							</Grid>
							<Grid item>
								<Divider />
							</Grid>
							<Grid item>
								<ExtraKYCRequirements text={account.kyc} />
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
			</Grid>
		);
	}
);

export default BankingAccountOption;
