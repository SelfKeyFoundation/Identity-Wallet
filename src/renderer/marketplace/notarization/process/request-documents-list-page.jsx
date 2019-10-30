import React from 'react';
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

export const RequestDocumentsListPage = withStyles(styles)(props => {
	const { classes, documents, renderDocumentName, renderExpiryDate, onAddDocument } = props;

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
					Add Documents
				</Button>
			</div>
		</div>
	);
});

export default RequestDocumentsListPage;
