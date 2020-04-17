import React from 'react';
import moment from 'moment';
import { Table, TableBody, TableRow, IconButton, TableHead, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
	FilePdfIcon,
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	FileAudioIcon,
	FileLinkWithModal,
	EditTransparentIcon,
	DeleteIcon,
	SmallTableHeadRow,
	SmallTableCell
} from 'selfkey-ui';

const styles = theme => ({
	labelCell: {
		whiteSpace: 'normal',
		wordBreak: 'break-all',
		'& > div': {
			alignItems: 'center'
		}
	},
	documentColumn: {
		display: 'flex',
		alignItems: 'center',
		'& .file-icon': {
			marginRight: '15px'
		}
	},
	ellipsis: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		maxWidth: '222px'
	}
});

const lastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

const DocumentExpiryDate = ({ doc }) => {
	let date;
	if (!doc || !doc.data || !doc.data.value || !doc.data.value.expires) {
		date = '-';
	} else {
		date = moment(doc.data.value.expires).format('DD MMM YYYY');
	}
	return <span>{date}</span>;
};

const DocumentName = ({ entry, classes }) => {
	let fileType = null;
	let fileName = null;
	let hasOneDocument = false;
	let FileIcon = FileDefaultIcon;

	if (entry.documents.length === 1) {
		fileType = entry.documents[0].mimeType;
		hasOneDocument = true;
		if (fileType) {
			if (fileType === 'application/pdf') FileIcon = FilePdfIcon;
			else if (fileType.startsWith('audio')) FileIcon = FileAudioIcon;
			else if (fileType.startsWith('image')) FileIcon = FileImageIcon;
		}
	} else if (entry.documents.length > 1) {
		fileName = `${entry.documents.length} files`;
		FileIcon = FileMultipleIcon;
	}

	return (
		<div className={classes.documentColumn}>
			<div className="file-icon">
				<FileIcon />
			</div>
			<div>
				<Typography variant="h6">{entry.name}</Typography>
				{fileName && (
					<Typography
						variant="subtitle1"
						color="secondary"
						className={classes.ellipsis}
						title={fileName}
					>
						{fileName}
					</Typography>
				)}
				{hasOneDocument && (
					<FileLinkWithModal
						file={entry.documents[0]}
						small
						onPDFOpen={file => window.openPDF(file.content || file.url)}
					/>
				)}
			</div>
		</div>
	);
};

export const DocumentsTable = withStyles(styles)(
	({ classes, documents = [], onEditAttribute, onDeleteAttribute }) => (
		<Table>
			<TableHead>
				<SmallTableHeadRow>
					<SmallTableCell>
						<Typography variant="overline">Type</Typography>
					</SmallTableCell>
					<SmallTableCell>
						<Typography variant="overline">Label</Typography>
					</SmallTableCell>
					<SmallTableCell>
						<Typography variant="overline">Expiry Date</Typography>
					</SmallTableCell>
					<SmallTableCell>
						<Typography variant="overline">Last Edited</Typography>
					</SmallTableCell>
					<SmallTableCell align="right">
						<Typography variant="overline">Actions</Typography>
					</SmallTableCell>
				</SmallTableHeadRow>
			</TableHead>
			<TableBody>
				{documents.map(entry => (
					<TableRow key={entry.id}>
						<SmallTableCell>
							<Typography variant="h6">{entry.type.content.title}</Typography>
						</SmallTableCell>
						<SmallTableCell className={classes.labelCell}>
							<DocumentName entry={entry} classes={classes} />
						</SmallTableCell>
						<SmallTableCell>
							<DocumentExpiryDate doc={entry} />
						</SmallTableCell>
						<SmallTableCell>
							<Typography variant="h6">{lastUpdateDate(entry)}</Typography>
						</SmallTableCell>
						<SmallTableCell align="right">
							<IconButton onClick={() => onEditAttribute(entry)}>
								<EditTransparentIcon />
							</IconButton>
							<IconButton onClick={() => onDeleteAttribute(entry)}>
								<DeleteIcon />
							</IconButton>
						</SmallTableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
);
