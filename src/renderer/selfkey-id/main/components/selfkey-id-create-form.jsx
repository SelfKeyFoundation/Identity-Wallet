import React, { PureComponent } from 'react';
import {
	Grid,
	Button,
	Typography,
	Card,
	CardContent,
	withStyles,
	CardHeader,
	Divider,
	Input,
	Modal,
	IconButton
} from '@material-ui/core';
import {
	IdCardIcon,
	ModalWrap,
	KeyTooltip,
	TooltipArrow,
	BackButton,
	InfoTooltip
} from 'selfkey-ui';
import { connect } from 'react-redux';
import history from 'common/store/history';
import { identityOperations, identitySelectors } from 'common/identity';
import { matomoGoalTracking, matomoGoals } from 'common/matomo';

const styles = theme => ({
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
	},
	backButtonContainer: {
		left: '40px',
		position: 'absolute',
		top: '40px',
		width: '100%',
		zIndex: '1301',
		'& div': {
			left: '0 !important'
		}
	},
	bold: {
		fontWeight: 600
	},
	create: {
		marginTop: '10px',
		marginBottom: '10px',
		width: '321px'
	},
	divider: {
		backgroundColor: '#475768',
		width: '100%',
		marginTop: '10px',
		marginBottom: '10px'
	},
	card: {
		width: '471px'
	},
	cardHeader: {
		backgroundColor: '#2A3540',
		fontSize: '18px',
		lineHeight: '26px',
		marginBottom: '10px'
	},
	input: {
		width: '322px'
	},
	dropdown: {
		width: '322px'
	},
	container: {},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	tooltip: {
		padding: '7px 0 0 10px'
	},
	idNickname: {
		alignItems: 'baseline',
		display: 'flex',
		flexDirection: 'row'
	},
	bb: {
		'& div': {
			zIndex: 3000
		},
		'& button': {
			zIndex: 3000
		}
	}
});

class SelfKeyIdCreateFormComponent extends PureComponent {
	state = {
		error: '',
		errorEmail: false,
		nickName: '',
		firstName: '',
		lastName: '',
		email: '',
		isDisabled: true
	};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
	};

	getTypeId = url => {
		return this.props.idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};

	handleSave = evt => {
		evt.preventDefault();
		this.props.dispatch(
			identityOperations.createIndividualProfile(this.props.identity.id, { ...this.state })
		);
	};

	handleNickNameChange = event => {
		this.setState({ nickName: event.target.value }, () => {
			this.isDisabled();
		});
	};

	handleFirstNameChange = event => {
		this.setState({ firstName: event.target.value }, () => {
			this.isDisabled();
		});
	};

	handleLastNameChange = event => {
		this.setState({ lastName: event.target.value }, () => {
			this.isDisabled();
		});
	};

	handleEmailChange = event => {
		this.setState({ email: event.target.value }, () => {
			let valid = this.isValidEmail(this.state.email);
			this.setState({ errorEmail: !valid }, () => {
				this.isDisabled();
			});
		});
	};

	isDisabled = () => {
		this.setState({
			isDisabled:
				!this.state.nickName ||
				!this.state.firstName ||
				!this.state.lastName ||
				!this.state.email ||
				!this.isValidEmail(this.state.email)
		});
	};

	sendMatomoGoal = () => {
		matomoGoalTracking(matomoGoals.CreateSelfKeyId);
	};

	isValidEmail = email => {
		var re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
		return email ? re.test(String(email).toLowerCase()) : true;
	};

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<div className={classes.backButtonContainer}>
					<BackButton onclick={this.handleBackClick} className={classes.bb} />
					{/* <Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={this.handleBackClick}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button> */}
				</div>
				<Modal open={true}>
					<ModalWrap className={classes.modalWrap}>
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
								<Typography variant="h1">SelfKey ID</Typography>
							</Grid>
							<Grid item>
								<Typography variant="body1" color="secondary" gutterBottom>
									Fill in the basic details of your identity wallet.
								</Typography>
							</Grid>
							<Grid item>
								<Card className={classes.card}>
									<CardHeader
										title="Identity Wallet Details"
										className={classes.cardHeader}
									/>
									<CardContent>
										<form onSubmit={this.handleSave} noValidate>
											<Grid
												container
												direction="column"
												justify="center"
												alignItems="center"
												spacing={32}
											>
												<Grid item>
													<Grid
														container
														direction="column"
														spacing={40}
														justify="flex-start"
														alignItems="flex-start"
													>
														<Grid item>
															<Grid
																container
																direction="column"
																spacing={0}
																justify="flex-start"
																alignItems="flex-start"
															>
																<Grid item>
																	<Grid
																		container
																		direction="column"
																		justify="flex-start"
																		alignItems="flex-start"
																	>
																		<Grid item>
																			<Typography
																				variant="overline"
																				gutterBottom
																				className={
																					classes.idNickname
																				}
																			>
																				SELFKEY ID NICKNAME*
																				<KeyTooltip
																					interactive
																					placement="top-start"
																					className={
																						classes.tooltip
																					}
																					title={
																						<React.Fragment>
																							<span>
																								With
																								nicknames
																								it
																								is
																								very
																								easy
																								to
																								switch
																								between
																								multiple
																								accounts.
																							</span>
																							<TooltipArrow />
																						</React.Fragment>
																					}
																				>
																					<IconButton aria-label="Info">
																						<InfoTooltip />
																					</IconButton>
																				</KeyTooltip>
																			</Typography>
																		</Grid>
																		<Grid
																			item
																			className={
																				classes.input
																			}
																		>
																			<Input
																				id="nickName"
																				fullWidth
																				error={
																					this.state
																						.error !==
																					''
																				}
																				onChange={
																					this
																						.handleNickNameChange
																				}
																				placeholder="Alias for this account"
																			/>
																			{this.state.error !==
																				'' && (
																				<Typography
																					variant="subtitle2"
																					color="error"
																					gutterBottom
																				>
																					{
																						this.state
																							.error
																					}
																				</Typography>
																			)}
																		</Grid>
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
														<Divider className={classes.divider} />
														<Grid item>
															<Grid
																container
																direction="column"
																spacing={32}
																justify="flex-start"
																alignItems="flex-start"
															>
																<Grid item>
																	<Grid
																		container
																		direction="column"
																		justify="flex-start"
																		alignItems="flex-start"
																	>
																		<Grid item>
																			<Typography
																				variant="overline"
																				gutterBottom
																			>
																				FIRST NAME*
																			</Typography>
																		</Grid>
																		<Grid
																			item
																			className={
																				classes.input
																			}
																		>
																			<Input
																				id="firstName"
																				fullWidth
																				required
																				onChange={
																					this
																						.handleFirstNameChange
																				}
																				placeholder="Given Name"
																			/>
																		</Grid>
																	</Grid>
																</Grid>
																<Grid item>
																	<Grid
																		container
																		direction="column"
																		justify="flex-start"
																		alignItems="flex-start"
																	>
																		<Grid item>
																			<Typography
																				variant="overline"
																				gutterBottom
																			>
																				LAST NAME*
																			</Typography>
																		</Grid>
																		<Grid
																			item
																			className={
																				classes.input
																			}
																		>
																			<Input
																				id="lastName"
																				fullWidth
																				required
																				onChange={
																					this
																						.handleLastNameChange
																				}
																				placeholder="Family Name"
																			/>
																		</Grid>
																	</Grid>
																</Grid>
																<Grid item>
																	<Grid
																		container
																		direction="column"
																		justify="flex-start"
																		alignItems="flex-start"
																	>
																		<Grid item>
																			<Typography
																				variant="overline"
																				gutterBottom
																			>
																				EMAIL*
																			</Typography>
																		</Grid>
																		<Grid
																			item
																			className={
																				classes.input
																			}
																		>
																			<Input
																				id="email"
																				fullWidth
																				type="email"
																				error={
																					this.state
																						.errorEmail
																				}
																				required
																				onChange={
																					this
																						.handleEmailChange
																				}
																				placeholder="Email"
																			/>
																			{this.state
																				.errorEmail && (
																				<Typography
																					variant="subtitle2"
																					color="error"
																					gutterBottom
																				>
																					{
																						'Email provided is invalid'
																					}
																				</Typography>
																			)}
																		</Grid>
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
														<Grid item container justify="center">
															<Button
																id="selfkeyIdCreateButton"
																variant="contained"
																size="large"
																type="submit"
																className={classes.create}
																disabled={this.state.isDisabled}
																onClick={this.sendMatomoGoal}
															>
																CREATE SELFKEY ID
															</Button>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</form>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</ModalWrap>
				</Modal>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		identity: identitySelectors.selectIdentity(state)
	};
};

export const SelfKeyIdCreateForm = connect(mapStateToProps)(
	withStyles(styles)(SelfKeyIdCreateFormComponent)
);

export default SelfKeyIdCreateForm;
