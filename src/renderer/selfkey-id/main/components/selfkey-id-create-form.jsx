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
	Select,
	Input,
	MenuItem,
	FormControl,
	Modal
} from '@material-ui/core';
import { IdCardIcon, ModalWrap } from 'selfkey-ui';
import { connect } from 'react-redux';
import history from 'common/store/history';
import { identitySelectors, identityOperations } from 'common/identity';
import { walletOperations, walletSelectors } from 'common/wallet';
import { push } from 'connected-react-router';

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
	modal: {
		height: '100%',
		overflow: 'auto'
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
	}
});

class SelfKeyIdCreateFormComponent extends Component {
	state = {
		error: '',
		nickName: '',
		firstName: '',
		lastName: '',
		country: 'choose',
		isDisabled: true
	};

	componentDidMount() {
		this.props.dispatch(identityOperations.loadCountriesOperation());
	}

	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
	};

	getTypeId = url => {
		return this.props.idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};

	handleSave = async () => {
		await this.props.dispatch(
			walletOperations.updateWalletName(this.state.nickName, this.props.wallet.id)
		);

		await this.props.dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: this.getTypeId(
					'http://platform.selfkey.org/schema/attribute/first-name.json'
				),
				name: 'First Name',
				data: { value: this.state.firstName }
			})
		);

		await this.props.dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: this.getTypeId(
					'http://platform.selfkey.org/schema/attribute/last-name.json'
				),
				name: 'Last Name',
				data: { value: this.state.lastName }
			})
		);

		await this.props.dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: this.getTypeId(
					'http://platform.selfkey.org/schema/attribute/country-of-residency.json'
				),
				name: 'Country of Residence',
				data: { value: this.state.country }
			})
		);

		await this.props.dispatch(walletOperations.updateWalletSetup(true, this.props.wallet.id));

		await this.props.dispatch(push('/selfkeyIdCreateAbout'));
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

	handleCountryChange = event => {
		this.setState({ country: event.target.value }, () => {
			this.isDisabled();
		});
	};

	isDisabled = () => {
		this.setState({
			isDisabled:
				!this.state.nickName ||
				!this.state.firstName ||
				!this.state.lastName ||
				this.state.country === 'choose'
		});
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
				<Modal open={true} className={classes.modal}>
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
																			SELFKEY ID NICKNAME
																		</Typography>
																	</Grid>
																	<Grid
																		item
																		className={classes.input}
																	>
																		<Input
																			fullWidth
																			error={
																				this.state.error !==
																				''
																			}
																			onChange={
																				this
																					.handleNickNameChange
																			}
																		/>
																		{this.state.error !==
																			'' && (
																			<Typography
																				variant="subtitle2"
																				color="error"
																				gutterBottom
																			>
																				{this.state.error}
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
																			FIRST NAME
																		</Typography>
																	</Grid>
																	<Grid
																		item
																		className={classes.input}
																	>
																		<Input
																			fullWidth
																			onChange={
																				this
																					.handleFirstNameChange
																			}
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
																			LAST NAME
																		</Typography>
																	</Grid>
																	<Grid
																		item
																		className={classes.input}
																	>
																		<Input
																			fullWidth
																			onChange={
																				this
																					.handleLastNameChange
																			}
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
																			COUNTRY OF RESIDENCE
																		</Typography>
																	</Grid>
																	<Grid
																		item
																		className={classes.input}
																	>
																		<FormControl
																			variant="filled"
																			fullWidth
																		>
																			<Select
																				autoWidth
																				onChange={
																					this
																						.handleCountryChange
																				}
																				value={
																					this.state
																						.country
																				}
																				disableUnderline
																				input={
																					<Input
																						disableUnderline
																						fullWidth
																					/>
																				}
																			>
																				<MenuItem
																					value="choose"
																					className={
																						classes.dropdown
																					}
																				>
																					<em>
																						Choose...
																					</em>
																				</MenuItem>
																				{this.props.countries.map(
																					country => (
																						<MenuItem
																							key={
																								country.id
																							}
																							value={
																								country.name
																							}
																						>
																							{
																								country.name
																							}
																						</MenuItem>
																					)
																				)}
																			</Select>
																		</FormControl>
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
													</Grid>
													<Grid item container justify="center">
														<Button
															variant="contained"
															size="large"
															className={classes.create}
															disabled={this.state.isDisabled}
															onClick={this.handleSave}
														>
															CREATE SELFKEY ID
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

const mapStateToProps = (state, props) => {
	return {
		countries: identitySelectors.selectCountries(state),
		idAttributeTypes: identitySelectors.selectIdAttributeTypes(state),
		wallet: walletSelectors.getWallet(state)
	};
};

export const SelfKeyIdCreateForm = connect(mapStateToProps)(
	withStyles(styles)(SelfKeyIdCreateFormComponent)
);

export default SelfKeyIdCreateForm;
