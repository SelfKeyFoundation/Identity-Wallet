import React from 'react';
import moment from 'moment';
import {
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
	Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
	SmallTableHeadRow,
	EditTransparentIcon,
	DeleteIcon,
	FilePdfIcon,
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	FileAudioIcon,
	FileLinkWithModal
} from 'selfkey-ui';

import { canEdit, canDelete } from './common-helpers.jsx';

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
	}
});

const renderLastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

// const renderAttributeLabel = ({ name }) => name || 'No label provided';

// const renderAttributeValue = ({ data }) => data.value || '';

const renderAttributeTitle = attr => attr.type.content.title || 'No title provided';

const renderDocumentName = ({ entry, classes }) => {
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

const DocumentExpiryDate = ({ doc }) => {
	let date;
	if (!doc || !doc.data || !doc.data.value || !doc.data.value.expires) {
		date = '-';
	} else {
		date = moment(doc.data.value.expires).format('DD MMM YYYY');
	}
	return <span>{date}</span>;
};

const CorporateDocuments = withStyles(styles)(props => {
	const {
		classes,
		documents = [],
		attributeOptions = {},
		onEditDocument,
		onDeleteDocument,
		onAddDocument
	} = props;
	return (
		<Card className={classes.card}>
			<CardHeader title="Documents" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent className={classes.cardContent}>
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
									<Typography variant="h6">
										{renderAttributeTitle(entry)}
									</Typography>
								</TableCell>
								<TableCell className={classes.labelCell}>
									{renderDocumentName({ entry, classes })}
								</TableCell>
								<TableCell>
									<DocumentExpiryDate doc={entry} />
								</TableCell>
								<TableCell>
									<Typography variant="h6">
										{renderLastUpdateDate(entry)}
									</Typography>
								</TableCell>
								<TableCell align="right">
									{canEdit(entry.type, attributeOptions) && (
										<IconButton
											id="editButton"
											onClick={() => onEditDocument(entry)}
										>
											<EditTransparentIcon />
										</IconButton>
									)}
									{canDelete(entry.type, attributeOptions) && (
										<IconButton
											id="deleteButton"
											onClick={() => onDeleteDocument(entry)}
										>
											<DeleteIcon />
										</IconButton>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className={classes.button}>
					<Button
						id="addDocuments"
						variant="outlined"
						size="large"
						color="secondary"
						onClick={onAddDocument}
					>
						Add Documents
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateDocuments };
export default CorporateDocuments;
