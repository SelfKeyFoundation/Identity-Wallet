import React, { Component } from 'react';
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
import { IdCardIcon, ModalWrap, KeyTooltip, TooltipArrow, InfoTooltip } from 'selfkey-ui';
import { connect } from 'react-redux';
import history from 'common/store/history';
import { identityOperations } from 'common/identity';
import { walletSelectors } from 'common/wallet';
import { matomoGoalTracking, matomoGoals } from 'common/matomo';

const styles = theme => ({
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
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
	backButtonContainer: {
		left: '40px',
		position: 'absolute',
		top: '40px',
		zIndex: '1301'
	},
	bold: {
		fontWeight: 600
	}
});

class SelfKeyIdCreateFormComponent extends Component {
	state = {
		error: '',
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
			identityOperations.createSelfkeyIdOperation(this.props.wallet.id, { ...this.state })
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
			this.isDisabled();
		});
	};

	isDisabled = () => {
		this.setState({
			isDisabled:
				!this.state.nickName ||
				!this.state.firstName ||
				!this.state.lastName ||
				!this.state.email
		});
	};

	sendMatomoGoal = () => {
		matomoGoalTracking(matomoGoals.CreateSelfKeyId);
	};

	render() {
		const { classes } = this.props;
		return (
			<>
				<div className={classes.backButtonContainer}>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={this.handleBackClick}
					>
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
										<form onSubmit={this.handleSave}>
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
																			>
																				SELFKEY ID NICKNAME*
																				<KeyTooltip
																					interactive
																					placement="top-start"
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
																				fullWidth
																				type="email"
																				required
																				onChange={
																					this
																						.handleEmailChange
																				}
																				placeholder="Email"
																			/>
																		</Grid>
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
														<Grid item container justify="center">
															<Button
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
			</>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		wallet: walletSelectors.getWallet(state)
	};
};

export const SelfKeyIdCreateForm = connect(mapStateToProps)(
	withStyles(styles)(SelfKeyIdCreateFormComponent)
);

export default SelfKeyIdCreateForm;
