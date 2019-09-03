import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { appSelectors } from 'common/app';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Table,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	TableHead,
	Typography,
	Button,
	Input,
	withStyles
} from '@material-ui/core';
import { EditTransparentIcon, DeleteIcon, SmallTableHeadRow } from 'selfkey-ui';

import backgroundImage from '../../../../../static/assets/images/icons/icon-marketplace.png';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {
		backgroundColor: '#1E262E',
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: '90% 50%',
		backgroundRepeat: 'no-repeat'
	},
	labelCell: {
		whiteSpace: 'normal',
		wordBreak: 'break-all',
		'& > div': {
			alignItems: 'center'
		}
	},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	button: {
		marginBottom: '16px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	cancel: {
		paddingLeft: '20px'
	},
	footer: {
		paddingTop: '20px',
		paddingLeft: '16px'
	},
	divider: {
		backgroundColor: '#475768',
		width: '100%',
		marginTop: '10px',
		marginBottom: '10px'
	},
	input: {
		width: '322px'
	},
	dropdown: {
		width: '322px'
	},
	idNickname: {
		alignItems: 'baseline',
		display: 'flex',
		flexDirection: 'row'
	}
});

const dummyMembers = [
	{
		id: '1',
		name: 'Giacomo Guilizzoni',
		type: 'Person',
		role: 'Director, Shareholder',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: '45%'
	},
	{
		id: '2',
		name: 'Marco Botton Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '9%'
	},
	{
		id: '3',
		name: 'Big Things Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '41%'
	},
	{
		id: '4',
		name: 'John Dafoe',
		type: 'Person',
		role: 'Director',
		citizenship: 'France',
		residency: 'France',
		shares: '5%'
	}
];

class CreateCorporateProfileComponent extends Component {
	state = {
		error: '',
		errorEmail: false,
		nickName: '',
		firstName: '',
		lastName: '',
		email: '',
		isDisabled: true
	};

	handleContinueClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	render() {
		const { classes, members } = this.props;
		return (
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Typography variant="h1">SelfKey Corporate Vault Setup</Typography>
				</Grid>
				<Grid item>
					<Grid id="createProfile" container direction="column" spacing={32}>
						<Grid item>
							<Grid container direction="column" spacing={32}>
								<Grid item>
									<Card>
										<CardHeader
											title="Step 1. Company Information"
											className={classes.regularText}
										/>
										<hr className={classes.hr} />
										<CardContent>
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
																								Legal
																								Jurisdiction*
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
																									this
																										.state
																										.error !==
																									''
																								}
																								onChange={
																									this
																										.handleNickNameChange
																								}
																								placeholder="Legal Jurisdiction"
																							/>
																							{this
																								.state
																								.error !==
																								'' && (
																								<Typography
																									variant="subtitle2"
																									color="error"
																									gutterBottom
																								>
																									{
																										this
																											.state
																											.error
																									}
																								</Typography>
																							)}
																						</Grid>
																						<Grid item>
																							<Typography
																								variant="overline"
																								gutterBottom
																							>
																								Legal
																								Entity
																								Name*
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
																								placeholder="Entity Name"
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
																								Legal
																								Entity
																								Type*
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
																								placeholder="Legal Entity Type"
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
																								Creation
																								Date*
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
																								placeholder="DD/MM/YYYY"
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
																								Contact
																								Email
																								(optional)
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
																									this
																										.state
																										.errorEmail
																								}
																								required
																								onChange={
																									this
																										.handleEmailChange
																								}
																								placeholder="Entity Email"
																							/>
																							{this
																								.state
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
																								Tax
																								ID
																								(optional)
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
																									this
																										.state
																										.errorEmail
																								}
																								required
																								onChange={
																									this
																										.handleEmailChange
																								}
																								placeholder="Tax Payer ID"
																							/>
																							{this
																								.state
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
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid container direction="column" spacing={32}>
								<Grid item>
									<Card>
										<CardHeader
											title="Step 2. Company Members"
											className={classes.regularText}
										/>
										<hr className={classes.hr} />
										<CardContent>
											<Grid
												container
												direction="column"
												justify="center"
												alignItems="center"
												spacing={24}
											>
												<Grid container item spacing={0} justify="center">
													<Grid item xs={12}>
														<Table>
															<TableHead>
																<SmallTableHeadRow>
																	<TableCell>
																		<Typography variant="overline">
																			Name
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography variant="overline">
																			Type
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography variant="overline">
																			Role
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography variant="overline">
																			Citizenship /
																			Incorporation
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography variant="overline">
																			Residency / Domicile
																		</Typography>
																	</TableCell>
																	<TableCell>
																		<Typography variant="overline">
																			Shares
																		</Typography>
																	</TableCell>
																	<TableCell align="right">
																		<Typography variant="overline">
																			Actions
																		</Typography>
																	</TableCell>
																</SmallTableHeadRow>
															</TableHead>
															<TableBody>
																{members &&
																	members.map(entry => {
																		return (
																			<TableRow
																				key={entry.id}
																			>
																				<TableCell>
																					<Typography variant="h6">
																						{entry.name}
																					</Typography>
																				</TableCell>
																				<TableCell>
																					{entry.type}
																				</TableCell>
																				<TableCell>
																					{entry.role}
																				</TableCell>
																				<TableCell>
																					{
																						entry.citizenship
																					}
																				</TableCell>
																				<TableCell>
																					{
																						entry.residency
																					}
																				</TableCell>
																				<TableCell>
																					<Typography variant="h6">
																						{
																							entry.shares
																						}
																					</Typography>
																				</TableCell>
																				<TableCell align="right">
																					<IconButton id="editButton">
																						<EditTransparentIcon
																							onClick={() => {
																								this.handleEditMember(
																									entry
																								);
																							}}
																						/>
																					</IconButton>
																					<IconButton
																						id="deleteButton"
																						onClick={() => {
																							this.handleDeleteMember(
																								entry
																							);
																						}}
																					>
																						<DeleteIcon />
																					</IconButton>
																				</TableCell>
																			</TableRow>
																		);
																	})}
															</TableBody>
														</Table>
													</Grid>
												</Grid>
												<Grid container item spacing={0} justify="center">
													<Grid item>
														<Button
															id="addDocuments"
															variant="outlined"
															size="large"
															color="secondary"
															onClick={this.handleAddDocument}
															className={classes.button}
														>
															Add New Member
														</Button>
													</Grid>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					className={classes.footer}
				>
					<Grid item>
						<Button variant="contained" size="large" onClick={this.handleContinueClick}>
							Continue
						</Button>
					</Grid>
					<Grid item className={classes.cancel}>
						<Button variant="outlined" size="large" onClick={this.handleCancelClick}>
							Cancel
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		walletType: appSelectors.selectWalletType(state),
		members: dummyMembers
	};
};

export const CreateCorporateProfile = connect(mapStateToProps)(
	withStyles(styles)(CreateCorporateProfileComponent)
);

export default CreateCorporateProfile;
