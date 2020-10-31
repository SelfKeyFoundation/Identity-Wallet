import * as React from 'react';
import { Grid, Typography, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WarningShieldIcon, Copy } from 'selfkey-ui';
import Popup from '../../common/popup';

const styles = theme => ({
	divider: {
		margin: theme.spacing(4, 0, 3)
	}
});

export const TransactionErrorBox = withStyles(styles)(
	({ classes, children, address, closeAction, open = true, subtitle, token = 'KEY' }) => (
		<Popup open={open} closeAction={closeAction} text="Transaction Confirmation">
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<WarningShieldIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="flex-start">
						{subtitle && (
							<Typography variant="h1" gutterBottom>
								{subtitle}
							</Typography>
						)}
						{children}
						{address && (
							<>
								<Divider className={classes.divider} />
								<Typography variant="body2">
									Your Address to receive {token}:
								</Typography>
								<Grid container alignItems="center">
									<Typography variant="subtitle1" color="secondary">
										{address}
									</Typography>
									<Copy text={address} />
								</Grid>
							</>
						)}
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	)
);

export default TransactionErrorBox;
