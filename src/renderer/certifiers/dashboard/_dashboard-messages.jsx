import React, { PureComponent } from 'react';
import moment from 'moment';
import {
	Typography,
	Paper,
	Divider,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	TablePagination
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SmallTableHeadRow, ViewIcon, RefreshIcon, ReplyIcon } from 'selfkey-ui';

const styles = theme => ({
	newRequests: {
		backgroundColor: '#262F39',
		boxShadow: 'none',
		padding: '25px 15px',
		'& h2': {
			fontSize: '20px'
		}
	},
	divider: {
		margin: '20px 0'
	},
	icon: {
		cursor: 'pointer'
	},
	replyIcon: {
		marginLeft: '10px',
		marginTop: '-2px',
		position: 'absolute'
	},
	capitalized: {
		textTransform: 'capitalize'
	},
	message: {
		maxWidth: '400px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	},
	did: {
		maxWidth: '180px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	},
	messagesTable: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginTop: '40px'
	},
	flex: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	topSpace: {
		paddingTop: '10px'
	}
});

export const RequestsTableRow = withStyles(styles)(({ classes, data }) => {
	return (
		<TableRow key={data.id}>
			<TableCell>
				<Typography variant="subtitle1">
					{moment(data.date).format('DD MMM YYYY')}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle1">{data.user.name}</Typography>
				<Typography
					className={classes.did}
					variant="subtitle2"
					color="secondary"
					title={data.user.did}
				>
					{data.user.did}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle1" className={classes.message} title={data.message}>
					{data.message}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle1" className={classes.capitalized}>
					{data.status}
				</Typography>
			</TableCell>
			<TableCell>
				<ViewIcon className={classes.icon} />
				<ReplyIcon className={`${classes.icon} ${classes.replyIcon}`} />
			</TableCell>
		</TableRow>
	);
});

class CertifiersDashboardMessages extends PureComponent {
	renderDate(date) {
		if (!date) return '-';
		return moment(date).format('DD MMM YYYY');
	}

	render() {
		const { classes, documents } = this.props;
		return (
			<div className={classes.messagesTable}>
				<div>
					<Paper className={classes.newRequests}>
						<div>
							<div className={classes.flex}>
								<Typography variant="h2">Messages</Typography>
								<RefreshIcon className={classes.icon} />
							</div>
							<Divider className={classes.divider} />
							<Table>
								<TableHead>
									<SmallTableHeadRow>
										<TableCell>
											<Typography variant="overline">Date</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">From</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Message</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Status</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Actions</Typography>
										</TableCell>
									</SmallTableHeadRow>
								</TableHead>
								<TableBody>
									{documents &&
										documents.map((entry, indx) => {
											return <RequestsTableRow key={indx} data={entry} />;
										})}
								</TableBody>
							</Table>
							<TablePagination
								className={classes.topSpace}
								rowsPerPageOptions={[5, 10, 25]}
								component="div"
								count={documents && documents.length}
								rowsPerPage={5}
								page={1}
								backIconButtonProps={{
									'aria-label': 'previous page'
								}}
								nextIconButtonProps={{
									'aria-label': 'next page'
								}}
							/>
						</div>
					</Paper>
				</div>
			</div>
		);
	}
}

export const CertifiersDashboardMessagesTab = withStyles(styles)(CertifiersDashboardMessages);

export default CertifiersDashboardMessagesTab;
