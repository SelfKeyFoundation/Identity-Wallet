import React from 'react';
import {
	Table,
	TableHead,
	TableBody,
	IconButton,
	withStyles,
	TableCell,
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	Button,
	Grid
} from '@material-ui/core';
import { CheckOutlined } from '@material-ui/icons';
import {
	SmallTableHeadRow,
	SmallTableCell,
	MuiEditIcon,
	MuiAddIcon,
	SmallTableRow,
	AttributeAlertIcon,
	warning,
	success
} from 'selfkey-ui';
import { Scrollable } from '../../common';
import classNames from 'classnames';

const styles = {
	duplicateAddItemBtnSmall: {
		width: '86px',
		marginTop: '5px',
		padding: 0
	},
	radioGroup: {
		backgroundColor: 'transparent',
		marginBottom: 0,
		paddingTop: '10px'
	},
	formControlLabel: {
		'& span': {
			fontSize: '14px',
			lineHeight: '17px'
		}
	},
	duplicateAddItemBtn: {
		width: '100px'
	},
	rowWarning: {
		color: `${warning} !important;`
	},
	warningIcon: {
		fill: warning
	},
	checkIcon: {
		fill: success
	},

	labelColumn: {
		whiteSpace: 'normal',
		wordBreak: 'break-all',
		padding: '5px'
	},
	labelCell: {
		paddingLeft: '5px'
	},
	editColumn: {
		textAlign: 'right'
	},
	kycChecklist: {
		width: '100%',
		minWidth: '600px'
	},
	corporateChecklistWrapper: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		maxHeight: '450px'
	},
	checklistWrapper: {
		padding: '10px',
		maxHeight: '450px'
	},
	kycMembersListItem: {
		width: '265px',
		padding: '10px 15px',
		borderBottom: '1px solid #303C49',
		position: 'relative',
		cursor: 'pointer'
	},
	kycMembersListItemSelected: {
		'&:before': {
			content: '""',
			position: 'absolute',
			height: '100%',
			left: '0px',
			width: '4px',
			display: 'block',
			top: '0',
			background: '#00C0D9'
		}
	},
	membersList: {},
	memberListWrapper: {
		borderRight: '1px solid #303C49',
		overflow: 'visible',
		maxHeight: '450px'
	}
};

export const KycChecklistItemLabel = withStyles(styles)(
	({
		item,
		className,
		classes,
		selectedAttributes,
		selectedIdentityId,
		selectedMember,
		onSelected,
		addItem
	}) => {
		const { options } = item;
		if (!options || options.length <= 1) {
			return (
				<Typography variant="subtitle1" className={className}>
					{options.length ? options[0].name : '...'}
					{item.duplicateType && <br />}
					{item.duplicateType && (
						<Button
							color="primary"
							size="small"
							onClick={() => addItem(item, selectedIdentityId)}
							className={classes.duplicateAddItemBtnSmall}
						>
							+ Add Item
						</Button>
					)}
				</Typography>
			);
		}
		const attributeName = `${selectedMember || selectedMember || selectedIdentityId || ''}_${
			item.uiId
		}`;
		const selectedAttr = selectedAttributes[attributeName] || options[0];
		onSelected(attributeName, selectedAttr);

		return (
			<RadioGroup
				className={classes.radioGroup}
				value={selectedAttr.id}
				onChange={evt =>
					onSelected(
						attributeName,
						options.find(itm => '' + itm.id === '' + evt.target.value)
					)
				}
			>
				{options.map(opt => (
					<FormControlLabel
						key={opt.id}
						value={opt.id}
						control={<Radio />}
						label={opt.name}
						className={classes.formControlLabel}
					/>
				))}
				{item.duplicateType && (
					<Button
						color="primary"
						size="small"
						onClick={() => addItem(item, selectedIdentityId)}
						className={classes.duplicateAddItemBtnSmall}
					>
						+ Add Item
					</Button>
				)}
			</RadioGroup>
		);
	}
);

export const KycChecklistItem = withStyles(styles)(
	({
		item,
		classes,
		selectedAttributes,
		selectedMember,
		selectedIdentityId,
		onSelected,
		editItem,
		addItem
	}) => {
		const type = item.title
			? item.title
			: item.type && item.type.content
			? item.type.content.title
			: item.schemaId;
		const itemEmpty = !item.options || !item.options.length;
		const warning = item.required && itemEmpty;

		const warningClassname = warning ? classes.rowWarning : '';
		const icon = warning ? (
			<AttributeAlertIcon />
		) : !itemEmpty ? (
			<CheckOutlined className={classes.checkIcon} />
		) : null;

		return (
			<SmallTableRow>
				<SmallTableCell className={warningClassname}>{icon}</SmallTableCell>
				<SmallTableCell>
					<Typography variant="subtitle1" className={warningClassname}>
						{type}
					</Typography>
				</SmallTableCell>
				<SmallTableCell className={classes.labelColumn}>
					<KycChecklistItemLabel
						item={item}
						className={warningClassname}
						selectedMember={selectedMember}
						selectedAttributes={selectedAttributes}
						onSelected={onSelected}
						addItem={addItem}
					/>
				</SmallTableCell>
				<SmallTableCell className={classes.editColumn}>
					<Typography variant="subtitle1">
						<IconButton
							aria-label="Add"
							onClick={event => addItem(item, selectedIdentityId)}
						>
							<MuiAddIcon />
						</IconButton>
						{!itemEmpty ? (
							<IconButton
								aria-label="Edit"
								onClick={event => editItem(item, selectedIdentityId)}
							>
								<MuiEditIcon />
							</IconButton>
						) : null}
					</Typography>
				</SmallTableCell>
			</SmallTableRow>
		);
	}
);

export const KycChecklistList = withStyles(styles)(
	({
		classes,
		requirements,
		selectedAttributes,
		selectedMember,
		selectedIdentityId,
		onSelected,
		editItem,
		addItem
	}) => {
		return (
			<Table className={classes.kycChecklist}>
				<TableHead>
					<SmallTableHeadRow>
						<TableCell className={classes.headCell}> </TableCell>
						<TableCell className={classes.headCell}>
							<Typography variant="overline">Information</Typography>
						</TableCell>
						<TableCell className={classes.labelCell}>
							<Typography variant="overline">Label</Typography>
						</TableCell>
						<TableCell className={classes.editColumn}>
							<Typography variant="overline">Actions</Typography>
						</TableCell>
					</SmallTableHeadRow>
				</TableHead>

				<TableBody>
					{requirements.map((item, indx) => {
						return (
							<KycChecklistItem
								item={item}
								key={indx}
								selectedAttributes={selectedAttributes}
								selectedMember={selectedMember}
								selectedIdentityId={selectedIdentityId}
								onSelected={onSelected}
								editItem={editItem}
								addItem={addItem}
							/>
						);
					})}
				</TableBody>
			</Table>
		);
	}
);

const requirementsHaveWarning = requirements => {
	return requirements.reduce((acc, curr) => {
		if (acc) return acc;
		return curr.required && (!curr.options || !curr.options.length);
	}, false);
};

export const KycMembersListItem = withStyles(styles)(({ classes, item, onClick }) => (
	<Grid
		container
		direction="row"
		alignItems="flex-start"
		justify="space-between"
		className={classNames(
			classes.kycMembersListItem,
			item.selected ? classes.kycMembersListItemSelected : null
		)}
		onClick={e => onClick(item)}
		spacing={0}
	>
		<Grid item xs>
			<Grid
				container
				direction="column"
				alignItems="flex-start"
				justify="flex-start"
				spacing={1}
			>
				<Grid item>
					<Typography variant="h6">{item.name}</Typography>
				</Grid>
				{item.parentCompany ? (
					<Grid item>
						<Typography variant="subtitle1" color="secondary">
							{item.parentCompany}
						</Typography>
					</Grid>
				) : null}
				{item.positions && item.positions.length > 0 && (
					<Grid item>
						<Typography variant="subtitle1" color="secondary">
							{Array.isArray(item.positions)
								? item.positions.join(', ')
								: item.positions}
						</Typography>
					</Grid>
				)}
			</Grid>
		</Grid>
		<Grid item>
			{item.warning ? (
				<AttributeAlertIcon />
			) : (
				<CheckOutlined className={classes.checkIcon} />
			)}
		</Grid>
	</Grid>
));

export const KycMembersList = withStyles(styles)(
	({
		classes,
		userData,
		requirements,
		memberRequirements,
		onMemberClick,
		selectedMember = null
	}) => {
		const companies = memberRequirements.reduce((acc, curr) => {
			if (curr.type === 'corporate') {
				acc[curr.id] = curr.userData.name;
			}
			return acc;
		}, {});
		const members = memberRequirements.map(r => ({
			id: r.id,
			uiId: r.uiId,
			template: r.memberTemplate ? r.memberTemplate.template : null,
			name: r.userData.name,
			parentCompany: companies[r.parentId] || userData.name,
			positions: r.positions,
			selected: r.uiId === selectedMember,
			warning: requirementsHaveWarning(r.requirements || [])
		}));
		members.unshift({
			id: 'main-company',
			name: userData.name,
			parentCompany: 'Main Company',
			selected: selectedMember === null,
			warning: requirementsHaveWarning(requirements)
		});

		return (
			<Grid
				container
				direction="column"
				alignItems="stretch"
				justify="flex-start"
				spacing={0}
				className={classes.membersList}
			>
				{members.map(m => (
					<Grid item key={m.uiId}>
						<KycMembersListItem item={m} onClick={onMemberClick} />
					</Grid>
				))}
			</Grid>
		);
	}
);

class KycChecklistComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = { selectedMember: null, selectedIdentityId: null };
	}

	handleMemberClick = member => {
		let selectedMember = null;
		if (member.id !== 'main-company') {
			selectedMember = member.uiId;
		}
		return this.setState({ selectedMember, selectedIdentityId: member.id });
	};

	render() {
		const {
			classes,
			userData,
			requirements,
			memberRequirements,
			selectedAttributes,
			onSelected,
			editItem,
			addItem
		} = this.props;

		const { selectedMember, selectedIdentityId } = this.state;

		let displayRequirements = requirements;

		if (selectedMember) {
			displayRequirements =
				(memberRequirements.find(m => m.uiId === selectedMember) || {}).requirements || [];
		}

		if (!memberRequirements) {
			return (
				<Scrollable>
					<KycChecklistList
						requirements={displayRequirements}
						selectedAttributes={selectedAttributes}
						onSelected={onSelected}
						editItem={editItem}
						addItem={addItem}
					/>
				</Scrollable>
			);
		}
		return (
			<Grid
				container
				direction="row"
				alignItems="stretch"
				justify="flex-start"
				className={classes.corporateChecklistWrapper}
			>
				<Grid item className={classes.memberListWrapper}>
					<Scrollable>
						<KycMembersList
							userData={userData}
							onMemberClick={this.handleMemberClick}
							requirements={requirements}
							memberRequirements={memberRequirements}
							selectedIdentityId={selectedIdentityId}
							selectedMember={selectedMember}
						/>
					</Scrollable>
				</Grid>
				<Grid item xs className={classes.checklistWrapper}>
					<Scrollable>
						<KycChecklistList
							requirements={displayRequirements}
							selectedIdentityId={selectedIdentityId}
							selectedMember={selectedMember}
							selectedAttributes={selectedAttributes}
							onSelected={onSelected}
							editItem={editItem}
							addItem={addItem}
						/>
					</Scrollable>
				</Grid>
			</Grid>
		);
	}
}

export const KycChecklist = withStyles(styles)(KycChecklistComponent);

export default KycChecklist;
