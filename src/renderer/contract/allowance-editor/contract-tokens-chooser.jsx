import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';

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
					For Token: <b>{selected.symbol}</b> ({selected.address})
				</Typography>
			);
		}
		return (
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<TokenSelector
						title={title}
						tokens={tokens}
						selected={selected ? selected.symbol : null}
						onTokenChange={handleTokenChange}
					/>
				</Grid>
				{selected && (
					<Grid item>
						<Typography variant="subtitle1">
							Token Address: {selected.address}
						</Typography>
					</Grid>
				)}
			</Grid>
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
