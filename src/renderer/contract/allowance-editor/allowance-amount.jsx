import React from 'react';
import { withStyles } from '@material-ui/styles';
import { FormControl, Input, Typography } from '@material-ui/core';
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
		if (!amount && requestedAmount) {
			amount = requestedAmount;
		}
		if (!amount && currentAmount) {
			amount = currentAmount;
		}

		if (loading) {
			return <span>Loading...</span>;
		}

		return (
			<div>
				<Typography variant="body1">Current spending allowance: {currentAmount}</Typography>
				{requestedAmount && (
					<Typography variant="body1">Requested amount: {requestedAmount}</Typography>
				)}
				<FormControl variant="filled" fullWidth>
					{title && <InputTitle title={title} />}
					<Input
						fullWidth
						type="text"
						onChange={handleAmountChange}
						value={amount}
						placeholder="Allowance Amount"
					/>

					{error && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{error}
						</Typography>
					)}
				</FormControl>
			</div>
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
