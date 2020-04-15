import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { Erc20Icon } from 'selfkey-ui';
import Popup from '../../common/popup';

const styles = theme => ({
	custom: {
		width: '44px !important',
		height: '44px !important',
		borderRadius: '8px'
	},
	popupPadding: {
		padding: '60px 85px'
	},
	header: {
		padding: '11px 30px'
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
			headerClass={classes.header}
		>
			{children}
		</Popup>
	)
);

export default TransactionBox;
