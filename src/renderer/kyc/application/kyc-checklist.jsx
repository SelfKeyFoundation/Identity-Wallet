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
	Button
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

export const KycChecklist = withStyles(styles)(
	({ classes, requirements, selectedAttributes, onSelected, editItem, addItem }) => {
		return (
			<Table>
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

export default KycChecklist;
