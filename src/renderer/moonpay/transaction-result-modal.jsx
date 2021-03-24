import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	body: {
		background: '#313d49',
		padding: '1em',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '1em 0',
		'& > div': {
			display: 'grid',
			gridTemplateColumns: '60px 1fr',
			marginBottom: '1em'
		},
		'& > div:last-child': {
			marginBottom: '0'
		}
	}
}));

export const MoonpayTransactionResultModal = ({ onCancel, transaction, onDetailsClick }) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCancel} text="MoonPay Transaction">
			<Grid container direction="column" spacing={4}>
				{transaction.status === 'failed' && (
					<>
						<Grid item>
							<Typography variant="body1" color="error">
								Transaction Failed
							</Typography>
							<Typography
								variant="subtitle1"
								color="secondary"
								style={{ marginTop: '1em' }}
							>
								The transaction has failed, {transaction.failureReason}, please
								click the details button below for more information.
							</Typography>
						</Grid>
					</>
				)}
				{transaction.status === 'completed' && (
					<>
						<Grid item>
							<Typography variant="body1" color="primary">
								Transaction Completed
							</Typography>
						</Grid>
						<Grid item className={classes.body}>
							<div>
								<Typography variant="subtitle1" color="secondary">
									Bought
								</Typography>
								<Typography variant="subtitle1" color="body2">
									<strong>
										{transaction.quoteCurrencyAmount} {transaction.currency}
									</strong>
								</Typography>
							</div>
							<div>
								<Typography variant="subtitle1" color="secondary">
									Total
								</Typography>
								<Typography variant="subtitle1" color="body2">
									<strong>
										{transaction.feeAmount +
											transaction.extraFeeAmount +
											transaction.baseCurrencyAmount}{' '}
										{transaction.baseCurrency}
									</strong>
								</Typography>
							</div>
							<div>
								<Typography variant="subtitle1" color="secondary">
									Fee
								</Typography>
								<Typography variant="subtitle1" color="body2">
									{transaction.feeAmount + transaction.extraFeeAmount}{' '}
									{transaction.baseCurrency}
								</Typography>
							</div>
						</Grid>
					</>
				)}

				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onDetailsClick}>
								Details
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onCancel}>
								Close
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonpayTransactionResultModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onDetailsClick: PropTypes.func.isRequired,
	transaction: PropTypes.object
};

MoonpayTransactionResultModal.defaultProps = {};

export default MoonpayTransactionResultModal;
