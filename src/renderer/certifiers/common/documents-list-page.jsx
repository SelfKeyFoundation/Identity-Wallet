import React from 'react';
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
	Typography,
	withStyles
} from '@material-ui/core';
import { SmallTableHeadRow, ViewIcon, RefreshIcon } from 'selfkey-ui';

const styles = theme => ({
	wrap: {
		display: 'flex',
		flexDirection: 'column',
		margin: 0,
		width: '100%'
	},
	container: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	tableContainer: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%'
	},
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

export const DocumentsListPage = withStyles(styles)(props => {
	const { classes, documents, renderDocumentName, renderExpiryDate } = props;

	return (
		<div id="viewOverview" className={classes.wrap}>
			<div className={classes.container}>
				<div className={classes.tableContainer}>
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
									<Typography variant="overline">Actions</Typography>
								</TableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{documents &&
								documents.map(entry => {
									return (
										<TableRow key={entry.id}>
											<TableCell className={classes.labelCell}>
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
											<TableCell>
												<ViewIcon />
												<RefreshIcon />
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
});

export default DocumentsListPage;
