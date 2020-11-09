import React from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import { Copy, TransferIcon } from 'selfkey-ui';
import { Grid, Paper, IconButton, Typography, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { AddressShortener } from '../common/address-shortener';

const styles = theme => ({
	paper: {
		backgroundColor: '#262F39',
		boxShadow: 'none',
		padding: theme.spacing(2),
		maxWidth: 350
	},
	tokenBoxHeader: {
		display: 'flex',
		justifyContent: 'space-evenly',
		margin: theme.spacing(0),
		width: '100%'
	},
	flexGrow: {
		flexGrow: 1
	},
	marginSpace: {
		marginTop: theme.spacing(1)
	},
	publicKey: {
		maxWidth: '250px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	}
});

const TokenBox = props => {
	const {
		classes,
		cryptoCurrencyName,
		cryptoCurrencyShort,
		CryptoCurrencyIconComponent,
		transferAction,
		children,
		address
	} = props;
	return (
		<Paper className={classes.paper}>
			<Grid container spacing={1}>
				<Grid container className={classes.tokenBoxHeader} spacing={2}>
					<Grid item>
						<CryptoCurrencyIconComponent />
					</Grid>
					<Grid item className={classes.flexGrow}>
						<Typography variant="h2">{cryptoCurrencyName}</Typography>
						<Typography variant="h3">{cryptoCurrencyShort}</Typography>
					</Grid>
					<Grid item>
						<IconButton onClick={transferAction}>
							<TransferIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					{children}
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid xs={12} container justify="space-between" className={classes.marginSpace}>
					<Grid item>
						<AddressShortener address={address} extraClasses={classes.publicKey} />
					</Grid>
					<Grid item>
						<Copy text={address} />
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
};

const mapStateToProps = state => {
	return {
		address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TokenBox));
