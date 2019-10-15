import React, { Component } from 'react';
import moment from 'moment';
import {
	withStyles,
	Typography,
	Paper,
	Divider,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow
} from '@material-ui/core';
import { SmallTableHeadRow, ViewIcon, RefreshIcon } from 'selfkey-ui';

const styles = theme => ({
	certifiersDashboard: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	papers: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: '40px 0 30px'
	},
	newRequests: {
		backgroundColor: '#262F39',
		boxShadow: 'none',
		padding: '25px 15px',
		'& h2': {
			fontSize: '20px'
		}
	},
	divider: {
		margin: '20px 0',
		width: '100%'
	},
	icon: {
		cursor: 'pointer'
	},
	capitalized: {
		textTransform: 'capitalize'
	},
	flex: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%'
	}
});

const paperStyle = theme => ({
	paper: {
		backgroundColor: '#262F39',
		boxShadow: 'none',
		padding: 30,
		maxWidth: 350,
		minHeight: '198px',
		width: '31%',
		'& h1': {
			fontWeight: 600,
			marginBottom: 10,
			marginTop: 20
		}
	},
	tokenBoxHeader: {
		display: 'flex',
		justifyContent: 'space-evenly',
		margin: 0,
		width: '100%'
	},
	flexGrow: {
		flexGrow: 1
	}
});

const emptyTableStyle = theme => ({
	tableRow: {
		backgroundColor: 'transparent',
		'& .tableCell': {
			textAlign: 'center'
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
			<TableCell className={classes.type}>
				<Typography variant="subtitle1">{data.user.name}</Typography>
				<Typography variant="subtitle2" color="secondary">
					{data.user.did}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle1" className={classes.capitalized}>
					{data.type}
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle1">{data.noOfDocs}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="subtitle1" className={classes.capitalized}>
					{data.status}
				</Typography>
			</TableCell>
			<TableCell>
				<ViewIcon className={classes.icon} />
			</TableCell>
		</TableRow>
	);
});

export const PaperItem = withStyles(paperStyle)(
	({ classes, title, value, info, totalRevenueInKey, extraInfo }) => {
		return (
			<Paper className={classes.paper}>
				<div>
					<div className={classes.tokenBoxHeader}>
						<div className={classes.flexGrow}>
							<Typography variant="body1" color="secondary">
								{title}
							</Typography>
						</div>
					</div>
					<div>
						<Typography variant="h1" color="primary">
							{title === 'Total Revenue' ? '$ ' : ''}
							{value}
						</Typography>
					</div>
					<div>
						{title === 'Total Revenue' ? (
							`${totalRevenueInKey} KEY`
						) : value === 0 ? (
							<Typography variant="body2">{info}</Typography>
						) : (
							extraInfo
						)}
					</div>
				</div>
			</Paper>
		);
	}
);

export const EmptyTableStatus = withStyles(emptyTableStyle)(({ classes }) => {
	return (
		<TableRow className={classes.tableRow}>
			<TableCell colSpan="6" className="tableCell">
				<Typography variant="body1" color="secondary">
					You'll see here all your recent requests for notarization, and you can start
					working on them imediatly.
				</Typography>
			</TableCell>
		</TableRow>
	);
});

class CertifiersDashboardOverview extends Component {
	renderDate(date) {
		if (!date) return '-';
		return moment(date).format('DD MMM YYYY');
	}

	render() {
		const {
			classes,
			documents,
			requestedProcesses,
			completedRequests,
			total,
			totalRevenueInKey
		} = this.props;
		return (
			<div className={classes.certifiersDashboard}>
				<div className={classes.papers}>
					<PaperItem
						title="In Progress Requests"
						value={requestedProcesses}
						info="Number of in progress certification processes"
					/>
					<PaperItem
						title="Total Completed Requests"
						value={completedRequests}
						info="Total number of completed requests since you joined"
						extraInfo="From December 2007"
					/>
					<PaperItem
						title="Total Revenue"
						value={total}
						info="0 KEY"
						totalRevenueInKey={totalRevenueInKey}
					/>
				</div>
				<Paper className={classes.newRequests}>
					<div>
						<div className={classes.flex}>
							<Typography variant="h2">New Requests</Typography>
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
										<Typography variant="overline">User</Typography>
									</TableCell>
									<TableCell className={classes.type}>
										<Typography variant="overline">Type</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">No. of documents</Typography>
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
								{documents ? (
									documents &&
									documents.map(entry => {
										return <RequestsTableRow data={entry} />;
									})
								) : (
									<EmptyTableStatus />
								)}
							</TableBody>
						</Table>
					</div>
				</Paper>
			</div>
		);
	}
}

export const CertifiersDashboardOverviewTab = withStyles(styles)(CertifiersDashboardOverview);

export default CertifiersDashboardOverviewTab;
