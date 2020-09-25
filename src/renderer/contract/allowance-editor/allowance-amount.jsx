import React from 'react';
import { withStyles } from '@material-ui/styles';
import { CircularProgress, FormControl, Input, Typography, Grid } from '@material-ui/core';
import { InputTitle } from '../../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({});

export const AllowanceAmount = withStyles(styles)(
	({
		classes,
		currentAmount,
		requestedAmount,
		amount,
		onAmountChange,
		title,
		error,
		loading
	}) => {
		const handleAmountChange = e => {
			const value = e.target.value;
			if (onAmountChange) onAmountChange(value);
		};
		console.log('XXX amount 1', amount);
		if (amount === undefined && requestedAmount) {
			amount = requestedAmount;
		}
		if (amount === undefined && currentAmount) {
			amount = currentAmount;
		}

		console.log('XXX amount 2', amount);

		return (
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Typography variant="subtitle2">Current spending allowance:</Typography>
						</Grid>
						{loading && (
							<Grid item>
								<CircularProgress size={20} />{' '}
							</Grid>
						)}
						{!loading && (
							<Grid item>
								<Typography variant="subtitle2">{currentAmount}</Typography>
							</Grid>
						)}
					</Grid>
				</Grid>

				<Grid item>
					<FormControl variant="filled" fullWidth>
						{amount && !loading && title && <InputTitle title={title} />}
						{amount && !loading && (
							<Input
								fullWidth
								type="text"
								onChange={handleAmountChange}
								value={amount}
								placeholder="Allowance Amount"
							/>
						)}
						{amount && !loading && error && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{error}
							</Typography>
						)}
						{requestedAmount && (
							<Typography variant="body1">
								Requested amount: {requestedAmount}
							</Typography>
						)}
					</FormControl>
				</Grid>
			</Grid>
		);
	}
);

AllowanceAmount.propTypes = {
	currentAmount: PropTypes.string,
	requestedAmount: PropTypes.string,
	amount: PropTypes.string,
	onAmountChange: PropTypes.func,
	loading: PropTypes.bool,
	title: PropTypes.string,
	error: PropTypes.string
};

AllowanceAmount.defaultProps = {
	currentAmount: '0',
	loading: false
};
