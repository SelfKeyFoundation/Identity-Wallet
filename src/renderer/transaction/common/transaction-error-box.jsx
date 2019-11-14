import * as React from 'react';
import { Grid, withStyles, Typography, Divider } from '@material-ui/core';
import { WarningShieldIcon, Copy } from 'selfkey-ui';
import Popup from '../../common/popup';

const styles = theme => ({});

export const TransactionErrorBox = withStyles(styles)(
	({ children, address, closeAction, open = true, subtitle }) => (
		<Popup open={open} closeAction={closeAction} text="Transaction Notice">
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<WarningShieldIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="flex-start">
						<Typography variant="h2">{subtitle} </Typography>
						{children}
						{address && (
							<>
								<Divider />
								<Typography variant="body1" color="secondary">
									Your Address:
								</Typography>
								<Grid container alignItems="center">
									<Typography variant="body1">{address}</Typography>
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
