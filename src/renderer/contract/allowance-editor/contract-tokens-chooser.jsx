import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';

import { TokenSelector } from '../../tokens/token-selector';
import { PropTypes } from 'prop-types';
const styles = theme => ({
	horizontalRow: {
		display: 'flex',
		'& > h6': {
			marginRight: '5px'
		}
	}
});

export const ContractTokensChooser = withStyles(styles)(
	({ classes, title, tokens, selected, fixed, onTokenChange }) => {
		const handleTokenChange = token => {
			if (onTokenChange) onTokenChange(token);
		};
		if (fixed && selected) {
			return (
				<React.Fragment>
					<div className={classes.horizontalRow}>
						<Typography variant="subtitle2" color="secondary">
							For Token:
						</Typography>
						<Typography variant="subtitle2" color="white">
							({selected.address})
						</Typography>
					</div>
					<Typography variant="body1">
						<b>{selected.symbol}</b>
					</Typography>
				</React.Fragment>
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
						<div className={classes.horizontalRow}>
							<Typography variant="subtitle2" color="secondary">
								Token Address:
							</Typography>
							<Typography variant="subtitle2">{selected.address}</Typography>
						</div>
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
