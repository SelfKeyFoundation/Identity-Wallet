import React from 'react';
import moment from 'moment';
import { Table, TableBody, TableCell, IconButton, TableHead, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { EditTransparentIcon, DeleteIcon, SmallTableHeadRow, SmallTableRow } from 'selfkey-ui';

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
					<TableCell variant="head">
						<Typography variant="overline">Type</Typography>
					</TableCell>
					<TableCell variant="head">
						<Typography variant="overline">Label</Typography>
					</TableCell>
					<TableCell variant="head">
						<Typography variant="overline">Last edited</Typography>
					</TableCell>
					<TableCell variant="head" align="right">
						<Typography variant="overline">Actions</Typography>
					</TableCell>
				</SmallTableHeadRow>
			</TableHead>
			<TableBody>
				{attributes.map(entry => (
					<SmallTableRow key={entry.id}>
						<TableCell className={classes.labelCell}>
							<Typography variant="subtitle1">{entry.type.content.title}</Typography>
						</TableCell>
						<TableCell className={classes.labelCell}>
							<Typography variant="subtitle1">{attributeName(entry)}</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1">{lastUpdateDate(entry)}</Typography>
						</TableCell>
						<TableCell align="right">
							<IconButton onClick={() => onEditAttribute(entry)}>
								<EditTransparentIcon />
							</IconButton>
							<IconButton onClick={() => onDeleteAttribute(entry)}>
								<DeleteIcon />
							</IconButton>
						</TableCell>
					</SmallTableRow>
				))}
			</TableBody>
		</Table>
	)
);
