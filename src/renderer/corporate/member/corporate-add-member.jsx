import React, { PureComponent } from 'react';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	StyledButton,
	DirectorIcon,
	ChartIcon,
	ProfileIcon,
	CompanyIcon
} from 'selfkey-ui';
import { Grid, Modal, Typography, Input, Select, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

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
	},
	inputBox: {
		marginBottom: '35px',
		width: '47%'
	},
	optional: {
		display: 'inline',
		fontStyle: 'italic',
		marginLeft: '5px',
		textTransform: 'lowercase'
	},
	shareInput: {
		maxWidth: '160px',
		marginRight: '10px',
		'& input': {
			textAlign: 'right'
		}
	},
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '40px 0',
		width: '100%'
	},
	title: {
		marginTop: '12px'
	},
	icon: {
		marginRight: '15px'
	},
	radiobox: {
		backgroundColor: '#293743',
		borderRadius: '4px',
		boxSizing: 'border-box',
		maxWidth: '280px',
		minWidth: '215px',
		padding: '25px'
	},
	radioBoxContainer: {
		margin: '10px 0 40px'
	},
	radio: {
		margin: '0 15px',
		'& input[type="checkbox"]': {
			opacity: 0
		},
		'& input[type="checkbox"] + label::after': {
			content: 'none'
		},
		'& label::before': {
			content: '',
			display: 'inline-block',
			height: '16px',
			width: '16px',
			border: '1px solid'
		},
		'& label::after': {
			content: '',
			display: 'inline-block',
			height: '6px',
			width: '9px',
			borderLeft: '2px solid',
			borderBottom: '2px solid',
			transform: 'rotate(-45deg)'
		},
		'& input[type="checkbox"] + label': {
			'& div': {
				border: '2px solid #1D505F',
				cursor: 'pointer'
			}
		},
		'& input[type="checkbox"]:checked + label': {
			'& div': {
				border: '2px solid #1CA9BA',
				cursor: 'pointer'
			}
		}
	}
});

class CorporateAddMemberComponent extends PureComponent {
	state = {
		error: '',
		errorEmail: false,
		nickName: '',
		firstName: '',
		lastName: '',
		email: '',
		isDisabled: true
	};

	handleEmailChange = event => {
		this.setState({ email: event.target.value }, () => {
			let valid = this.isValidEmail(this.state.email);
			this.setState({ errorEmail: !valid }, () => {
				this.isDisabled();
			});
		});
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
							<Grid
								container
								direction="column"
								justify="center"
								alignItems="center"
								spacing={0}
								xs={12}
							>
								<Grid spacing={0}>
									<Grid container direction="column" spacing={8}>
										<Grid item>
											<Typography
												variant="body1"
												align="center"
												className={classes.title}
											>
												Select one or multiple roles
											</Typography>
										</Grid>
										<Grid item>
											<Grid
												container
												justify="center"
												className={classes.radioBoxContainer}
											>
												<div className={classes.radio}>
													<input
														type="checkbox"
														id="role_1"
														name="roles[]"
													/>
													<label htmlFor="role_1">
														<Grid
															container
															className={classes.radiobox}
															style={{ minHeight: '158px' }}
														>
															<Grid
																container
																alignItems="center"
																style={{ border: 'none' }}
															>
																<DirectorIcon
																	className={classes.icon}
																/>
																<Typography variant="body2">
																	Director
																</Typography>
															</Grid>
															<Typography
																variant="subtitle2"
																color="secondary"
																style={{ marginTop: '15px' }}
															>
																Person from a group of managers who
																leads or supervises a particular
																area of your company.
															</Typography>
														</Grid>
													</label>
												</div>
												<div className={classes.radio}>
													<input
														type="checkbox"
														id="role_2"
														name="roles[]"
													/>
													<label htmlFor="role_2">
														<Grid
															container
															className={classes.radiobox}
															style={{ minHeight: '158px' }}
														>
															<Grid
																container
																alignItems="center"
																style={{ border: 'none' }}
															>
																<ChartIcon
																	className={classes.icon}
																/>
																<Typography variant="body2">
																	Shareholder
																</Typography>
															</Grid>
															<Typography
																variant="subtitle2"
																color="secondary"
																style={{ marginTop: '15px' }}
															>
																Individual or institution that
																legally owns one or more shares of
																stock in your company.
															</Typography>
														</Grid>
													</label>
												</div>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									spacing={0}
									style={{
										width: '100%'
									}}
								>
									<Grid container direction="column" spacing={8}>
										<Grid item>
											<Typography variant="body1" align="center">
												Type
											</Typography>
										</Grid>
										<Grid item>
											<Grid
												container
												justify="center"
												className={classes.radioContainer}
											>
												<div className={classes.radio}>
													<input type="radio" id="radio_3" name="type" />
													<label htmlFor="radio_3">
														<Grid
															container
															alignItems="center"
															className={classes.radiobox}
														>
															<ProfileIcon
																height="35px"
																width="40px"
																viewBox="0 0 35 40"
																className={classes.icon}
															/>
															<Typography variant="body2">
																Individual
															</Typography>
														</Grid>
													</label>
												</div>
												<div className={classes.radio}>
													<input type="radio" id="radio_4" name="type" />
													<label htmlFor="radio_4">
														<Grid
															container
															alignItems="center"
															className={classes.radiobox}
														>
															<CompanyIcon className={classes.icon} />
															<Typography variant="body2">
																Legal Entity
															</Typography>
														</Grid>
													</label>
												</div>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<hr className={classes.hr} />
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
														className={classes.inputBox}
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
																	this.handleFirstNameChange
																}
																placeholder="First Name"
															/>
														</Grid>
													</Grid>
													<Grid
														container
														direction="column"
														className={classes.inputBox}
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
																	this.handleFirstNameChange
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
														className={classes.inputBox}
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
																IconComponent={KeyboardArrowDown}
																input={<Input disableUnderline />}
																style={{
																	width: '100%'
																}}
															>
																<MenuItem value="">
																	<em>Choose...</em>
																</MenuItem>
																{[
																	'Entity Type 1',
																	'Entity Type 2',
																	'Entity Type 3',
																	'Entity Type 4',
																	'Entity Type 5'
																].map(item => (
																	<MenuItem
																		key={item}
																		value={item}
																	>
																		{item}
																	</MenuItem>
																))}
															</Select>
														</Grid>
													</Grid>
													<Grid
														container
														direction="column"
														className={classes.inputBox}
													>
														<Grid item>
															<Typography
																variant="overline"
																gutterBottom
																className={classes.idNickname}
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
																IconComponent={KeyboardArrowDown}
																input={
																	<Input
																		disableUnderline
																		placeholder="Choose..."
																	/>
																}
																style={{
																	width: '100%'
																}}
															>
																<MenuItem value="">
																	<em>Choose...</em>
																</MenuItem>
																{[
																	'Jurisdiction 1',
																	'Jurisdiction 2',
																	'Jurisdiction 3',
																	'Jurisdiction 4',
																	'Jurisdiction 5'
																].map(item => (
																	<MenuItem
																		key={item}
																		value={item}
																	>
																		{item}
																	</MenuItem>
																))}
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
														className={classes.inputBox}
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
																error={this.state.errorEmail}
																required
																onChange={this.handleEmailChange}
																placeholder="Email"
															/>
															{this.state.errorEmail && (
																<Typography
																	variant="subtitle2"
																	color="error"
																	gutterBottom
																>
																	{'Email provided is invalid'}
																</Typography>
															)}
														</Grid>
													</Grid>
													<Grid
														container
														direction="column"
														className={classes.inputBox}
													>
														<Grid item>
															<Typography
																variant="overline"
																gutterBottom
															>
																Phone
																<Typography
																	variant="overline"
																	className={classes.optional}
																>
																	(optional)
																</Typography>
															</Typography>
														</Grid>
														<Grid item>
															<Input
																id="phone"
																fullWidth
																type="number"
																error={this.state.errorEmail}
																required
																onChange={this.handleEmailChange}
																placeholder="Phone number"
															/>
															{this.state.errorEmail && (
																<Typography
																	variant="subtitle2"
																	color="error"
																	gutterBottom
																>
																	{'Phone number is invalid'}
																</Typography>
															)}
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
														className={classes.inputBox}
													>
														<Grid item>
															<Typography
																variant="overline"
																gutterBottom
															>
																Shares owned
															</Typography>
														</Grid>
														<Grid item>
															<Grid
																container
																direction="row"
																wrap="nowrap"
																alignItems="center"
															>
																<Input
																	id="shares"
																	fullWidth
																	type="number"
																	error={this.state.errorEmail}
																	required
																	onChange={
																		this.handleEmailChange
																	}
																	placeholder="0"
																	className={classes.shareInput}
																/>
																<Typography variant="body1">
																	%
																</Typography>
															</Grid>
															{this.state.errorEmail && (
																<Typography
																	variant="subtitle2"
																	color="error"
																	gutterBottom
																>
																	{'You can use only numbers'}
																</Typography>
															)}
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
													<Grid container direction="column">
														<Grid item>
															<Typography
																variant="overline"
																gutterBottom
															>
																Selfkey DID
																<Typography
																	variant="overline"
																	className={classes.optional}
																>
																	(optional)
																</Typography>
															</Typography>
														</Grid>
														<Grid item>
															<Input
																id="did"
																fullWidth
																type="text"
																error={this.state.errorEmail}
																required
																onChange={this.handleEmailChange}
																placeholder="did:selfkey:"
															/>
															{this.state.errorEmail && (
																<Typography
																	variant="subtitle2"
																	color="error"
																	gutterBottom
																>
																	{'DID is invalid'}
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
							<Grid item style={{ marginTop: '60px' }}>
								<Grid container direction="row">
									<Grid item style={{ marginRight: '20px' }}>
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
											Continue
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
						</form>
					</ModalBody>
				</ModalWrap>
			</Modal>
		);
	}
}

export const CorporateAddMember = withStyles(styles)(CorporateAddMemberComponent);

export default CorporateAddMember;
