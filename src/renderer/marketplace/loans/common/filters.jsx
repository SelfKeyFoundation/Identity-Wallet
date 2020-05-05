import React from 'react';
import { Typography, Grid, Input, Select, MenuItem, Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const styles = theme => ({
	container: {
		marginBottom: '2em',
		'& .select-tokens': {
			minWidth: '10em'
		},
		'& .MuiSlider-markLabel': {
			fontSize: '12px !important',
			marginTop: '3px'
		},
		'& .MuiSlider-mark': {
			display: 'none'
		},
		'& .MuiSlider-markLabelActive': {
			top: '26px'
		}
	},
	rangeContainer: {
		minWidth: '300px'
	}
});

const generateMarks = ({ max, min, selectedRange }) => {
	const selMin = selectedRange[0];
	const selMax = selectedRange[1];
	const marks = [];

	marks.push({ value: min, label: `${min}%` });
	if (selMin !== min) {
		marks.push({ value: selMin, label: `${selMin}%` });
	}
	if (selMax !== max) {
		marks.push({ value: selMax, label: `${selMax}%` });
	}
	marks.push({ value: max, label: `${max}%` });
	return marks;
};

const LoansFilters = withStyles(styles)(
	({
		classes,
		tokens = [],
		selectedToken = '',
		onTokenFilterChange,
		selectedType = '',
		onTypeFilterChange,
		onRateRangeChange,
		range = { min: 0, max: 100 },
		selectedRange = false
	}) => {
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
					<ToggleButtonGroup value={selectedType} exclusive onChange={onTypeFilterChange}>
						<ToggleButton value="Decentralized">
							<Typography variant="h5">P2P</Typography>
						</ToggleButton>
						<ToggleButton value="Centralized">
							<Typography variant="h5">Centralized</Typography>
						</ToggleButton>
					</ToggleButtonGroup>
				</Grid>
				<Grid item className={classes.rangeContainer}>
					<Typography variant="overline" gutterBottom>
						Current Rates
					</Typography>
					<Slider
						value={selectedRange}
						min={range.min}
						max={range.max}
						marks={generateMarks({ max: range.max, min: range.min, selectedRange })}
						onChange={onRateRangeChange}
						step={1}
						valueLabelDisplay="off"
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
						displayEmpty={true}
					>
						<MenuItem key="empty" value="">
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
