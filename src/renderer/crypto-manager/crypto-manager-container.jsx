import React, { PureComponent } from 'react';
import { Grid, Button, Typography, withStyles, List } from '@material-ui/core';
import { connect } from 'react-redux';
import CryptoPriceTableContainer from './crypto-price-table-container';
import { push } from 'connected-react-router';
import { MyCryptoLargeIcon, PriceSummary, BackButton } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { Popup } from '../common/popup';
import { walletTokensOperations } from 'common/wallet-tokens';

const styles = theme => ({
	bottomSpace: {
		marginBottom: '15px'
	},
	topSpace: {
		marginTop: '30px'
	},
	popup: {
		'& > div:nth-child(2)': {
			left: 'calc(50% - 250px)',
			top: '275px',
			width: '500px'
		},
		'& button': {
			'& div': {
				marginLeft: '499px !important'
			}
		}
	},
	label: {
		width: '100px'
	},
	listBottomSpace: {
		marginBottom: '30px',
		paddingLeft: '16px'
	},
	listContainer: {
		marginBottom: '10px'
	},
	summary: {
		marginTop: 0
	}
});

class CryptoManagerContainerComponent extends PureComponent {
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
				className={classes.popup}
			>
				<Grid
					container
					className={classes.root}
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<List component="dl" className={classes.listBottomSpace}>
						<Grid container className={classes.listContainer} wrap="nowrap">
							<dt className={classes.label}>
								<Typography variant="body2" color="secondary">
									Name
								</Typography>
							</dt>
							<dd data-akarmi={tokenAdded.name}>
								<Typography variant="body2" className={classes.bold}>
									{tokenAdded.name}
								</Typography>
							</dd>
						</Grid>
						<Grid container className={classes.listContainer} wrap="nowrap">
							<dt className={classes.label}>
								<Typography variant="body2" color="secondary">
									Symbol
								</Typography>
							</dt>
							<dd>
								<Typography variant="body2" className={classes.bold}>
									{tokenAdded.symbol}
								</Typography>
							</dd>
						</Grid>
						<Grid container className={classes.listContainer} wrap="nowrap">
							<dt className={classes.label}>
								<Typography variant="body2" color="secondary">
									Balance
								</Typography>
							</dt>
							<dd>
								<PriceSummary
									locale={locale}
									style="decimal"
									currency={tokenAdded.symbol}
									value={tokenAdded.balance}
									className={`${classes.summary} ${classes.bold}`}
								/>
							</dd>
						</Grid>
					</List>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									color="secondary"
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
				className={classes.popup}
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
									color="secondary"
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
				style={{ width: '100%', margin: 0 }}
			>
				<BackButton onclick={this.handleBackClick} />
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
