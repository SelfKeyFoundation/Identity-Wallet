import React from 'react';
import { withStyles, Typography, Grid, FormControl, FormGroup } from '@material-ui/core';

const styles = theme => ({
	formControl: {
		marginRight: '100px',
		maxWidth: '45%'
	},

	formGroup: {
		backgroundColor: 'transparent',
		'& h5': {
			marginRight: '1em'
		},
		'& span': {
			fontSize: '14px',
			lineHeight: '35px',
			'& h5': {
				display: 'inline'
			},
			'& p': {
				display: 'inline'
			}
		}
	}
});

const LoansDetailsHighlights = withStyles(styles)(({ classes, item }) => (
	<Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={2}>
		<Grid item>
			<FormControl className={classes.formControl}>
				<FormGroup className={classes.formGroup}>
					<span>
						<Typography variant="h5">Location:</Typography>
						<Typography variant="body2">
							{item.data.location &&
								item.data.location.map(name => (
									<span key={name}>{`${name} `}</span>
								))}
						</Typography>
					</span>
					<span>
						<Typography variant="h5">Year Launched:</Typography>
						<Typography variant="body2">{item.data.yearLaunched}</Typography>
					</span>
					<span>
						<Typography variant="h5">Type</Typography>
						<Typography variant="body2">{item.data.type}</Typography>
					</span>
					{item.data.interestRateLending && (
						<span>
							<Typography variant="h5">Current Rate Lending:</Typography>
							<Typography variant="body2">{item.data.interestRateLending}</Typography>
						</span>
					)}
					{item.data.interestRateBorrowing && (
						<span>
							<Typography variant="h5">Current Rate Borrowing:</Typography>
							<Typography variant="body2">
								{item.data.interestRateBorrowing}
							</Typography>
						</span>
					)}
					<span>
						<Typography variant="h5">URL</Typography>
						<Typography variant="body2">{item.data.url}</Typography>
					</span>
					<span>
						<Typography variant="h5">Contact:</Typography>
						<Typography variant="body2">{item.data.email}</Typography>
					</span>
				</FormGroup>
			</FormControl>
			<FormControl className={classes.formControl}>
				<FormGroup className={classes.formGroup}>
					<span>
						<Typography variant="h5">Payment Methods:</Typography>
						<Typography variant="body2">
							{item.data.paymentMethods &&
								item.data.paymentMethods.map(name => (
									<span key={name}>{`${name} `}</span>
								))}
						</Typography>
					</span>
					<span>
						<Typography variant="h5">Assets Supported:</Typography>
						<Typography variant="body2">
							{item.data.assets &&
								item.data.assets.map(name => <span key={name}>{`${name} `}</span>)}
						</Typography>
					</span>
					{item.data.maxLoanLending && (
						<span>
							<Typography variant="h5">Maximum Loan Amount (Lending):</Typography>
							<Typography variant="body2">{item.data.maxLoanLending}</Typography>
						</span>
					)}
					{item.data.maxLoanBorrowing && (
						<span>
							<Typography variant="h5">Maximum Loan Amount (Borrowing):</Typography>
							<Typography variant="body2">{item.data.maxLoanBorrowing}</Typography>
						</span>
					)}
					{item.data.maxLoanTermLending && (
						<span>
							<Typography variant="h5">Maximum Loan Term (Lending):</Typography>
							<Typography variant="body2">{item.data.maxLoanTermLending}</Typography>
						</span>
					)}
					{item.data.maxLoanTermLending && (
						<span>
							<Typography variant="h5">Maximum Loan Term (Borrowing):</Typography>
							<Typography variant="body2">
								{item.data.maxLoanTermBorrowing}
							</Typography>
						</span>
					)}
					<span>
						<Typography variant="h5">KYC/AML:</Typography>
						<Typography variant="body2">
							{item.data.kyc ? 'Yes' : 'No'}
							{item.data.kyc && item.data.kycPolicyUrl ? (
								<a href={item.data.kycPolicyUrl}>KYC Policy</a>
							) : null}
						</Typography>
					</span>
				</FormGroup>
			</FormControl>
		</Grid>
	</Grid>
));

export { LoansDetailsHighlights };
export default LoansDetailsHighlights;
