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
		padding: '20px',
		maxHeight: '450px'
	},
	kycMembersListItem: {
		width: '265px',
		padding: '10px 15px',
		borderBottom: '1px solid #303C49',
		position: 'relative'
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
	memberListWrapper: {
		borderRight: '1px solid #303C49',
		overflow: 'visible',
		maxHeight: '450px'
	}
};

export const KycChecklistItemLabel = withStyles(styles)(
	({ item, className, classes, selectedAttributes, onSelected, addItem }) => {
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
							onClick={() => addItem(item)}
							className={classes.duplicateAddItemBtnSmall}
						>
							+ Add Item
						</Button>
					)}
				</Typography>
			);
		}
		const selectedAttr = selectedAttributes[item.uiId] || options[0];
		onSelected(item.uiId, selectedAttr);

		return (
			<RadioGroup
				className={classes.radioGroup}
				value={selectedAttr.id}
				onChange={evt =>
					onSelected(
						item.uiId,
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
						onClick={() => addItem(item)}
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
	({ item, classes, selectedAttributes, onSelected, editItem, addItem }) => {
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
						selectedAttributes={selectedAttributes}
						onSelected={onSelected}
						addItem={addItem}
					/>
				</SmallTableCell>
				<SmallTableCell className={classes.editColumn}>
					<Typography variant="subtitle1">
						<IconButton aria-label="Add" onClick={event => addItem(item)}>
							<MuiAddIcon />
						</IconButton>
						{!itemEmpty ? (
							<IconButton aria-label="Edit" onClick={event => editItem(item)}>
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
	({ classes, requirements, selectedAttributes, onSelected, editItem, addItem }) => {
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

export const KycMembersListItem = withStyles(styles)(({ classes, item }) => (
	<Grid
		container
		direction="row"
		alignItems="flex-start"
		justify="space-between"
		className={classNames(
			classes.kycMembersListItem,
			item.selected ? classes.kycMembersListItemSelected : null
		)}
		spacing={2}
	>
		<Grid item>
			<Grid
				container
				direction="column"
				alignItems="flex-start"
				justify="flex-start"
				spacing={8}
			>
				<Grid item>
					<Typography variant="h6">{item.name}</Typography>
				</Grid>
				<Grid item>
					<Typography variant="subtitle1" color="secondary">
						{Array.isArray(item.positions) ? item.positions.join(', ') : item.positions}
					</Typography>
				</Grid>
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
	({ userData, requirements, memberRequirements, onMemberClick, selectedIdentityId = null }) => {
		const members = memberRequirements.map(r => ({
			id: r.id,
			name: r.userData.name,
			positions: r.positions,
			selected: r.id === selectedIdentityId,
			warning: requirementsHaveWarning(r.requirements)
		}));
		members.unshift({
			id: 'main-company',
			name: userData.name,
			positions: 'Main Company',
			selected: selectedIdentityId === null,
			warning: requirementsHaveWarning(requirements)
		});

		return (
			<Grid container direction="column" alignItems="stretch" justify="flex-start">
				{members.map(m => (
					<Grid item key={m.id}>
						<KycMembersListItem item={m} />
					</Grid>
				))}
			</Grid>
		);
	}
);

export const KycChecklist = withStyles(styles)(
	({
		classes,
		userData,
		requirements,
		memberRequirements,
		selectedAttributes,
		onSelected,
		editItem,
		addItem
	}) => {
		if (!memberRequirements) {
			return (
				<Scrollable>
					<KycChecklistList
						requirements={requirements}
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
							requirements={requirements}
							memberRequirements={memberRequirements}
						/>
					</Scrollable>
				</Grid>
				<Grid item xs className={classes.checklistWrapper}>
					<Scrollable>
						<KycChecklistList
							requirements={requirements}
							memberRequirements={memberRequirements}
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
);

export default KycChecklist;
