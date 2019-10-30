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
import {
	SmallTableHeadRow,
	EditTransparentIcon,
	DeleteIcon,
	DropdownIcon,
	SmallRoundCompany,
	SmallRoundPerson
} from 'selfkey-ui';
import CorporateDocuments from './corporate-documents';
import CorporateInformation from './corporate-information';

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
	}
});

const getEntityIcon = entry => {
	if (entry.entity.type === 'individual') {
		return <SmallRoundPerson />;
	} else {
		return <SmallRoundCompany />;
	}
};

const getEntityName = entry => {
	if (entry.entity.type === 'individual') {
		return `${entry.entity.lastName}, ${entry.entity.firstName}`;
	} else {
		return `${entry.entity.companyName}`;
	}
};

const getEntityRoles = entry => entry.positions.map(p => p.position).join(', ');

const getEntityJurisdiction = entry => {
	const idAttribute =
		entry.entity.type === 'individual'
			? 'http://platform.selfkey.org/schema/attribute/nationality.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityResidency = entry => {
	const idAttribute =
		entry.entity.type === 'individual'
			? 'http://platform.selfkey.org/schema/attribute/country-of-residency.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityShares = entry => {
	const shareholder = entry.positions.find(p => p.position === 'shareholder');
	if (shareholder) {
		return shareholder.equity;
	} else {
		return '';
	}
};

const CorporateMembers = withStyles(styles)(props => {
	const {
		classes,
		onAddMember,
		onEditMember,
		onDeleteMember,
		onOpenEntityDetails,
		onAddAttribute,
		onEditAttribute,
		onDeleteAttribute,
		onAddDocument,
		onEditDocument,
		onDeleteDocument,
		members = [],
		selectedEntity = false
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
								selectedEntity &&
								selectedEntity.entity.email === entry.entity.email;
							return (
								<React.Fragment key={entry.entity.email}>
									<TableRow>
										<TableCell onClick={onOpenEntityDetails(entry)}>
											<DropdownIcon
												className={
													isOpen ? classes.openIcon : classes.closedIcon
												}
											/>
										</TableCell>
										<TableCell>{getEntityIcon(entry)}</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getEntityName(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getEntityRoles(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6" />
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getEntityJurisdiction(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getEntityResidency(entry)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">
												{getEntityShares(entry)}
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
															attributes={selectedEntity.attributes}
															onAddAttribute={onAddAttribute}
															onEditAttribute={onEditAttribute}
															onDeleteAttribute={onDeleteAttribute}
														/>
													</Grid>
													<Grid item>
														<CorporateDocuments
															documents={selectedEntity.documents}
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
