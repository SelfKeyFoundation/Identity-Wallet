import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, FormControl, Input, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles({
	currencyName: {
		textAlign: 'right'
	},
	container: {
		height: '100%'
	}
});

export const StakeKeyForm = () => {
	const classes = useStyles();
	return (
		<Grid
			container
			direction="column"
			alignItems="stretch"
			spacing={2}
			className={classes.container}
		>
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Typography variant="overline" gutterBottom>
						Stake
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={() => {}}
						placeholder="Add Key amount for staking"
					/>
					<Typography
						variant="subtitle1"
						color="secondary"
						className={classes.currencyName}
					>
						KEY
					</Typography>
				</FormControl>
			</Grid>
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Typography variant="overline" gutterBottom>
						Timelock Period
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={() => {}}
						placeholder="Period of staking"
					/>
				</FormControl>
			</Grid>
			<Grid item xs />
			<Grid item>
				<FormControl variant="filled" fullWidth>
					<Button variant="contained">Stake</Button>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default StakeKeyForm;
