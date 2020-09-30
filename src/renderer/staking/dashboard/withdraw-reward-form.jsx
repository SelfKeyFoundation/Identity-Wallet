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

export const WithdrawRewardForm = () => {
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
						Amount
					</Typography>
					<Input
						fullWidth
						type="text"
						onChange={() => {}}
						placeholder="LOCK to withdraw"
					/>
					<Typography
						variant="subtitle1"
						color="secondary"
						className={classes.currencyName}
					>
						LOCK
					</Typography>
				</FormControl>
			</Grid>
			<Grid item xs />

			<Grid item>
				<FormControl variant="outlined" fullWidth>
					<Button variant="outlined">Withdraw</Button>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default WithdrawRewardForm;
