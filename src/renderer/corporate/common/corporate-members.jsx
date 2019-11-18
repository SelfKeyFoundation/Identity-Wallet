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
	getEntityName,
	getEntityRoles,
	getEntityJurisdiction,
	getEntityResidency,
	getEntityEquity
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
		marginTop: '22px'
	},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	cardContent: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
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
	}
});

const CorporateMembers = withStyles(styles)(props => {
	const {
		classes,
		onAddMember,
		onEditMember,
		onDeleteMember,
		onOpenMemberDetails,
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
							<TableCell>
								<Typography variant="overline">Selfkey user</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="overline">Actions</Typography>
							</TableCell>
						</SmallTableHeadRow>
					</TableHead>
					<TableBody>
						{members.map(entry => {
							const isOpen =
								selectedMember && selectedMember.identity.id === entry.identity.id;
							return (
								<React.Fragment key={entry.identity.id}>
									<TableRow>
										<TableCell onClick={() => onOpenMemberDetails(entry)}>
											<DropdownIcon
												className={
													isOpen ? classes.openIcon : classes.closedIcon
												}
											/>
										</TableCell>
										<TableCell>{getEntityIcon(entry)}</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getEntityName(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getEntityRoles(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" />
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getEntityJurisdiction(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" className={classes.capitalize}>
												{getEntityResidency(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getEntityEquity(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">Invite</Typography>
										</TableCell>
										<TableCell>
											<IconButton
												id="editButton"
												onClick={() => onEditMember(entry)}
											>
												<EditTransparentIcon />
											</IconButton>
											<IconButton
												id="deleteButton"
												onClick={() => onDeleteMember(entry)}
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
															attributes={selectedMember.attributes}
															onAddAttribute={onAddAttribute}
															onEditAttribute={onEditAttribute}
															onDeleteAttribute={onDeleteAttribute}
														/>
													</Grid>
													<Grid item>
														<CorporateDocuments
															documents={selectedMember.documents}
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
