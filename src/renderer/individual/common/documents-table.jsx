import React from 'react';
import moment from 'moment';
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	TableHead,
	Typography,
	withStyles
} from '@material-ui/core';
import {
	FilePdfIcon,
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	FileAudioIcon,
	FileLinkWithModal,
	EditTransparentIcon,
	DeleteIcon,
	SmallTableHeadRow
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
	({
		classes,
		documents = [],
		onEditDocument,
		onDeleteDocument,
		onEditAttribute,
		onDeleteAttribute
	}) => (
		<Table>
			<TableHead>
				<SmallTableHeadRow>
					<TableCell>
						<Typography variant="overline">Type</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Label</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Expiry Date</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Last Edited</Typography>
					</TableCell>
					<TableCell align="right">
						<Typography variant="overline">Actions</Typography>
					</TableCell>
				</SmallTableHeadRow>
			</TableHead>
			<TableBody>
				{documents.map(entry => (
					<TableRow key={entry.id}>
						<TableCell>
							<Typography variant="h6">{entry.type.content.title}</Typography>
						</TableCell>
						<TableCell className={classes.labelCell}>
							<DocumentName entry={entry} classes={classes} />
						</TableCell>
						<TableCell>
							<DocumentExpiryDate doc={entry} />
						</TableCell>
						<TableCell>
							<Typography variant="h6">{lastUpdateDate(entry)}</Typography>
						</TableCell>
						<TableCell align="right">
							<IconButton onClick={() => onEditAttribute(entry)}>
								<EditTransparentIcon />
							</IconButton>
							<IconButton onClick={() => onDeleteAttribute(entry)}>
								<DeleteIcon />
							</IconButton>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
);
