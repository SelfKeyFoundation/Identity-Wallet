import React from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core';
import { AttributesTable, Alert } from '../../../common';

const styles = theme => ({
	container: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '20px'
	}
});

export const BankingAccountOption = withStyles(styles)(({ classes, account }) => {
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
	const oppeningOptions = [
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
		<Grid
			container
			direction="column"
			justify="flex-start"
			alignItems="stretch"
			spacing={40}
			className={classes.container}
		>
			<Grid item>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="stretch"
					spacing={40}
				>
					<Grid item>
						<Typography variant="caption" color="secondary">
							Min. Balance:
						</Typography>
						<Typography variant="caption">
							{account.minDeposit} ${account.minDepositCurrency}
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="caption" color="secondary">
							Personal Visit Required:
						</Typography>
						<Typography variant="caption">
							{account.personalVisit ? 'Yes' : 'No'}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={40}>
				<Grid item xs>
					<AttributesTable title="Account" attributes={accountOptions} />
				</Grid>

				<Grid item xs>
					<AttributesTable title="Account Opening" attributes={oppeningOptions} />
				</Grid>
			</Grid>
			<Grid item>
				<Typography variant="h2">Eligibility</Typography>
				<br />
				<br />
				<Typography variant="body2">{account.eligibilityExpanded}</Typography>
				<br />
				<br />
				<Alert type="warning">
					Please make sure you understand the bank requirements and that you are
					able/willing to fulfill them before placing your order.
				</Alert>
			</Grid>
			<Grid item>
				<Divider />
			</Grid>
			<Grid item>
				<Typography variant="h2">Extra KYC Requirements</Typography>
				<br />
				<br />
				<Typography variant="body2">
					<span style={{ fontWeight: 700 }}>
						Bank Specific KYC Requirements might apply.
					</span>{' '}
					If this is the case you will be asked for additional documents tp fill, after
					the basic KYC information and documents have been validated.
				</Typography>
			</Grid>
		</Grid>
	);
});

export default BankingAccountOption;
