import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, FormControl, Input, Typography, Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import BN from 'bignumber.js';

const useStyles = makeStyles({
	currencyName: {
		textAlign: 'right'
	},
	container: {
		height: '100%'
	}
});

export const WithdrawRewardForm = ({ stakeInfo, onSubmit }) => {
	const classes = useStyles();
	const [amountError, setAmountError] = useState(null);
	const [amount, setAmount] = useState(null);

	const handleAmountChange = useCallback(evt => {
		const amount = new BN(evt.target.value);

		if (evt.target.value === '') {
			setAmountError(null);
			setAmount(null);
			return;
		}

		if (amount.isNaN() || amount.isZero()) {
			setAmountError('Invalid amount provided');
			return;
		}

		if (amount.gt(new BN(stakeInfo.rewardBalance))) {
			setAmountError(`Maximum is ${stakeInfo.rewardBalance}`);
			return;
		}
		setAmountError(null);
		setAmount(amount.toString());
	});

	const handleSubmit = useCallback(evt => {
		evt.preventDefault();
		if (onSubmit) {
			onSubmit({
				amount
			});
		}
	});
	return (
		<Grid
			container
			direction="column"
			alignItems="stretch"
			spacing={2}
			className={classes.container}
		>
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Typography variant="overline" gutterBottom>
						Amount
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={handleAmountChange}
						error={!!amountError}
						disabled={!stakeInfo.canWithdrawReward}
						placeholder="LOCK to withdraw"
					/>
					{amountError && (
						<Typography variant="subtitle1" color="error">
							{amountError}
						</Typography>
					)}
				</FormControl>
			</Grid>
			<Grid item xs />

			<Grid item>
				<FormControl variant="outlined" fullWidth>
					<Button
						variant="outlined"
						onClick={handleSubmit}
						disabled={!stakeInfo.canWithdrawReward || amountError || amount === null}
					>
						Withdraw
					</Button>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default WithdrawRewardForm;

WithdrawRewardForm.propType = {
	stakeInfo: PropTypes.object,
	onSubmit: PropTypes.func
};
