import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import { TokenSelector } from '../../tokens/token-selector';
import { PropTypes } from 'prop-types';
const styles = theme => ({});

export const ContractTokensChooser = withStyles(styles)(
	({ classes, title, tokens, selected, fixed, onTokenChange }) => {
		const handleTokenChange = token => {
			if (onTokenChange) onTokenChange(token);
		};
		if (fixed && selected) {
			return (
				<Typography variant="body1">
					Token: {selected.symbol} ({selected.address})
				</Typography>
			);
		}
		return (
			<div>
				<TokenSelector
					title={title}
					tokens={tokens}
					selected={selected ? selected.symbol : null}
					onTokenChange={handleTokenChange}
				/>
				{selected && <Typography variant="body1">Address: {selected.address}</Typography>}
			</div>
		);
	}
);

ContractTokensChooser.propTypes = {
	title: PropTypes.string,
	tokens: PropTypes.array,
	selected: PropTypes.object,
	fixed: PropTypes.bool,
	onTokenChange: PropTypes.func
};

ContractTokensChooser.defaultProps = {
	tokens: [],
	selected: null,
	fixed: false
};
