import React from 'react';
import moment from 'moment';
import { Table, TableBody, IconButton, TableHead, Typography, withStyles } from '@material-ui/core';
import {
	EditTransparentIcon,
	DeleteIcon,
	SmallTableHeadRow,
	SmallTableRow,
	SmallTableCell
} from 'selfkey-ui';

const styles = theme => ({
	labelCell: {
		whiteSpace: 'normal',
		wordBreak: 'break-all',
		'& > div': {
			alignItems: 'center'
		}
	}
});

const lastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

const attributeName = ({ name }) => name || 'No label provided';

export const AttributesTable = withStyles(styles)(
	({ classes, attributes = [], onEditAttribute, onDeleteAttribute }) => (
		<Table>
			<TableHead>
				<SmallTableHeadRow>
					<SmallTableCell variant="head">
						<Typography variant="overline">Type</Typography>
					</SmallTableCell>
					<SmallTableCell variant="head">
						<Typography variant="overline">Label</Typography>
					</SmallTableCell>
					<SmallTableCell variant="head">
						<Typography variant="overline">Last edited</Typography>
					</SmallTableCell>
					<SmallTableCell variant="head" align="right">
						<Typography variant="overline">Actions</Typography>
					</SmallTableCell>
				</SmallTableHeadRow>
			</TableHead>
			<TableBody>
				{attributes.map(entry => (
					<SmallTableRow key={entry.id}>
						<SmallTableCell className={classes.labelCell}>
							<Typography variant="subtitle1">{entry.type.content.title}</Typography>
						</SmallTableCell>
						<SmallTableCell className={classes.labelCell}>
							<Typography variant="subtitle1">{attributeName(entry)}</Typography>
						</SmallTableCell>
						<SmallTableCell>
							<Typography variant="subtitle1">{lastUpdateDate(entry)}</Typography>
						</SmallTableCell>
						<SmallTableCell align="right">
							<IconButton onClick={() => onEditAttribute(entry)}>
								<EditTransparentIcon />
							</IconButton>
							<IconButton onClick={() => onDeleteAttribute(entry)}>
								<DeleteIcon />
							</IconButton>
						</SmallTableCell>
					</SmallTableRow>
				))}
			</TableBody>
		</Table>
	)
);
