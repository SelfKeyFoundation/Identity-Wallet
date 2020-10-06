import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, FormControl, Input, Typography, Button } from '@material-ui/core';
import { KeyPicker } from 'selfkey-ui';
import moment from 'moment';
import BN from 'bignumber.js';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles({
	currencyName: {
		textAlign: 'right'
	},
	container: {
		height: '100%'
	}
});

export const StakeKeyForm = ({ stakeInfo, keyToken, onSubmit }) => {
	const classes = useStyles();
	const minStakeDate = moment(stakeInfo.minStakeDate || Date.now());

	const [timelockError, setTimelockError] = useState(null);
	const [amountError, setAmountError] = useState(null);

	const [timelock, setTimelock] = useState(null);
	const [amount, setAmount] = useState(null);

	const isValidDate = useCallback(current => {
		return current.isSameOrAfter(minStakeDate, 'day');
	});
	const handleAmountChange = useCallback(evt => {
		const amount = new BN(evt.target.value);
		if (evt.target.value === '') {
			setAmountError(null);
			setAmount(null);
			return;
		}
		if (amount.isNaN()) {
			setAmountError('Invalid amount provided');
			return;
		}

		if (amount.gt(new BN(keyToken.balance))) {
			setAmountError("You don't have enough funds");
			return;
		}
		if (stakeInfo.minStakeAmount && amount.lt(new BN(stakeInfo.minStakeAmount))) {
			setAmountError(`Minimum stake is ${stakeInfo.minStakeAmount}`);
			return;
		}
		setAmountError(null);
		setAmount(amount.toString());
	});

	const handleSubmit = useCallback(evt => {
		evt.preventDefault();
		if (onSubmit) {
			onSubmit({
				amount,
				timelock
			});
		}
	});

	const handleTimelockChange = useCallback(evt => {
		const date = moment(evt.target.value).utc();
		if (!isValidDate(date)) {
			setTimelockError('Invalid date selected');
			return;
		}
		setTimelockError(null);
		setTimelock(date.valueOf());
	});
	return (
		<Grid
			container
			direction="column"
			alignItems="stretch"
			spacing={2}
			className={classes.container}
			wrap="nowrap"
		>
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Typography variant="overline" gutterBottom>
						Stake
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={handleAmountChange}
						disabled={!stakeInfo.canStake}
						error={!!amountError}
						placeholder="Add Key amount for staking"
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
					<Typography variant="overline" gutterBottom>
						Timelock Period
					</Typography>
					<KeyPicker
						isValidDate={isValidDate}
						disabled={!stakeInfo.canStake}
						viewDate={minStakeDate}
						isError={!!timelockError}
						inputProps={{
							placeholder: 'Choose Unlock Date',
							disabled: !stakeInfo.canStake
						}}
						onChange={handleTimelockChange}
					/>
					{timelockError && (
						<Typography variant="subtitle1" color="error">
							{timelockError}
						</Typography>
					)}
				</FormControl>
			</Grid>
			<Grid item xs />
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={
							!stakeInfo.canStake ||
							amountError ||
							timelockError ||
							!timelock ||
							amount === null
						}
					>
						Stake
					</Button>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default StakeKeyForm;

StakeKeyForm.propTypes = {
	stakeInfo: PropTypes.object,
	keyToken: PropTypes.object,
	onSubmit: PropTypes.func
};
