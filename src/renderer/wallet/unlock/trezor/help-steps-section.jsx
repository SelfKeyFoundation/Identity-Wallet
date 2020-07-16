import React from 'react';
import { Grid, Avatar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	avatar: {
		marginTop: 0
	}
});

const HelpStepsSection = ({ classes }) => {
	return (
		<Grid
			container
			item
			direction="column"
			justify="flex-start"
			alignItems="flex-start"
			spacing={2}
		>
			<Grid item>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={2}
				>
					<Grid item>
						<Avatar className={classes.avatar}>
							<Typography variant="overline">1</Typography>
						</Avatar>
					</Grid>
					<Grid item>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
						>
							<Grid item>
								<Typography variant="h5" color="secondary">
									Plug in the device via USB
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={2}
				>
					<Grid item>
						<Avatar className={classes.avatar}>
							<Typography variant="overline">2</Typography>
						</Avatar>
					</Grid>
					<Grid item>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
						>
							<Grid item>
								<Typography variant="h5" color="secondary">
									Click &#34;Connect to Trezor&#34; button below
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={2}
				>
					<Grid item>
						<Avatar className={classes.avatar}>
							<Typography variant="overline">3</Typography>
						</Avatar>
					</Grid>
					<Grid item>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
						>
							<Grid item>
								<Typography variant="h5" color="secondary">
									Look at the device for number positions and enter your PIN
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(HelpStepsSection);
