import React from 'react';
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
	Typography,
	Button,
	Checkbox
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SmallTableHeadRow } from 'selfkey-ui';

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

export const RequestDocumentsListPage = withStyles(styles)(props => {
	const {
		classes,
		documents,
		renderDocumentName,
		renderExpiryDate,
		onAddDocument,
		onSelectDocument,
		selectedDocuments
	} = props;

	return (
		<div className={classes.wrap}>
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
												<Checkbox
													value={entry.id}
													onChange={onSelectDocument}
													checked={selectedDocuments.includes(entry.id)}
												/>
											</TableCell>
											<TableCell className={classes.type}>
												<Typography variant="h6">
													{entry.type.content.title}
												</Typography>
											</TableCell>
											<TableCell className={classes.labelCell}>
												{renderDocumentName({
													entry,
													classes
												})}
											</TableCell>
											<TableCell> {renderExpiryDate(entry)} </TableCell>
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
					onClick={onAddDocument}
					className={classes.button}
				>
					Add Other Documents
				</Button>
			</div>
		</div>
	);
});

export default RequestDocumentsListPage;
