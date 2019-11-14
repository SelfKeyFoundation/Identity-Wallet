import React, { PureComponent } from 'react';
import moment from 'moment';
import { Typography, withStyles } from '@material-ui/core';
import {
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	FileAudioIcon,
	FilePdfIcon
} from 'selfkey-ui';
import DocumentsListPage from './documents-list-page';

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

class DocumentsListContainer extends PureComponent {
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
		const { documents } = this.props;

		return (
			<DocumentsListPage
				documents={documents}
				renderDocumentName={this.renderDocumentName}
				renderExpiryDate={this.renderExpiryDate}
				onAddDocument={this.onAddDocument}
				{...this.props}
			/>
		);
	}
}

export const DocumentsList = withStyles(styles)(DocumentsListContainer);

export default DocumentsList;
