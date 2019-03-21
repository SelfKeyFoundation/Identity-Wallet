import React, { Component } from 'react';
import { Grid, Button, Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import CryptoPriceTableContainer from './crypto-price-table-container';
import { push } from 'connected-react-router';
import { MyCryptoLargeIcon, PriceSummary } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { Popup } from '../common/popup';
import { walletTokensOperations } from 'common/wallet-tokens';

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
	state = {
		showAddedModal: false,
		tokenAdded: undefined,
		showRemovedModal: false
	};

	componentDidUpdate(prevProps) {
		let isTokenAdded = prevProps.existingTokens.length < this.props.existingTokens.length;
		if (isTokenAdded) {
			let tokenAdded = this.props.existingTokens[this.props.existingTokens.length - 1];
			this.setState({ showAddedModal: isTokenAdded, tokenAdded: tokenAdded });
		}
	}

	handleAddTokenClick = evt => {
		evt.preventDefault();
		this.props.dispatch(push('/main/add-token'));
	};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	handleRemoveTokenClick = (event, token) => {
		event && event.preventDefault();
		this.props.dispatch(
			walletTokensOperations.updateWalletTokenStateOperation(1 - +token.recordState, token.id)
		);
		this.setState({ showRemovedModal: true });
	};

	handleCloseTokenAddedModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showAddedModal: false, tokenAdded: undefined });
	};

	handleCloseTokenRemovedModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showRemovedModal: false });
	};

	renderTokenAddedModal() {
		const { classes, locale } = this.props;
		const { tokenAdded } = this.state;
		return (
			<Popup
				open={true}
				text={'New ERC-20 Token Added'}
				closeAction={this.handleCloseTokenAddedModal}
			>
				<Grid
					container
					className={classes.root}
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="overline">Name</Typography>
						<Typography variant="h6">{tokenAdded.name}</Typography>
					</Grid>
					<Grid item>
						<Typography variant="overline">Symbol</Typography>
						<Typography variant="h6">{tokenAdded.symbol}</Typography>
					</Grid>
					<Grid item>
						<Typography variant="overline">Balance</Typography>
						<PriceSummary
							locale={locale}
							style="decimal"
							currency={tokenAdded.symbol}
							value={tokenAdded.balance}
							className={classes.summary}
						/>
					</Grid>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									onClick={this.handleCloseTokenAddedModal}
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}

	renderTokenRemovedModal() {
		const { classes } = this.props;
		return (
			<Popup
				open={true}
				text={'Token Removed'}
				closeAction={this.handleCloseTokenRemovedModal}
			>
				<Grid
					container
					className={classes.root}
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="body2">
							Removing tokens from this list only disables them from the display, and{' '}
							does not impact their status on the Ethereum blockchain.
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									onClick={this.handleCloseTokenRemovedModal}
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}

	render() {
		const { classes } = this.props;
		const { showAddedModal, showRemovedModal } = this.state;
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
					<CryptoPriceTableContainer toggleAction={this.handleRemoveTokenClick} />
				</Grid>

				{showAddedModal && this.renderTokenAddedModal()}
				{showRemovedModal && this.renderTokenRemovedModal()}
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		existingTokens: getTokens(state)
	};
};

export const CryptoMangerContainer = connect(mapStateToProps)(
	withStyles(styles)(CryptoManagerContainerComponent)
);

export default CryptoMangerContainer;
