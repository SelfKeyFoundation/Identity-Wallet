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

export const WithdrawKeyForm = () => {
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
						Withdraw
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={() => {}}
						placeholder="Amount of KEY to withdraw"
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
					<Button variant="contained" disabled>
						Withdraw
					</Button>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default WithdrawKeyForm;
