import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyledButton,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody
} from 'selfkey-ui';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { Grid, Modal, Typography, Input, Select, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';

const styles = theme => ({
	errorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},

	errorColor: {
		color: '#FE4B61 !important',
		border: '2px solid #FE4B61 !important',
		backgroundColor: 'rgba(255,46,99,0.09) !important'
	},

	input: {
		height: '46px',
		width: '722px',
		'&::-webkit-input-placeholder': {
			fontSize: '14px',
			color: '#93B0C1'
		}
	},

	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},

	label: {
		color: '#93A4AF',
		fontSize: '12px',
		fontWeight: 'bold',
		lineHeight: '15px'
	}
});

class AddCompanyMemberContainer extends Component {
	state = {
		label: '',
		address: ''
	};

	componentDidMount() {
		this.props.dispatch(addressBookOperations.resetAdd());
	}

	handleSubmit = event => {
		event.preventDefault();
		return this.handleSave(this.state.label, this.state.address);
	};

	handleSave = async (label, address) => {
		await this.props.dispatch(addressBookOperations.addAddressBookEntry({ label, address }));
		this.closeAction();
	};

	handleLabelChange = event => {
		event.preventDefault();
		const label = event.target.value;
		this.setState({
			...this.state,
			label
		});
		this.props.dispatch(addressBookOperations.validateLabel(label));
	};

	handleAddressChange = event => {
		event.preventDefault();
		const address = event.target.value;
		this.setState({
			...this.state,
			address
		});
		this.props.dispatch(addressBookOperations.validateAddress(address));
	};

	closeAction = () => {
		this.props.dispatch(push('/main/create-corporate-profile'));
	};

	render() {
		const { classes, labelError, addressError } = this.props;
		const hasLabelError = labelError !== '' && labelError !== undefined;
		const hasAddressError = addressError !== '' && addressError !== undefined;

		return (
			<Modal open={true}>
				<ModalWrap>
					<ModalCloseButton onClick={this.closeAction}>
						<ModalCloseIcon style={{ marginTop: '20px' }} />
					</ModalCloseButton>
					<ModalHeader>
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Grid item>
								<Typography variant="body1">Add Company Member</Typography>
							</Grid>
						</Grid>
					</ModalHeader>
					<ModalBody>
						<form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
							<Grid container direction="column" spacing={32}>
								<Grid item>
									<Grid container direction="column" spacing={8}>
										<Grid item>
											<Typography variant="body1">Select a role</Typography>
										</Grid>
										<Grid item>
											<Typography variant="body1">Type</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
										spacing={24}
									>
										<Grid container item spacing={0} justify="center">
											<Grid item xs={12}>
												<form onSubmit={this.handleSave} noValidate>
													<Grid
														container
														direction="column"
														justify="center"
														alignItems="center"
														spacing={0}
														xs={12}
													>
														<Grid
															item
															spacing={0}
															style={{
																width: '100%'
															}}
														>
															<Grid
																container
																direction="column"
																spacing={0}
																justify="flex-start"
																alignItems="flex-start"
																xs={12}
															>
																<Grid
																	item
																	spacing={0}
																	style={{
																		width: '100%'
																	}}
																>
																	<Grid
																		container
																		direction="column"
																		spacing={0}
																		justify="flex-start"
																		alignItems="flex-start"
																	>
																		<Grid
																			container
																			direction="row"
																			justify="space-between"
																			wrap="nowrap"
																			xs={12}
																		>
																			<Grid
																				container
																				direction="column"
																				className={
																					classes.inputBox
																				}
																			>
																				<Grid item>
																					<Typography
																						variant="overline"
																						gutterBottom
																					>
																						First Name
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Input
																						id="firstName"
																						fullWidth
																						required
																						onChange={
																							this
																								.handleFirstNameChange
																						}
																						placeholder="First Name"
																					/>
																				</Grid>
																			</Grid>
																			<Grid
																				container
																				direction="column"
																				className={
																					classes.inputBox
																				}
																			>
																				<Grid item>
																					<Typography
																						variant="overline"
																						gutterBottom
																					>
																						Last Name
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Input
																						id="lastName"
																						fullWidth
																						required
																						onChange={
																							this
																								.handleFirstNameChange
																						}
																						placeholder="Family Name"
																					/>
																				</Grid>
																			</Grid>
																		</Grid>
																		<Grid
																			container
																			direction="row"
																			justify="space-between"
																			wrap="nowrap"
																			xs={12}
																		>
																			<Grid
																				container
																				direction="column"
																				className={
																					classes.inputBox
																				}
																			>
																				<Grid item>
																					<Typography
																						variant="overline"
																						gutterBottom
																					>
																						Citizenship
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Select
																						value="Entity Type"
																						onChange=""
																						displayEmpty
																						name="entitytype"
																						disableUnderline
																						IconComponent={
																							KeyboardArrowDown
																						}
																						input={
																							<Input
																								disableUnderline
																							/>
																						}
																						style={{
																							width:
																								'100%'
																						}}
																					>
																						<MenuItem value="">
																							<em>
																								Choose...
																							</em>
																						</MenuItem>
																						{[
																							'Entity Type 1',
																							'Entity Type 2',
																							'Entity Type 3',
																							'Entity Type 4',
																							'Entity Type 5'
																						].map(
																							item => (
																								<MenuItem
																									key={
																										item
																									}
																									value={
																										item
																									}
																								>
																									{
																										item
																									}
																								</MenuItem>
																							)
																						)}
																					</Select>
																				</Grid>
																			</Grid>
																			<Grid
																				container
																				direction="column"
																				className={
																					classes.inputBox
																				}
																			>
																				<Grid item>
																					<Typography
																						variant="overline"
																						gutterBottom
																						className={
																							classes.idNickname
																						}
																					>
																						Residency
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Select
																						value="Value"
																						onChange=""
																						displayEmpty
																						name="jurisdiction"
																						disableUnderline
																						IconComponent={
																							KeyboardArrowDown
																						}
																						input={
																							<Input
																								disableUnderline
																								placeholder="Choose..."
																							/>
																						}
																						style={{
																							width:
																								'100%'
																						}}
																					>
																						<MenuItem value="">
																							<em>
																								Choose...
																							</em>
																						</MenuItem>
																						{[
																							'Jurisdiction 1',
																							'Jurisdiction 2',
																							'Jurisdiction 3',
																							'Jurisdiction 4',
																							'Jurisdiction 5'
																						].map(
																							item => (
																								<MenuItem
																									key={
																										item
																									}
																									value={
																										item
																									}
																								>
																									{
																										item
																									}
																								</MenuItem>
																							)
																						)}
																					</Select>
																				</Grid>
																			</Grid>
																		</Grid>
																		<Grid
																			container
																			direction="row"
																			justify="space-between"
																			wrap="nowrap"
																			xs={12}
																		>
																			<Grid
																				container
																				direction="column"
																				className={
																					classes.inputBox
																				}
																			>
																				<Grid item>
																					<Typography
																						variant="overline"
																						gutterBottom
																					>
																						Email
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Input
																						id="email"
																						fullWidth
																						type="email"
																						error={
																							this
																								.state
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
																			<Grid
																				container
																				direction="column"
																				className={
																					classes.inputBox
																				}
																			>
																				<Grid item>
																					<Typography
																						variant="overline"
																						gutterBottom
																					>
																						Phone
																						<Typography
																							variant="overline"
																							className={
																								classes.optional
																							}
																						>
																							(optional)
																						</Typography>
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Input
																						id="email"
																						fullWidth
																						type="email"
																						error={
																							this
																								.state
																								.errorEmail
																						}
																						required
																						onChange={
																							this
																								.handleEmailChange
																						}
																						placeholder="Phone number"
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
															</Grid>
														</Grid>
													</Grid>
												</form>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Grid container direction="row" spacing={24}>
										<Grid item>
											<StyledButton
												id="saveButton"
												variant="contained"
												size="large"
												type="submit"
												disabled={
													!this.state.label ||
													!this.state.address ||
													hasAddressError ||
													hasLabelError
												}
											>
												Save
											</StyledButton>
										</Grid>
										<Grid item>
											<StyledButton
												id="cancelButton"
												variant="outlined"
												size="large"
												onClick={this.closeAction}
											>
												Cancel
											</StyledButton>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</form>
					</ModalBody>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		addressError: addressBookSelectors.getAddressError(state)
	};
};

const styledComponent = withStyles(styles)(AddCompanyMemberContainer);
export default connect(mapStateToProps)(styledComponent);
