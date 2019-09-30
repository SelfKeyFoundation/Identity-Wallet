import React from 'react';
import moment from 'moment';
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
	FilePdfIcon,
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	FileAudioIcon
} from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	attr: {
		margin: '0.5em',
		display: 'block',
		'& .label': {
			display: 'inline-block',
			minWidth: '12em'
		},
		'& h5': {
			display: 'inline-block'
		},
		'& svg': {
			marginRight: '0.5em',
			verticalAlign: 'middle'
		}
	},
	documentColumn: {
		display: 'flex',
		alignItems: 'center',
		'& .file-icon': {
			marginRight: '15px'
		}
	}
});

const renderLastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

// const renderAttributeLabel = ({ name }) => name || 'No label provided';

// const renderAttributeValue = ({ data }) => data.value || '';

const renderAttributeTitle = attr => attr.type.content.title || 'No title provided';

const renderDocumentName = ({ entry, classes }) => {
	let fileType = null;
	let fileName = null;
	let FileIcon = FileDefaultIcon;

	if (entry.documents.length === 1) {
		fileName = entry.documents[0].name;
		fileType = entry.documents[0].mimeType;
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
				<Typography
					variant="subtitle1"
					color="secondary"
					className={classes.ellipsis}
					title={fileName}
				>
					{fileName}
				</Typography>
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
	const { classes, documents = [], onEditDocument, onDeleteDocument, onAddDocument } = props;
	return (
		<Card>
			<CardHeader title="Documents" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					spacing={24}
				>
					<Grid container item spacing={0} justify="center">
						<Grid item xs={12}>
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
												<IconButton
													id="editButton"
													onClick={() => onEditDocument(entry)}
												>
													<EditTransparentIcon />
												</IconButton>
												<IconButton
													id="deleteButton"
													onClick={() => onDeleteDocument(entry)}
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Grid>
					</Grid>
					<Grid container item spacing={0} justify="center">
						<Grid item>
							<Button
								id="addDocuments"
								variant="outlined"
								size="large"
								color="secondary"
								onClick={onAddDocument}
								className={classes.button}
							>
								Add Documents
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
});

export { CorporateDocuments };
export default CorporateDocuments;
