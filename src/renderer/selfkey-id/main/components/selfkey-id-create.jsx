import React, { PureComponent } from 'react';
import { Grid, Modal, Button, Typography, Card, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { IdCardIcon, SKIDIcon, ModalWrap } from 'selfkey-ui';
import { Link } from 'react-router-dom';

const styles = theme => ({
	container: {
		minHeight: '100vh'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	backButtonContainer: {
		left: '40px',
		position: 'absolute',
		top: '40px',
		zIndex: '1301'
	},
	bold: {
		fontWeight: 600
	},
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		marginLeft: '50px',
		marginRight: '50px'
	},
	create: {
		marginTop: '15px',
		marginBottom: '10px'
	}
});

const selfkeyIdForm = React.forwardRef((props, ref) => (
	<Link to="/selfkeyIdForm" {...props} ref={ref} />
));
const back = React.forwardRef((props, ref) => <Link to="/main/dashboard" {...props} ref={ref} />);

class SelfKeyIdCreateComponent extends PureComponent {
	render() {
		const { classes } = this.props;
		return (
			<>
				<div className={classes.backButtonContainer}>
					<Button variant="outlined" color="secondary" size="small" component={back}>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
				<Modal open={true}>
					<ModalWrap className={classes.modalWrap}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="center"
							spacing={4}
						>
							<Grid item>
								<IdCardIcon />
							</Grid>
							<Grid item>
								<Typography variant="h1">Setup your Selfkey Identity</Typography>
							</Grid>
							<Grid item>
								<Typography variant="body1" color="secondary">
									Create a new Selfkey ID to start building your identity profile.
								</Typography>
							</Grid>
							<Grid item>
								<Card>
									<CardContent>
										<Grid
											container
											direction="column"
											justify="center"
											alignItems="center"
											spacing={4}
										>
											<Grid
												container
												item
												spacing={0}
												justify="space-between"
											>
												<Grid
													container
													xs={2}
													alignItems="center"
													direction="column"
													wrap="nowrap"
													spacing={4}
													className={classes.info}
												>
													<Grid item>
														<SKIDIcon />
													</Grid>
												</Grid>
												<Grid item xs={10}>
													<Grid item>
														<Typography variant="body1" gutterBottom>
															I am creating a new Selfkey Identity
															Profile
														</Typography>
														<Typography
															variant="subtitle2"
															color="secondary"
															gutterBottom
														>
															Setup the Selfkey ID. This will form the{' '}
															basis of your locally managed and stored{' '}
															identity profile.
														</Typography>
													</Grid>
													<Grid item>
														<Button
															id="selfkeyIdDialogButton"
															variant="contained"
															size="large"
															className={classes.create}
															component={selfkeyIdForm}
														>
															Create Selfkey ID
														</Button>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</ModalWrap>
				</Modal>
			</>
		);
	}
}

export const SelfKeyIdCreate = withStyles(styles)(SelfKeyIdCreateComponent);

export default SelfKeyIdCreate;
