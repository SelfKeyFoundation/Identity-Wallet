import React from 'react';
import { withStyles, Typography, Grid, Input, Select, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

const styles = theme => ({
	container: {
		marginBottom: '2em'
	}
});

const LoansFilters = withStyles(styles)(({ classes }) => {
	return (
		<Grid
			id="loans-filter"
			container
			direction="fow"
			justify="flex-start"
			spacing={40}
			className={classes.container}
		>
			<Grid item>
				<Typography variant="overline" gutterBottom>
					Type
				</Typography>
				<ToggleButtonGroup>
					<ToggleButton value="structure">
						<Typography variant="h5">P2P</Typography>
					</ToggleButton>
					<ToggleButton value="structure">
						<Typography variant="h5">Licensed</Typography>
					</ToggleButton>
				</ToggleButtonGroup>
			</Grid>
			<Grid item>
				<Typography variant="overline" gutterBottom>
					Current Rates
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="overline" gutterBottom>
					Assets Accepted
				</Typography>
				<Select
					name="asset"
					value="BTC"
					disableUnderline
					IconComponent={KeyboardArrowDown}
					input={<Input disableUnderline />}
				>
					<MenuItem value="">
						<em>Choose...</em>
					</MenuItem>
					<MenuItem key={'BTC'} value={'BTC'}>
						{'BTC'}
					</MenuItem>
				</Select>
			</Grid>
		</Grid>
	);
});

export default LoansFilters;
export { LoansFilters };
