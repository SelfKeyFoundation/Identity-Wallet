import React from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import { Copy, TransferIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, IconButton, Typography, Divider } from '@material-ui/core';

const styles = theme => ({
	paper: {
		padding: 16,
		maxWidth: 415
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
		publicKey
	} = props;
	return (
		<Paper className={classes.paper}>
			<Grid container spacing={8} xs={12}>
				<Grid item xs={12} container spacing={16}>
					<Grid item>
						<CryptoCurrencyIconComponent />
					</Grid>
					<Grid item xs={8}>
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
				<Grid item xs={12} container>
					<Grid item>
						<Typography variant="subtitle2" color="secondary">
							{publicKey}
						</Typography>
					</Grid>
					<Grid item>
						<Copy text={publicKey} />
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
};

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TokenBox));
