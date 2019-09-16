import React, { Component } from 'react';

import {
	Grid,
	// CardHeader,
	// Card,
	// CardContent,
	// Table,
	// TableBody,
	// TableRow,
	// TableCell,
	// IconButton,
	// TableHead,
	Typography,
	Button,
	// Input,
	// MenuItem,
	// Select,
	withStyles
} from '@material-ui/core';
// import { KeyboardArrowDown } from '@material-ui/icons';
// import { EditTransparentIcon, DeleteIcon, SmallTableHeadRow, KeyPicker } from 'selfkey-ui';

import backgroundImage from '../../../../static/assets/images/icons/icon-marketplace.png';

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
	dropdown: {
		width: '322px'
	},
	idNickname: {
		alignItems: 'baseline',
		display: 'flex',
		flexDirection: 'row'
	},
	inputBox: {
		marginBottom: '35px',
		width: '47%'
	},
	keyBox: {
		marginBottom: '35px',
		marginRight: 'calc(47% - 200px)',
		width: '200px',
		'& .rdt': {
			width: '180px'
		}
	},
	optional: {
		display: 'inline',
		fontStyle: 'italic',
		marginLeft: '5px',
		textTransform: 'lowercase'
	}
});

class CorporateWizardComponent extends Component {
	render() {
		const { classes } = this.props;
		return (
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Typography variant="h1">SelfKey Corporate Vault Setup</Typography>
				</Grid>
				{/* <Grid item>
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
																								className={
																									classes.idNickname
																								}
																							>
																								Legal
																								Jurisdiction
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
																								Legal
																								Entity
																								Name
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
																								placeholder="Entity Name"
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
																								Legal
																								Entity
																								Type
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
																							classes.keyBox
																						}
																					>
																						<Grid item>
																							<Typography
																								variant="overline"
																								gutterBottom
																							>
																								Creation
																								Date
																							</Typography>
																						</Grid>
																						<Grid item>
																							<KeyPicker
																								id="creationDate"
																								required
																								onChange={
																									this
																										.handleLastNameChange
																								}
																								className={
																									classes.picker
																								}
																								style={{
																									'& >div': {
																										width:
																											'200px !important'
																									}
																								}}
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
																								Contact
																								Email
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
																								Tax
																								ID
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
				</Grid> */}
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					className={classes.footer}
				>
					<Grid item>
						<Button
							variant="contained"
							size="large"
							onClick={this.props.onContinueClick}
						>
							Continue
						</Button>
					</Grid>
					<Grid item className={classes.cancel}>
						<Button variant="outlined" size="large" onClick={this.props.onCancelClick}>
							Cancel
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const CorporateWizard = withStyles(styles)(CorporateWizardComponent);

export default CorporateWizard;
