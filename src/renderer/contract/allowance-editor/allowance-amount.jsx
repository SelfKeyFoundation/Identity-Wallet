import React from 'react';
import { withStyles } from '@material-ui/styles';
import { CircularProgress, FormControl, Input, Typography, Grid } from '@material-ui/core';
import { InputTitle } from '../../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	horizontalRow: {
		display: 'flex',
		'& > h6': {
			marginRight: '5px'
		}
	}
});

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
			const value = e.target.value || '';
			if (onAmountChange) onAmountChange(value);
		};
		if (amount === undefined && requestedAmount) {
			amount = requestedAmount;
		}
		if (amount === undefined && currentAmount) {
			amount = currentAmount;
		}

		return (
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<div className={classes.horizontalRow}>
								<Typography variant="subtitle2" color="secondary">
									Current spending allowance:
								</Typography>
								{loading && <CircularProgress size={20} />}
								{!loading && (
									<Typography variant="subtitle2">{currentAmount}</Typography>
								)}
							</div>
						</Grid>
					</Grid>
				</Grid>

				<Grid item>
					<FormControl variant="filled" fullWidth>
						{!loading && title && <InputTitle title={title} />}
						{!loading && (
							<Input
								fullWidth
								type="text"
								onChange={handleAmountChange}
								value={amount}
								placeholder="Allowance Amount"
							/>
						)}
						{!loading && error && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{error}
							</Typography>
						)}
						{['string', 'number'].includes(typeof requestedAmount) && (
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
