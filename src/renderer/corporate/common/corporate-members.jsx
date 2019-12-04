import React from 'react';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableCell,
	TableRow,
	TableHead,
	TableBody,
	IconButton,
	Button,
	withStyles
} from '@material-ui/core';
import { SmallTableHeadRow, EditTransparentIcon, DeleteIcon, DropdownIcon } from 'selfkey-ui';
import CorporateDocuments from './corporate-documents';
import CorporateInformation from './corporate-information';
import {
	getEntityIcon,
	getProfileName,
	getMemberPositions,
	getProfileJurisdiction,
	getProfileResidency,
	getMemberEquity,
	getProfileEmail
} from './common-helpers.jsx';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {
		marginTop: '22px',
		overflow: 'auto'
	},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	cardContent: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		'& td': {
			whiteSpace: 'pre-wrap'
		}
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	documentColumn: {
		display: 'flex',
		alignItems: 'center',
		'& .file-icon': {
			marginRight: '15px'
		}
	},
	button: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: '30px'
	},
	noOverflow: {
		maxWidth: '320px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	},
	openIcon: {
		transform: 'rotate(0deg)'
	},
	closedIcon: {
		transform: 'rotate(-90deg)'
	},
	capitalize: {
		textTransform: 'capitalize'
	},
	iconColumn: {
		maxWidth: '1em',
		padding: '0',
		textAlign: 'center'
	},
	email: {
		textTransform: 'lowercase'
	}
});

const CorporateMembers = withStyles(styles)(props => {
	const {
		classes,
		onAddMember,
		onOpenMemberDetails,
		onEditMember,
		onDeleteMember,
		onAddAttribute,
		onEditAttribute,
		onDeleteAttribute,
		onAddDocument,
		onEditDocument,
		onDeleteDocument,
		members = [],
		selectedMember = false
	} = props;
	return (
		<Card className={classes.card}>
			<CardHeader title="Entity Membership" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent className={classes.cardContent}>
				<Table>
					<TableHead>
						<SmallTableHeadRow>
							<TableCell />
							<TableCell />
							<TableCell>
								<Typography variant="overline">Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Role</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Parent Company</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">
									Citizenship / Incorporation
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Residency / Domicile</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Shares</Typography>
							</TableCell>
							{/* }
							<TableCell>
								<Typography variant="overline">Selfkey user</Typography>
							</TableCell>
							*/}
							<TableCell align="right">
								<Typography variant="overline">Actions</Typography>
							</TableCell>
						</SmallTableHeadRow>
					</TableHead>
					<TableBody>
						{members.map(member => {
							const isOpen =
								selectedMember && selectedMember.identity.id === member.identity.id;
							return (
								<React.Fragment key={member.identity.id}>
									<TableRow>
										<TableCell
											onClick={() => onOpenMemberDetails(member)}
											className={classes.iconColumn}
										>
											<DropdownIcon
												className={
													isOpen ? classes.openIcon : classes.closedIcon
												}
											/>
										</TableCell>
										<TableCell className={classes.iconColumn}>
											{getEntityIcon(member)}
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getProfileName(member)}
											</Typography>
											<Typography
												variant="overline"
												className={classes.email}
											>
												{getProfileEmail(member)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getMemberPositions(member)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{member.parent
													? getProfileName(member.parent)
													: null}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getProfileJurisdiction(member)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getProfileResidency(member)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getMemberEquity(member)}%
											</Typography>
										</TableCell>
										{/*
										<TableCell>
											<Typography variant="h6">Invite</Typography>
										</TableCell>
										*/}
										<TableCell>
											<IconButton
												id="editButton"
												onClick={() => onEditMember(member)}
											>
												<EditTransparentIcon />
											</IconButton>
											<IconButton
												id="deleteButton"
												onClick={() => onDeleteMember(member)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
									{isOpen && (
										<tr>
											<td colSpan="10">
												<Grid
													container
													direction="column"
													justify="flex-start"
													alignItems="stretch"
													spacing={16}
												>
													<Grid item>
														<CorporateInformation
															attributes={member.attributes}
															onAddAttribute={onAddAttribute}
															onEditAttribute={onEditAttribute}
															onDeleteAttribute={onDeleteAttribute}
														/>
													</Grid>
													<Grid item>
														<CorporateDocuments
															documents={member.documents}
															onAddDocument={onAddDocument}
															onEditDocument={onEditDocument}
															onDeleteDocument={onDeleteDocument}
														/>
													</Grid>
												</Grid>
											</td>
										</tr>
									)}
								</React.Fragment>
							);
						})}
					</TableBody>
				</Table>
				<div className={classes.button}>
					<Button
						id="addMember"
						variant="outlined"
						size="large"
						color="secondary"
						onClick={onAddMember}
					>
						Add New Member
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateMembers };
export default CorporateMembers;
