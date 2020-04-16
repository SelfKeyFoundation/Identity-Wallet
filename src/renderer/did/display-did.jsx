import React from 'react';
import { DIDIcon } from 'selfkey-ui';
import { Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	info: {
		padding: '25px 30px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	didButtons: {
		marginTop: '20px'
	},
	transaction: {
		alignItems: 'center',
		display: 'flex'
	},
	extraSpace: {
		marginRight: '4px'
	}
});

export const DisplayDid = withStyles(styles)(({ classes, did }) => (
	<Card>
		<CardHeader title="Decentralised ID" className={classes.regularText} />
		<hr className={classes.hr} />
		<CardContent>
			<Grid container spacing={16} direction="row" justify="flex-start" alignItems="center">
				<Grid item>
					<DIDIcon />
				</Grid>
				<Grid item>
					<Typography variant="body1">did:selfkey:{did}</Typography>
				</Grid>
			</Grid>
		</CardContent>
	</Card>
));

export default DisplayDid;
