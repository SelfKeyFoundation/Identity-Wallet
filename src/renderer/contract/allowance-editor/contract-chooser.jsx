import React from 'react';
import { withStyles } from '@material-ui/styles';
import { FormControl, Input, Typography } from '@material-ui/core';
import { InputTitle } from '../../common';
import { PropTypes } from 'prop-types';
const styles = theme => ({});

// address regexp ^0x[a-fA-F0-9]{40}$

export const ContractChooser = withStyles(styles)(
	({ classes, address, name, fixed, title, error, onContractAddressChange }) => {
		const handleAddressChange = e => {
			const value = e.target.value;
			if (onContractAddressChange) onContractAddressChange(value);
		};
		if (fixed) {
			return (
				<Typography variant="body1">
					Requested Contract: {address} {name ? `(${name})` : null}
				</Typography>
			);
		}
		return (
			<FormControl variant="filled" fullWidth>
				{title && <InputTitle title={title} />}
				<Input
					fullWidth
					type="text"
					onChange={handleAddressChange}
					value={address}
					placeholder="Contract Address"
				/>
				{name && <Typography variant="subtitle1">{name}</Typography>}
				{error && (
					<Typography variant="subtitle2" color="error" gutterBottom>
						{error}
					</Typography>
				)}
			</FormControl>
		);
	}
);

ContractChooser.propTypes = {
	address: PropTypes.string,
	name: PropTypes.string,
	fixed: PropTypes.bool,
	title: PropTypes.string,
	error: PropTypes.string,
	onContractAddressChange: PropTypes.func
};

ContractChooser.defaultProps = {
	fixed: false,
	error: null,
	title: null
};
