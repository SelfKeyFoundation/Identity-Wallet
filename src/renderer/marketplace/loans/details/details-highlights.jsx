import React from 'react';
import { Typography, FormControl, FormGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	container: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr'
	},
	formGroup: {
		'& > div': {
			marginBottom: '1em',
			fontSize: '14px',
			'& p': {
				display: 'inline'
			}
		},
		backgroundColor: 'transparent',
		'& h5': {
			marginRight: '.5em',
			display: 'inline-block'
		}
	},
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		marginLeft: '1em'
	}
});

const onKycPolicyClick = url => window.openExternal(null, url);

const LoansDetailsHighlights = withStyles(styles)(({ classes, item }) => (
	<div className={classes.container}>
		<FormControl className={classes.formControl}>
			<FormGroup className={classes.formGroup}>
				<div>
					<Typography variant="h5">Location:</Typography>
					<Typography variant="body2">
						{item.data.location && item.data.location.join(', ')}
					</Typography>
				</div>
				<div>
					<Typography variant="h5">Year Launched:</Typography>
					<Typography variant="body2">{item.data.yearLaunched}</Typography>
				</div>
				<div>
					<Typography variant="h5">Type:</Typography>
					<Typography variant="body2">{item.data.type}</Typography>
				</div>
				{item.data.interestRateLending && (
					<div>
						<Typography variant="h5">Current Rate Lending:</Typography>
						<Typography variant="body2">{item.data.interestRateLending}</Typography>
					</div>
				)}
				{item.data.interestRateBorrowing && (
					<div>
						<Typography variant="h5">Current Rate Borrowing:</Typography>
						<Typography variant="body2">{item.data.interestRateBorrowing}</Typography>
					</div>
				)}
				<div>
					<Typography variant="h5">URL:</Typography>
					<Typography variant="body2">{item.data.url}</Typography>
				</div>
				<div>
					<Typography variant="h5">Contact:</Typography>
					<Typography variant="body2">{item.data.email}</Typography>
				</div>
			</FormGroup>
		</FormControl>

		<FormControl className={classes.formControl}>
			<FormGroup className={classes.formGroup}>
				<div>
					<Typography variant="h5">Payment Methods:</Typography>
					<Typography variant="body2">
						{item.data.paymentMethods && item.data.paymentMethods.join(', ')}
					</Typography>
				</div>
				<div>
					<Typography variant="h5">Assets Supported:</Typography>
					<Typography variant="body2">
						{item.data.assets && item.data.assets.join(', ')}
					</Typography>
				</div>
				{item.data.maxLoanLending && (
					<div>
						<Typography variant="h5">Maximum Loan Amount (Lending):</Typography>
						<Typography variant="body2">{item.data.maxLoanLending}</Typography>
					</div>
				)}

				{item.data.maxLoanBorrowing && (
					<div>
						<Typography variant="h5">Maximum Loan Amount (Borrowing):</Typography>
						<Typography variant="body2">{item.data.maxLoanBorrowing}</Typography>
					</div>
				)}

				{item.data.maxLoanTermLending && (
					<div>
						<Typography variant="h5">Maximum Loan Term (Lending):</Typography>
						<Typography variant="body2">{item.data.maxLoanTermLending}</Typography>
					</div>
				)}

				{item.data.maxLoanTermLending && (
					<div>
						<Typography variant="h5">Maximum Loan Term (Borrowing):</Typography>
						<Typography variant="body2">{item.data.maxLoanTermBorrowing}</Typography>
					</div>
				)}

				<div>
					<Typography variant="h5">KYC/AML:</Typography>
					<Typography variant="body2">
						{item.data.kyc ? 'Yes ' : 'No '}
						{item.data.kyc && item.data.kycPolicyUrl ? (
							<span
								className={classes.link}
								onClick={() => onKycPolicyClick(item.data.kycPolicyUrl)}
							>
								KYC Policy
							</span>
						) : null}
					</Typography>
				</div>
			</FormGroup>
		</FormControl>
	</div>
));

export { LoansDetailsHighlights };
export default LoansDetailsHighlights;
