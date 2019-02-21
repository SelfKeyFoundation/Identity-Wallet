import React, { Component } from 'react';
import { Grid, Modal, Button, Typography, Card, CardContent, withStyles } from '@material-ui/core';
import { IdCardIcon, SKIDIcon, ModalWrap } from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

const styles = theme => ({
	container: {
		minHeight: '100vh'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	back: {
		position: 'absolute',
		left: '-200px'
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
		marginTop: '30px',
		marginBottom: '20px'
	}
});

const selfkeyIdCreateAbout = props => <Link to="/main/selfkeyIdCreateAbout" {...props} />;

class SelfKeyIdCreateComponent extends Component {
	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	render() {
		const { classes } = this.props;
		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={this.handleBackClick}
						className={classes.back}
					>
						‹ Back
					</Button>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={32}
					>
						<Grid item>
							<IdCardIcon />
						</Grid>
						<Grid item>
							<Typography variant="h1">Setup your Selfkey Identity</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1" color="secondary" gutterBottom>
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
										spacing={32}
									>
										<Grid container item spacing={0} justify="space-between">
											<Grid
												container
												xs={3}
												justify="end"
												alignItems="center"
												direction="column"
												wrap="nowrap"
												spacing={32}
												className={classes.info}
											>
												<Grid item>
													<SKIDIcon />
												</Grid>
											</Grid>
											<Grid item xs={9}>
												<Grid item>
													<Typography variant="body1" gutterBottom>
														I am creating a new Selfkey Identity Profile
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
														variant="contained"
														size="large"
														className={classes.create}
														component={selfkeyIdCreateAbout}
													>
														Create Selfkey ID
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</CardContent>
								{/* <hr className={classes.hr} />
								<CardContent>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
										spacing={32}
									>
										<Grid container item spacing={0} justify="space-between">
											<Grid
												container
												xs={3}
												justify="end"
												alignItems="center"
												direction="column"
												wrap="nowrap"
												spacing={32}
												className={classes.info}
											>
												<Grid item>
													<BookIcon />
												</Grid>
											</Grid>
											<Grid item xs={9}>
												<Grid item>
													<Typography variant="body1" gutterBottom>
														I was approved in the Selfkey token sale KYC
													</Typography>
													<Typography
														variant="subtitle2"
														color="secondary"
														gutterBottom
													>
														If you were whitelisted for the Selfkey token sale,{' '}
														you can download a zip file and import to complete{' '}
														your Selfkey ID.
													</Typography>
												</Grid>
												<Grid item>
													<Button
														variant="outlined"
														size="large"
														className={classes.create}
														onClick={this.handleAddAttribute}
													>
														Import KYC File
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</CardContent> */}
							</Card>
						</Grid>
					</Grid>
				</ModalWrap>
			</Modal>
		);
	}
}

export const SelfKeyIdCreate = withStyles(styles)(SelfKeyIdCreateComponent);

export default SelfKeyIdCreate;
