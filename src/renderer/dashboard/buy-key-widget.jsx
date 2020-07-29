import React, { PureComponent } from 'react';
import { featureIsEnabled } from 'common/feature-flags';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CustomIcon, CoinsIcon, ExchangeSmallIcon } from 'selfkey-ui';
import BuyKeyPopup from './buy-key-popup-container';
import TokenSwap from '../transaction/swap';

const styles = theme => ({
	bgIcon: {
		top: '-60px',
		marginTop: '-112px',
		opacity: '0.5',
		position: 'relative',
		right: '-250px',
		zIndex: 0
	},
	buyKey: {
		backgroundColor: '#1E262E',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		flexGrow: 1,
		height: '236px',
		marginBottom: '15px',
		maxHeight: '236px',
		overflow: 'hidden',
		padding: '20px 30px 30px'
	},
	ctabutton: {
		backgroundColor: '#1E262E',
		display: 'flex',
		justifyContent: 'space-between',
		maxWidth: '100%',
		marginLeft: 'auto',
		marginRight: '0',
		marginBottom: '1em',
		position: 'relative',
		width: '100%',
		zIndex: 1,
		'& span': {
			flexGrow: 1
		},
		'& svg': {
			width: '24px !important',
			height: '24px !important'
		}
	},
	title: {
		fontSize: '20px',
		marginBottom: '30px'
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-269px'
		}
	}
});

class BuyKeyWidget extends PureComponent {
	state = {
		popup: null
	};

	handleBuyPopup = () => {
		this.setState({ popup: 'buy' });
	};

	handleSwapPopup = () => {
		this.setState({ popup: 'swap' });
	};

	handlePopupClose = () => {
		this.setState({ popup: null });
	};

	handleExternalLink = e => {
		window.openExternal(
			e,
			'https://help.selfkey.org/article/128-how-to-pay-for-marketplace-products-services-with-key'
		);
	};

	render() {
		const { classes } = this.props;
		const { popup } = this.state;
		return (
			<React.Fragment>
				{popup !== null && popup === 'buy' && (
					<BuyKeyPopup
						closeAction={this.handlePopupClose}
						externalLink={this.handleExternalLink}
					/>
				)}
				{popup !== null && popup === 'swap' && (
					<TokenSwap closeAction={this.handlePopupClose} />
				)}
				<Grid item className={classes.buyKey}>
					<Typography variant="h1" className={classes.title}>
						Buy KEY tokens, to use in the SelfKey Marketplace.
					</Typography>
					<Button
						variant="outlined"
						size="large"
						className={classes.ctabutton}
						onClick={this.handleBuyPopup}
					>
						<CustomIcon width="24px" height="24px" />
						<span>Buy KEY</span>
					</Button>

					{featureIsEnabled('swapTokens') && (
						<Button
							variant="outlined"
							size="large"
							className={classes.ctabutton}
							onClick={this.handleSwapPopup}
						>
							<ExchangeSmallIcon width="24px" height="24px" />
							<span>Swap Tokens</span>
						</Button>
					)}
					<div className={classes.bgIcon}>
						<CoinsIcon width="76px" height="79px" fill="#313B49" />
					</div>
				</Grid>
			</React.Fragment>
		);
	}
}

export default withStyles(styles)(BuyKeyWidget);
