import React, { Component } from 'react';
import { Grid, Button, Typography, withStyles } from '@material-ui/core';
import { MyCryptoLargeIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import CryptoPriceTableContainer from './crypto-price-table-container';
import { push } from 'connected-react-router';

const styles = theme => ({
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
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
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<Button
					variant="outlined"
					color="secondary"
					size="small"
					onClick={this.handleBackClick}
					className={this.props.classes.back}
				>
					‹ Back
				</Button>

				<Grid item>
					<MyCryptoLargeIcon />
				</Grid>
				<Grid item>
					<Typography variant="h1">Manage My Crypto</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">
						Manage your ERC20 tokens displayed in the SelfKey Identity Wallet dashboard.
					</Typography>
				</Grid>
				<Grid item>
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
