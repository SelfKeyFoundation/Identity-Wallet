import React from 'react';
import { withStyles, Grid, Avatar, Typography } from '@material-ui/core';

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
									Is &#34;Browser Support&#34; disabled in settings?
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
									Is &#34;Contract Data&#34; set to Yes in settings?
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
									Is it properly plugged in?
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
									Did you enter the PIN to unlock?
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
									Is the Ethereum application open?
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
