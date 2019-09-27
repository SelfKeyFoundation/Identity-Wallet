import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Alert } from '../common';

const UpdateNotification = ({ info, onAutoUpdate }) => (
	<React.Fragment>
		{info && info.version && (
			<Grid item style={{ width: '100%' }}>
				<Alert type="warning">
					<Grid container direction="row" justify="space-between">
						<Grid item>
							A new version of the wallet is available! For security reasons please
							update to the latest version.
						</Grid>
						<Grid item>
							<Button variant="contained" size="small" onClick={onAutoUpdate}>
								DOWNLOAD & INSTALL
							</Button>
						</Grid>
					</Grid>
				</Alert>
			</Grid>
		)}
	</React.Fragment>
);

export { UpdateNotification };
export default UpdateNotification;
