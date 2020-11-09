import React, { PureComponent } from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
	FileImageIcon,
	FileDefaultIcon,
	FileMultipleIcon,
	FileAudioIcon,
	FilePdfIcon
} from 'selfkey-ui';
import RequestDocumentsListPage from './request-documents-list-page';

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
			marginRight: theme.spacing(2)
		}
	},
	button: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(4)
	},
	ellipsis: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		maxWidth: '222px'
	},
	checkbox: {
		padding: theme.spacing(0, 1, 0, 2),
		width: '30px'
	},
	type: {
		padding: theme.spacing(0)
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
		margin: theme.spacing(0),
		width: '100%'
	}
});

class RequestDocumentsListContainer extends PureComponent {
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
			<RequestDocumentsListPage
				documents={documents}
				renderDocumentName={this.renderDocumentName}
				renderExpiryDate={this.renderExpiryDate}
				{...this.props}
			/>
		);
	}
}

export const RequestDocumentsList = withStyles(styles)(RequestDocumentsListContainer);

export default RequestDocumentsList;
