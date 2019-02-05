import React from 'react';
import { withStyles, Grid, Avatar, Typography } from '@material-ui/core';

const styles = theme => ({
	avatar: {
		marginTop: 0
	}
});

const HelpStepsErrorSection = ({ classes }) => {
	return (
		<Grid
			container
			item
			direction="column"
			justify="flex-start"
			alignItems="flex-start"
			spacing={16}
		>
			<Grid item>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={16}
				>
					<Grid item>
						<Avatar className={classes.avatar}>1</Avatar>
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
									Plug in the device via USB and unlock it with your PIN
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
					spacing={16}
				>
					<Grid item>
						<Avatar className={classes.avatar}>2</Avatar>
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
									&#34;Browser Support&#34; must be DISABLED in settings.
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
					spacing={16}
				>
					<Grid item>
						<Avatar className={classes.avatar}>3</Avatar>
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
									Also, make sure &#34;Contract Data&#34; is set to YES.
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
					spacing={16}
				>
					<Grid item>
						<Avatar className={classes.avatar}>4</Avatar>
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
									Open the Ethereum application on the device.
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
					spacing={16}
				>
					<Grid item>
						<Avatar className={classes.avatar}>5</Avatar>
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
									Press &#34;Connect To Ledger&#34;.
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(HelpStepsErrorSection);
