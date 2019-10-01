import React, { Component } from 'react';
import moment from 'moment';
import {
	withStyles,
	Typography,
	Grid,
	Paper,
	Divider,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	TablePagination
} from '@material-ui/core';
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
		marginTop: '40px',
		'& .messagesTableBox': {
			padding: '0 20px'
		}
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

class CertifiersDashboardMessages extends Component {
	renderDate(date) {
		if (!date) return '-';
		return moment(date).format('DD MMM YYYY');
	}

	render() {
		const { classes, documents } = this.props;
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={40}
				className={classes.messagesTable}
			>
				<Grid item xs={12} className="messagesTableBox">
					<Paper className={classes.newRequests}>
						<Grid container>
							<Grid container justify="space-between">
								<Typography variant="h2">Messages</Typography>
								<RefreshIcon className={classes.icon} />
							</Grid>
							<Grid item xs={12}>
								<Divider className={classes.divider} />
							</Grid>
							<Grid item xs={12}>
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
											documents.map(entry => {
												return <RequestsTableRow data={entry} />;
											})}
									</TableBody>
								</Table>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25]}
									component="div"
									count={documents.length}
									rowsPerPage={5}
									page={1}
									backIconButtonProps={{
										'aria-label': 'previous page'
									}}
									nextIconButtonProps={{
										'aria-label': 'next page'
									}}
								/>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		);
	}
}

export const CertifiersDashboardMessagesTab = withStyles(styles)(CertifiersDashboardMessages);

export default CertifiersDashboardMessagesTab;
