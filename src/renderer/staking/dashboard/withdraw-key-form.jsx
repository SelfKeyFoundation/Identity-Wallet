import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, FormControl, Input, Typography, Button } from '@material-ui/core';
import { TimelockPeriod } from './timelock-period';
import BN from 'bignumber.js';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => {
	return {
		currencyName: {
			textAlign: 'right'
		},
		container: {
			height: '100%'
		},
		title: {
			marginBottom: theme.spacing(1)
		}
	};
});

export const WithdrawKeyForm = ({ stakeInfo, onSubmit }) => {
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

		if (amount.gt(new BN(stakeInfo.stakeBalance))) {
			setAmountError(`Maximum is ${stakeInfo.stakeBalance}`);
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
			wrap="nowrap"
			className={classes.container}
		>
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Typography variant="overline" className={classes.title}>
						Withdraw
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={handleAmountChange}
						error={!!amountError}
						disabled={!stakeInfo.canWithdrawStake}
						placeholder="Amount of KEY to withdraw"
					/>
					{amountError && (
						<Typography variant="subtitle1" color="error">
							{amountError}
						</Typography>
					)}
				</FormControl>
			</Grid>
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Typography variant="overline" className={classes.title}>
						Timelock Period
					</Typography>
					<TimelockPeriod
						startTs={stakeInfo.timelockStart}
						endTs={stakeInfo.timelockEnd}
						hasStaked={stakeInfo.hasStaked}
					/>
				</FormControl>
			</Grid>
			<Grid item xs />
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={!stakeInfo.canWithdrawStake || amountError || amount === null}
					>
						Withdraw
					</Button>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default WithdrawKeyForm;

WithdrawKeyForm.propType = {
	stakeInfo: PropTypes.object,
	onSubmit: PropTypes.func
};
