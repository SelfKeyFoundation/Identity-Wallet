import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { ExchangeSmallIcon } from 'selfkey-ui';
import { Popup } from '../../common';

const styles = theme => ({
	icon: {
		margin: '0 45px 0 0'
	},
	content: {
		width: '100%'
	},
	description: {
		fontFamily: 'Lato, arial',
		color: '#FFF',
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
		},
		'& p.email': {
			color: '#00C0D9'
		},
		'& strong': {
			fontWeight: '700'
		},
		'& .title': {
			marginBottom: '15px'
		},
		'& .divider': {
			margin: '40px 0 25px 0'
		}
	},
	instructions: {
		padding: '0 0 45px'
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: '20px'
		}
	}
});

const SwapComplete = withStyles(styles)(({ classes, title, body, onBackClick, onSelfKeyClick }) => (
	<Popup closeAction={onBackClick} open text={'Swap'}>
		<Grid
			container
			justify="flex-start"
			alignItems="flex-start"
			className={classes.content}
			wrap="nowrap"
		>
			<div className={classes.icon}>
				<ExchangeSmallIcon width="24px" height="24px" />
			</div>
			<div>
				<Typography variant="h1" gutterBottom>
					Swap operation completed
				</Typography>
				<div className={classes.footer}>
					<Button variant="outlined" size="large" onClick={onBackClick}>
						Close
					</Button>
				</div>
			</div>
		</Grid>
	</Popup>
));

export { SwapComplete };
export default SwapComplete;
