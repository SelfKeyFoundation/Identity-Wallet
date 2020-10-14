import React from 'react';
import { Typography, Grid, Input, Select, MenuItem, Slider, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelectDropdownIcon } from 'selfkey-ui';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const styles = theme => ({
	container: {
		marginBottom: '2em',
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
	},
	selectTokens: {
		minWidth: '11em'
	},
	labelText: {
		marginBottom: theme.spacing(1)
	}
});

const generateMarks = ({ max, min, selectedRange }) => {
	const selMin = selectedRange[0];
	const selMax = selectedRange[1];
	const marks = [];

	// Hides and shows filter markers based on selection,
	// to avoid overlapped markers
	if (selMax !== max && Math.abs(selMax - max) > 0.5) {
		marks.push({ value: selMax, label: `${selMax}%` });
	}
	if (selMax === max || Math.abs(selMax - max) < 0.5) {
		marks.push({ value: selMax, label: `${selMax}%` });
	} else {
		marks.push({ value: max, label: `${max}%` });
	}

	if (Math.abs(selMax - selMin) > 0.5) {
		marks.push({ value: min, label: `${min}%` });
		if (selMin !== min) {
			marks.push({ value: selMin, label: `${selMin}%` });
		}
	}

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
	}) => (
		<Grid
			id="loans-filter"
			container
			direction="row"
			justify="flex-start"
			spacing={5}
			className={classes.container}
		>
			<Grid item>
				<Typography variant="overline" className={classes.labelText}>
					Type
				</Typography>
				<ToggleButtonGroup exclusive onChange={onTypeFilterChange} value={selectedType}>
					<ToggleButton value="Decentralized">
						<Typography variant="h5">P2P</Typography>
					</ToggleButton>
					<ToggleButton value="Centralized">
						<Typography variant="h5">Centralized</Typography>
					</ToggleButton>
				</ToggleButtonGroup>
			</Grid>

			<Grid item className={classes.rangeContainer}>
				<Typography variant="overline" className={classes.labelText}>
					Current Rates
				</Typography>
				<Slider
					value={selectedRange || [range.min, range.max]}
					min={range.min}
					max={range.max}
					marks={generateMarks({ max: range.max, min: range.min, selectedRange })}
					onChange={onRateRangeChange}
					step={0.1}
					valueLabelDisplay="off"
					aria-labelledby="range-slider"
				/>
			</Grid>

			<Grid item>
				<Typography variant="overline" className={classes.labelText}>
					Assets Accepted
				</Typography>
				<FormControl variant="filled">
					<Select
						name="asset"
						className={classes.selectTokens}
						value={selectedToken}
						onChange={onTokenFilterChange}
						IconComponent={SelectDropdownIcon}
						input={<Input disableUnderline />}
						displayEmpty
					>
						<MenuItem key="empty" value="">
							<Typography
								className="choose"
								variant="subtitle1"
								color="textSecondary"
							>
								Choose...
							</Typography>
						</MenuItem>
						{tokens.map(token => (
							<MenuItem key={token} value={token}>
								{token}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	)
);

export default LoansFilters;
export { LoansFilters };
