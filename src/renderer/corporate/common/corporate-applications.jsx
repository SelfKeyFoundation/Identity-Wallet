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
	TableCell
} from '@material-ui/core';
import { HourGlassSmallIcon, CheckMaIcon, DeniedIcon, SmallTableHeadRow } from 'selfkey-ui';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
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
	if (status == 'rejected') {
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
	const { classes, applications = [1, 2, 3] } = props;
	return (
		<Grid container direction="column" spacing={32}>
			<Grid item>
				<Card>
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
										applications.map(application => (
											<TableRow id={application.id} key={application.id}>
												<TableCell>
													<Typography variant="h6">
														Incorporation
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">
														Flag Theory
													</Typography>
												</TableCell>
												<TableCell>{renderStatus('denied')}</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
});

export { CorporateApplicationsSummary };
export default CorporateApplicationsSummary;
