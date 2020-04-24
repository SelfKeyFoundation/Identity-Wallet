import React from 'react';
import { withStyles, Typography, Grid, Input, Select, MenuItem, Slider } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import ToggleButton from '@material-ui/lab/ToggleButton';

const styles = theme => ({
	container: {
		marginBottom: '2em',
		'& .select-tokens': {
			minWidth: '10em'
		}
	}
});

const LoansFilters = withStyles(styles)(
	({
		classes,
		tokens = [],
		selectedToken = '',
		onTokenFilterChange,
		isP2P = false,
		onP2pFilterChange,
		onRateRangeChange,
		isLicensed = false,
		onLicensedFilterChange,
		range = { min: 0, max: 100 },
		selectedRange = false
	}) => {
		console.log(range);
		return (
			<Grid
				id="loans-filter"
				container
				direction="fow"
				justify="flex-start"
				spacing={5}
				className={classes.container}
			>
				<Grid item>
					<Typography variant="overline" gutterBottom>
						Type
					</Typography>
					<ToggleButton value="checked" onChange={onP2pFilterChange} selected={isP2P}>
						<Typography variant="h5">P2P</Typography>
					</ToggleButton>
					<ToggleButton
						value="checked"
						onChange={onLicensedFilterChange}
						selected={isLicensed}
					>
						<Typography variant="h5">Licensed</Typography>
					</ToggleButton>
				</Grid>
				<Grid item>
					<Typography variant="overline" gutterBottom>
						Current Rates
					</Typography>
					<Slider
						value={selectedRange}
						min={range.min}
						max={range.max}
						onChange={onRateRangeChange}
						valueLabelDisplay="auto"
						aria-labelledby="range-slider"
					/>
				</Grid>
				<Grid item>
					<Typography variant="overline" gutterBottom>
						Assets Accepted
					</Typography>
					<Select
						name="asset"
						className={'select-tokens'}
						value={selectedToken}
						onChange={onTokenFilterChange}
						disableUnderline
						IconComponent={KeyboardArrowDown}
						input={<Input disableUnderline />}
					>
						<MenuItem value="">
							<em>Choose...</em>
						</MenuItem>
						{tokens.map(token => (
							<MenuItem key={token} value={token}>
								{token}
							</MenuItem>
						))}
					</Select>
				</Grid>
			</Grid>
		);
	}
);

export default LoansFilters;
export { LoansFilters };
