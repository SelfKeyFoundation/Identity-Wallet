import React, { PureComponent } from 'react';
import { CardContent, Card, CardHeader, Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { IDIcon } from 'selfkey-ui';
import KycRequirementsList from '../requirements/requirements-list';
import { ApplicationStatusBar } from '../application/application-status';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: theme.spacing(1, 2)
	},
	info: {
		padding: theme.spacing(3, 4)
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	buttons: {
		marginTop: theme.spacing(3)
	},
	extraSpace: {
		marginRight: theme.spacing(1)
	},
	alert: {
		marginBottom: theme.spacing(1)
	}
});

class KycRequiredCardComponent extends PureComponent {
	render() {
		const {
			classes,
			title = 'Identity Verification',
			subtitle = 'Prove your identity',
			applicationStatus,
			loading = false,
			requirements = []
		} = this.props;
		return (
			<Card>
				<CardHeader title={title} className={classes.regularText} />
				<hr className={classes.hr} />
				<CardContent>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="center"
						spacing={3}
					>
						<Grid container item spacing={0} justify="space-between">
							<Grid
								container
								xs={3}
								justify="end"
								alignItems="center"
								direction="column"
								wrap="nowrap"
								spacing={3}
								className={classes.info}
							>
								<Grid item>
									<IDIcon />
								</Grid>

								<Grid item>
									<Typography variant="subtitle2" color="secondary">
										{subtitle} {applicationStatus}
									</Typography>
								</Grid>
							</Grid>

							<Grid item xs={9}>
								{applicationStatus === 'rejected' ? (
									<ApplicationStatusBar
										status={applicationStatus}
										barStyle={classes.alert}
									/>
								) : null}
								<KycRequirementsList
									requirements={requirements}
									loading={loading}
									noUnderline
								/>
								<Grid
									container
									direction="row"
									justify="center"
									alignItems="center"
									spacing={2}
									className={classes.buttons}
								>
									<Grid item className={classes.extraSpace}>
										<Button
											variant="contained"
											onClick={this.props.onApplicationStart}
											size="large"
										>
											Start
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		);
	}
}

export const KycRequiredCard = withStyles(styles)(KycRequiredCardComponent);

export default KycRequiredCard;
