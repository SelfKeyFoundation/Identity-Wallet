import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { Typography, Grid, Button, IconButton } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LargeTableHeadRow, DeleteIcon } from 'selfkey-ui';
// import { PropTypes } from 'prop-types';

const useStyles = makeStyles({
	icon: {
		width: 50,
		height: 50,
		background: 'transparent'
	},
	actions: {
		marginTop: 20
	},
	gridItem: {
		width: '100%'
	},
	table: {
		width: '100%'
	},
	tableBodyRow: {},
	tableRow: {}
});

const getPeerIcon = session => {
	if (session.icon) {
		return session.icon;
	}
	return session.session.peerMeta.icons ? session.session.peerMeta.icons[0] : null;
};

export const WcSessionsComponent = ({ sessions, onCancel, onDeleteSession }) => {
	const classes = useStyles();
	const hasSessions = !!(sessions && sessions.length);
	return (
		<Popup closeAction={onCancel} text="WalletConnect Active Sessions">
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item className={classes.gridItem}>
					{hasSessions && (
						<Table className={classes.table}>
							<TableHead>
								<LargeTableHeadRow>
									<TableCell />
									<TableCell>
										<Typography variant="overline">Name</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">URL</Typography>
									</TableCell>
									<TableCell />
								</LargeTableHeadRow>
							</TableHead>
							<TableBody className={classes.tableBodyRow}>
								{sessions.map(session => (
									<TableRow key={session.id} className={classes.tableRow}>
										<TableCell>
											<img
												src={getPeerIcon(session)}
												className={classes.icon}
											/>
										</TableCell>
										<TableCell>
											<Typography variant="h6">{session.name}</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="h6">{session.url}</Typography>
										</TableCell>
										<TableCell>
											<IconButton onClick={() => onDeleteSession(session)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
					{!hasSessions && (
						<Typography
							variant="h2"
							style={{ margin: '1em auto', textAlign: 'center' }}
						>
							No active WalletConnect sessions found.
						</Typography>
					)}
				</Grid>
				<Grid item>
					<Button variant="outlined" size="large" onClick={onCancel}>
						Close
					</Button>
				</Grid>
			</Grid>
		</Popup>
	);
};

WcSessionsComponent.propTypes = {};
WcSessionsComponent.defaultProps = {};

export default WcSessionsComponent;
