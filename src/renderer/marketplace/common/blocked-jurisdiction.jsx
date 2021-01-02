import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Alert } from '../../common';

const styles = theme => ({
	container: {
		marginBottom: '5px',
		width: '100%'
	},
	status: {
		alignItems: 'center',
		backgroundColor: '#262F39',
		'& p': {
			display: 'inline-block'
		},
		'& svg': {
			verticalAlign: 'middle'
		}
	},
	actionButton: {
		textAlign: 'right'
	},
	alertWrap: {
		alignItems: 'center',
		display: 'flex'
	}
});

export const BlockedJurisdiction = withStyles(styles)(
	({
		classes,
		text = 'Apologies, the jurisdiction you selected is not currently eligible.',
		onActionClick,
		actionButtonText = 'Information'
	}) => (
		<div className={classes.container}>
			<Alert type="warning" xtraClass={classes.alertWrap}>
				<Grid item xs={onActionClick ? 9 : 12}>
					<Typography variant="body2" color="secondary">
						{text}
					</Typography>
				</Grid>
				{onActionClick ? (
					<Grid item xs={3} className={classes.actionButton}>
						<Button variant="contained" onClick={onActionClick}>
							{actionButtonText}
						</Button>
					</Grid>
				) : null}
			</Alert>
		</div>
	)
);

export default BlockedJurisdiction;
