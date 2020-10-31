import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { ExchangeSmallIcon } from 'selfkey-ui';
import { Popup } from '../../common';

const styles = theme => ({
	icon: {
		margin: theme.spacing(0, 6, 0, 0)
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
			marginBottom: theme.spacing(2)
		},
		'& p.email': {
			color: '#00C0D9'
		},
		'& strong': {
			fontWeight: '700'
		},
		'& .title': {
			marginBottom: theme.spacing(2)
		},
		'& .divider': {
			margin: theme.spacing(5, 0, 3)
		}
	},
	instructions: {
		padding: theme.spacing(0, 0, 6)
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: theme.spacing(2)
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
