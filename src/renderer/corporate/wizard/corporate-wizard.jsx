import React, { PureComponent } from 'react';
import {
	CardHeader,
	Card,
	CardContent,
	Typography,
	Button,
	Input,
	MenuItem,
	Select,
	withStyles
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { KeyPicker } from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 30px 10px'
	},
	card: {
		overflow: 'visible'
	},
	regularText: {
		padding: '24px 30px',
		'& span': {
			fontWeight: 400
		}
	},
	cancel: {
		paddingLeft: '20px'
	},
	footer: {
		alignItems: 'flex-start',
		display: 'flex',
		justifyContent: 'flex-start',
		paddingTop: '60px'
	},
	inputBox: {
		marginBottom: '35px',
		width: '47%'
	},
	lastInputBox: {
		marginBottom: '26px',
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
	},
	select: {
		width: '100%'
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column'
	},
	inputContainer: {
		alignItems: 'flex-start',
		justify: 'flex-start'
	},
	inputWrap: {
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		width: '100%'
	},
	cardContent: {
		padding: '24px 30px'
	},
	wizardTitle: {
		marginBottom: '45px'
	}
});

const InputTitle = withStyles(styles)(({ classes, title, optional = false }) => {
	return (
		<div>
			<Typography variant="overline" gutterBottom>
				{title}
				{optional ? (
					<Typography variant="overline" className={classes.optional}>
						(optional)
					</Typography>
				) : (
					''
				)}
			</Typography>
		</div>
	);
});

const CompanyInformation = withStyles(styles)(props => {
	const {
		classes,
		jurisdictions = [],
		entityTypes = [],
		errors = {},
		jurisdiction,
		taxId,
		entityType,
		email,
		entityName,
		creationDate,
		onFieldChange = () => {}
	} = props;
	return (
		<div className={classes.flexColumn}>
			<Card className={classes.card}>
				<CardHeader title="Step 1. Company Information" className={classes.regularText} />
				<hr className={classes.hr} />
				<CardContent className={classes.cardContent}>
					<form noValidate>
						<div className={`${classes.flexColumn} ${classes.inputContainer}`}>
							<div className={classes.inputWrap}>
								<div className={`${classes.inputBox} ${classes.flexColumn}`}>
									<InputTitle title="Legal Jurisdiction" />
									<Select
										className={classes.select}
										onChange={onFieldChange('jurisdiction')}
										displayEmpty
										error={errors.jurisdiction}
										name="jurisdiction"
										value={jurisdiction}
										disableUnderline
										IconComponent={KeyboardArrowDown}
										input={<Input disableUnderline placeholder="Choose..." />}
									>
										<MenuItem value="">
											<em>Choose...</em>
										</MenuItem>
										{jurisdictions.map(item => (
											<MenuItem key={item} value={item.code}>
												{item.name}
											</MenuItem>
										))}
									</Select>
									{errors.jurisdiction && (
										<Typography variant="subtitle2" color="error" gutterBottom>
											{errors.jurisdiction}
										</Typography>
									)}
								</div>
								<div className={`${classes.inputBox} ${classes.flexColumn}`}>
									<InputTitle title="Legal Entity Name" />
									<Input
										id="entityName"
										fullWidth
										required
										error={errors.entityName}
										value={entityName}
										onChange={onFieldChange('entityName')}
										placeholder="Entity Name"
									/>
									{errors.entityName && (
										<Typography variant="subtitle2" color="error" gutterBottom>
											{errors.entityName}
										</Typography>
									)}
								</div>
							</div>
							<div className={classes.inputWrap}>
								<div className={`${classes.inputBox} ${classes.flexColumn}`}>
									<InputTitle title="Legal Entity Type" />
									<Select
										className={classes.select}
										onChange={onFieldChange('entityType')}
										displayEmpty
										value={entityType}
										name="entitytype"
										error={errors.entityType}
										disableUnderline
										IconComponent={KeyboardArrowDown}
										input={<Input disableUnderline />}
									>
										<MenuItem value="">
											<em>Choose...</em>
										</MenuItem>
										{entityTypes.map(item => (
											<MenuItem key={item} value={item.code}>
												{item.name}
											</MenuItem>
										))}
									</Select>
									{errors.entityType && (
										<Typography variant="subtitle2" color="error" gutterBottom>
											{errors.entityType}
										</Typography>
									)}
								</div>
								<div className={`${classes.inputBox} ${classes.flexColumn}`}>
									<InputTitle title="Incorporation Date" />
									<KeyPicker
										id="creationDate"
										value={creationDate}
										required
										error={errors.creationDate}
										onChange={onFieldChange('creationDate')}
										className={classes.picker}
										isError={errors.creationDate && 'true'}
										style={{
											'& >div': {
												width: '200px !important'
											}
										}}
									/>
									{errors.creationDate && (
										<Typography variant="subtitle2" color="error" gutterBottom>
											{errors.creationDate}
										</Typography>
									)}
								</div>
							</div>
							<div className={classes.inputWrap}>
								<div className={`${classes.lastInputBox} ${classes.flexColumn}`}>
									<InputTitle title="Contact Email" optional={true} />
									<Input
										id="email"
										fullWidth
										type="email"
										error={errors.email}
										value={email}
										onChange={onFieldChange('email')}
										placeholder="Entity Email"
									/>
									{errors.email && (
										<Typography variant="subtitle2" color="error" gutterBottom>
											{errors.email}
										</Typography>
									)}
								</div>
								<div className={`${classes.lastInputBox} ${classes.flexColumn}`}>
									<InputTitle title="Tax ID" optional={true} />
									<Input
										id="taxId"
										fullWidth
										value={taxId}
										error={errors.taxId}
										type="text"
										onChange={onFieldChange('taxId')}
										placeholder="Tax Payer ID"
									/>
									{errors.taxId && (
										<Typography variant="subtitle2" color="error" gutterBottom>
											{errors.taxId}
										</Typography>
									)}
								</div>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
});

// const MembersList = withStyles(styles)(props => {
// 	const { classes, members } = props;
// 	return (
// 		<Grid container direction="column" spacing={4}>
// 			<Grid item>
// 				<Card>
// 					<CardHeader title="Step 2. Company Members" className={classes.regularText} />
// 					<hr className={classes.hr} />
// 					<CardContent>
// 						<Grid
// 							container
// 							direction="column"
// 							justify="center"
// 							alignItems="center"
// 							spacing={3}
// 						>
// 							<Grid container item spacing={0} justify="center">
// 								<Grid item xs={12}>
// 									<Table>
// 										<TableHead>
// 											<SmallTableHeadRow>
// 												<TableCell>
// 													<Typography variant="overline">Name</Typography>
// 												</TableCell>
// 												<TableCell>
// 													<Typography variant="overline">Type</Typography>
// 												</TableCell>
// 												<TableCell>
// 													<Typography variant="overline">Role</Typography>
// 												</TableCell>
// 												<TableCell>
// 													<Typography variant="overline">
// 														Citizenship / Incorporation
// 													</Typography>
// 												</TableCell>
// 												<TableCell>
// 													<Typography variant="overline">
// 														Residency / Domicile
// 													</Typography>
// 												</TableCell>
// 												<TableCell>
// 													<Typography variant="overline">
// 														Shares
// 													</Typography>
// 												</TableCell>
// 												<TableCell align="right">
// 													<Typography variant="overline">
// 														Actions
// 													</Typography>
// 												</TableCell>
// 											</SmallTableHeadRow>
// 										</TableHead>
// 										<TableBody>
// 											{members &&
// 												members.map(entry => {
// 													return (
// 														<TableRow key={entry.id}>
// 															<TableCell>
// 																<Typography variant="h6">
// 																	{entry.name}
// 																</Typography>
// 															</TableCell>
// 															<TableCell>{entry.type}</TableCell>
// 															<TableCell>{entry.role}</TableCell>
// 															<TableCell>
// 																{entry.citizenship}
// 															</TableCell>
// 															<TableCell>{entry.residency}</TableCell>
// 															<TableCell>
// 																<Typography variant="h6">
// 																	{entry.shares}
// 																</Typography>
// 															</TableCell>
// 															<TableCell align="right">
// 																<IconButton id="editButton">
// 																	<EditTransparentIcon
// 																		onClick={() => {
// 																			this.handleEditMember(
// 																				entry
// 																			);
// 																		}}
// 																	/>
// 																</IconButton>
// 																<IconButton
// 																	id="deleteButton"
// 																	onClick={() => {
// 																		this.handleDeleteMember(
// 																			entry
// 																		);
// 																	}}
// 																>
// 																	<DeleteIcon />
// 																</IconButton>
// 															</TableCell>
// 														</TableRow>
// 													);
// 												})}
// 										</TableBody>
// 									</Table>
// 								</Grid>
// 							</Grid>
// 							<Grid container item spacing={0} justify="center">
// 								<Grid item>
// 									<Button
// 										id="addDocuments"
// 										variant="outlined"
// 										size="large"
// 										color="secondary"
// 										onClick={this.handleAddCompanyMember}
// 										className={classes.button}
// 									>
// 										Add New Member
// 									</Button>
// 								</Grid>
// 							</Grid>
// 						</Grid>
// 					</CardContent>
// 				</Card>
// 			</Grid>
// 		</Grid>
// 	);
// });

class CorporateWizardComponent extends PureComponent {
	render() {
		const { classes, isDisabled } = this.props;
		return (
			<div className={classes.flexColumn}>
				<div className={classes.wizardTitle}>
					<Typography variant="h1">SelfKey Corporate Wallet Setup</Typography>
				</div>
				<div id="createProfile">
					<CompanyInformation {...this.props} />
					{/* <Grid item><MembersList {...this.props}/></Grid> */}
				</div>
				<div className={classes.footer}>
					<div>
						<Button
							variant="contained"
							size="large"
							disabled={isDisabled}
							onClick={this.props.onContinueClick}
						>
							Continue
						</Button>
					</div>
					<div className={classes.cancel}>
						<Button variant="outlined" size="large" onClick={this.props.onCancelClick}>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export const CorporateWizard = withStyles(styles)(CorporateWizardComponent);

export default CorporateWizard;
