import * as React from 'react';
import { Grid, withStyles, Typography, Divider } from '@material-ui/core';
import { WarningShieldIcon, Copy } from 'selfkey-ui';
import Popup from '../../common/popup';

const styles = theme => ({});

export const TransactionErrorBox = withStyles(styles)(
	({ children, publicKey, closeAction, open = true }) => (
		<Popup open={open} closeAction={closeAction} text="Transaction Confirmation">
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<WarningShieldIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="flex-start">
						<Typography variant="h2">Transaction Failed </Typography>
						{children}
						<Divider />
						<Typography variant="body1">Your Address:</Typography>
						<Typography variant="subtitle2">
							{publicKey} <Copy text={publicKey} />
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	)
);

export default TransactionErrorBox;
