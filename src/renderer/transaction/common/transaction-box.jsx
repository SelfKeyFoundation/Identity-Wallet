import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { EthereumIcon, SelfkeyIcon, CustomIcon } from 'selfkey-ui';
import Popup from '../../common/popup';

const styles = theme => ({
	icon: {
		width: '34px !important',
		height: '34px !important',
		borderRadius: '8px',
		backgroundColor: '#00C0D9'
	},
	custom: {
		width: '34px !important',
		height: '34px !important',
		borderRadius: '8px'
	},
	popupPadding: {
		padding: '60px 85px'
	}
});

const IconTitle = withStyles(styles)(({ classes, cryptoCurrency, title }) => {
	let icon = null;

	switch (cryptoCurrency) {
		case 'KEY':
			icon = <SelfkeyIcon classes={{ root: classes.icon }} />;
			break;
		case 'KI':
			icon = <SelfkeyIcon classes={{ root: classes.icon }} />;
			break;
		case 'ETH':
			icon = <EthereumIcon classes={{ root: classes.icon }} />;
			break;
		default:
			icon = <CustomIcon classes={{ root: classes.custom }} />;
	}

	return (
		<Grid container direction="row" justify="flex-start" alignItems="center" spacing={16}>
			<Grid item>{icon}</Grid>
			<Grid item>
				<Typography variant="body1">{title}</Typography>
			</Grid>
		</Grid>
	);
});

export const TransactionBox = withStyles(styles)(
	({ classes, children, cryptoCurrency, closeAction, title, open = true }) => (
		<Popup
			open={open}
			closeAction={closeAction}
			text={<IconTitle cryptoCurrency={cryptoCurrency} title={title} classes={classes} />}
			xtraClass={classes.popupPadding}
		>
			{children}
		</Popup>
	)
);

export default TransactionBox;
