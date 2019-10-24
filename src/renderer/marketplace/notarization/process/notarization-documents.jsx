import React, { Component } from 'react';
import moment from 'moment';
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
	Typography,
	Button,
	withStyles,
	Checkbox
} from '@material-ui/core';
import {
	FilePdfIcon,
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	SmallTableHeadRow,
	FileAudioIcon
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
	button: {
		marginBottom: '16px',
		marginTop: '36px'
	},
	ellipsis: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		maxWidth: '222px'
	},
	checkbox: {
		padding: '0 10px 0 20px',
		width: '30px'
	},
	type: {
		padding: '0'
	},
	tableContainer: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%'
	},
	container: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	wrap: {
		display: 'flex',
		flexDirection: 'column',
		margin: 0,
		width: '100%'
	}
});

class NotarizationDocumentsComponent extends Component {
	// componentDidMount() {
	// 	this.props.onRef(this);
	// }
	// componentWillUnmount() {
	// 	this.props.onRef(undefined);
	// }
	renderLastUpdateDate({ updatedAt }) {
		return moment(updatedAt).format('DD MMM YYYY, hh:mm a');
	}
	renderDocumentName({ entry, classes }) {
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
	}

	renderExpiryDate(doc) {
		if (!doc || !doc.data || !doc.data.value || !doc.data.value.expires) return '-';
		return moment(doc.data.value.expires).format('DD MMM YYYY');
	}

	render() {
		const { classes, documents } = this.props;

		return (
			<div id="viewOverview" className={classes.wrap}>
				<div className={classes.container}>
					<div className={classes.tableContainer}>
						<Table>
							<TableHead>
								<SmallTableHeadRow>
									<TableCell className={classes.checkbox}>&nbsp;</TableCell>
									<TableCell className={classes.type}>
										<Typography variant="overline">Type</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Label</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Expiry Date</Typography>
									</TableCell>
								</SmallTableHeadRow>
							</TableHead>
							<TableBody>
								{documents &&
									documents.map(entry => {
										return (
											<TableRow key={entry.id}>
												<TableCell className={classes.checkbox}>
													<Checkbox />
												</TableCell>
												<TableCell className={classes.type}>
													<Typography variant="h6">
														{entry.type.content.title}
													</Typography>
												</TableCell>
												<TableCell className={classes.labelCell}>
													{this.renderDocumentName({
														entry,
														classes
													})}
												</TableCell>
												<TableCell>
													{' '}
													{this.renderExpiryDate(entry)}{' '}
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</div>
					<Button
						id="addDocuments"
						variant="outlined"
						size="large"
						color="secondary"
						onClick={this.props.onAddDocument}
						className={classes.button}
					>
						Add Documents
					</Button>
				</div>
			</div>
		);
	}
}

export const NotarizationDocuments = withStyles(styles)(NotarizationDocumentsComponent);

export default NotarizationDocuments;
