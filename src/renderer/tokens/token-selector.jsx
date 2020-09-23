import React from 'react';

import { MenuItem, Select, Input, Typography, FormControl } from '@material-ui/core';
import { SelectDropdownIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';
import { InputTitle } from '../common';

const styles = theme => ({
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	}
});

export const TokenSelector = withStyles(styles)(
	({ tokens, classes, selected, onTokenChange, title }) => {
		const handleTokenChange = event => {
			const symbol = event.target.value;
			if (symbol === 'custom') return onTokenChange(null);
			return onTokenChange(tokens.find(t => t.symbol === symbol) || null);
		};
		return (
			<FormControl variant="filled" fullWidth>
				{title && <InputTitle title={title} />}
				<Select
					className={classes.cryptoSelect}
					value={selected || 'custom'}
					onChange={handleTokenChange}
					name="cryptoCurrency"
					disableUnderline
					displayEmpty
					IconComponent={SelectDropdownIcon}
					input={<Input disableUnderline />}
				>
					<MenuItem value="custom">
						<Typography className="choose" variant="subtitle1" color="textSecondary">
							Choose...
						</Typography>
					</MenuItem>
					{tokens.map(token => (
						<MenuItem
							key={token.symbol}
							value={token.symbol}
							className={classes.selectItem}
						>{`${token.symbol} - ${token.name}`}</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	}
);

TokenSelector.propTypes = {
	tokens: PropTypes.array.isRequired,
	selected: PropTypes.string,
	title: PropTypes.string,
	onTokenChange: PropTypes.func.isRequired
};

TokenSelector.defaultProps = {
	selected: 'custom'
};
