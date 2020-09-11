import React, { PureComponent } from 'react';
import { CardContent, Card, CardHeader, Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { IDIcon } from 'selfkey-ui';
import { ApplicationStatusBar } from '../application';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	info: {
		padding: '25px 30px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	buttons: {
		marginTop: '20px'
	},
	extraSpace: {
		marginRight: '4px'
	},
	alert: {
		marginBottom: 10
	}
});

class KycAdditionalRequirementsCardComponent extends PureComponent {
	render() {
		const {
			classes,
			title = 'Identity Verification',
			subtitle = 'Prove your identity',
			applicationStatus
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
										{subtitle}
									</Typography>
								</Grid>
							</Grid>

							<Grid item xs={9}>
								<ApplicationStatusBar
									status={applicationStatus}
									barStyle={classes.alert}
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
											onClick={this.props.onApplicationRefresh}
											size="large"
										>
											Refresh
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

export const KycAdditionalRequirementsCard = withStyles(styles)(
	KycAdditionalRequirementsCardComponent
);

export default KycAdditionalRequirementsCard;
