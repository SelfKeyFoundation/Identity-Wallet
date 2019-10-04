import React from 'react';
import {
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableBody,
	withStyles
} from '@material-ui/core';
import {
	HourGlassSmallIcon,
	CheckMaIcon,
	DeniedIcon,
	SmallTableRow,
	SmallTableCell,
	SmallTableHeadRow
} from 'selfkey-ui';

const styles = theme => ({
	container: {
		width: '100%'
	},
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	cardContent: {
		alignItems: 'flex-start',
		display: 'flex',
		flexDirection: 'column',
		maxHeight: '180px',
		overflow: 'scroll'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	}
});

const renderStatus = status => {
	if (status === 'approved') {
		return (
			<React.Fragment>
				<CheckMaIcon /> Approved
			</React.Fragment>
		);
	}
	if (status === 'rejected') {
		return (
			<React.Fragment>
				<DeniedIcon /> Denied
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<HourGlassSmallIcon /> Pending
		</React.Fragment>
	);
};

const CorporateApplicationsSummary = withStyles(styles)(props => {
	const { classes, applications = [] } = props;
	return (
		<Card className={classes.container}>
			<CardHeader title={'Applications Status'} className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent style={{ height: 'initial' }}>
				<div className={classes.cardContent}>
					<Table>
						<TableHead>
							<SmallTableHeadRow>
								<SmallTableCell>
									<Typography variant="overline">Service</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Provider</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Status</Typography>
								</SmallTableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{applications &&
								applications.map(a => (
									<SmallTableRow id={a.id} key={a.id}>
										<SmallTableCell>
											<Typography variant="subtitle1">{a.title}</Typography>
										</SmallTableCell>
										<SmallTableCell>
											<Typography variant="subtitle1">{a.rpName}</Typography>
										</SmallTableCell>
										<SmallTableCell>
											<Typography variant="subtitle1">
												{renderStatus(a.currentStatusName)}
											</Typography>
										</SmallTableCell>
									</SmallTableRow>
								))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateApplicationsSummary };
export default CorporateApplicationsSummary;
