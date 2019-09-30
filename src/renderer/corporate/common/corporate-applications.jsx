import React from 'react';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	withStyles
} from '@material-ui/core';
import { HourGlassSmallIcon, CheckMaIcon, DeniedIcon, SmallTableHeadRow } from 'selfkey-ui';

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
	card: {},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
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
			<CardHeader title={'Application Status'} className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="flex-start"
					spacing={24}
				>
					<Table>
						<TableHead>
							<SmallTableHeadRow>
								<TableCell>
									<Typography variant="overline">Service</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="overline">Provider</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="overline">Status</Typography>
								</TableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{applications &&
								applications.map(a => (
									<TableRow id={a.id} key={a.id}>
										<TableCell>
											<Typography variant="h6">{a.title}</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">{a.rpName}</Typography>
										</TableCell>
										<TableCell>{renderStatus(a.currentStatusName)}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</Grid>
			</CardContent>
		</Card>
	);
});

export { CorporateApplicationsSummary };
export default CorporateApplicationsSummary;
