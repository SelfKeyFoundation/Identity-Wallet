import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Erc20Icon } from 'selfkey-ui';
import Popup from '../../common/popup';

const styles = theme => ({
	custom: {
		borderRadius: '8px',
		height: '44px !important',
		width: '44px !important'
	},
	popupPadding: {
		padding: theme.spacing(7, 10)
	}
});

const IconTitle = withStyles(styles)(({ classes, title }) => {
	return (
		<Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
			<Grid item>
				<Erc20Icon classes={{ root: classes.custom }} />
			</Grid>
			<Grid item>
				<Typography variant="body1">{title}</Typography>
			</Grid>
		</Grid>
	);
});

export const TransactionBox = withStyles(styles)(
	({ classes, children, closeAction, title, open = true }) => (
		<Popup
			open={open}
			closeAction={closeAction}
			text={<IconTitle title={title} classes={classes} />}
			xtraClass={classes.popupPadding}
		>
			{children}
		</Popup>
	)
);

export default TransactionBox;
