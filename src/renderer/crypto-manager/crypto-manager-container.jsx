import React, { Component } from 'react';
import { Grid, Button, Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import CryptoPriceTableContainer from './crypto-price-table-container';
import { push } from 'connected-react-router';
import { MyCryptoLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
	},
	bottomSpace: {
		marginBottom: '15px'
	},
	bold: {
		fontWeight: 600
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},
	topSpace: {
		marginTop: '30px'
	}
});

class CryptoManagerContainerComponent extends Component {
	handleAddTokenClick = evt => {
		evt.preventDefault();
		this.props.dispatch(push('/main/add-token'));
	};
	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<div className={classes.backButtonContainer}>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={this.handleBackClick}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>

				<Grid item className={classes.topSpace}>
					<MyCryptoLargeIcon />
				</Grid>
				<Grid item>
					<Typography variant="h1">Manage My Crypto</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1" color="secondary">
						Manage your ERC20 tokens displayed in the SelfKey Identity Wallet dashboard.
					</Typography>
				</Grid>
				<Grid item className={classes.bottomSpace}>
					<Button variant="outlined" size="large" onClick={this.handleAddTokenClick}>
						Add token
					</Button>
				</Grid>
				<Grid item>
					<CryptoPriceTableContainer />
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export const CryptoMangerContainer = connect(mapStateToProps)(
	withStyles(styles)(CryptoManagerContainerComponent)
);

export default CryptoMangerContainer;
