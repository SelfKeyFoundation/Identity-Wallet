import React from 'react';
import { Grid, List, ListItem, Typography, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { PaymentIcon, Copy, primary } from 'selfkey-ui';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	address: {
		marginRight: '10px'
	},
	body: {
		color: '#FFFFFF',
		fontFamily: 'Proxima Nova',
		fontSize: '18px',
		lineHeight: '30px'
	},
	bottomSpace: {
		marginBottom: '15px'
	},
	circle: {
		fontSize: '16px',
		paddingRight: '10px'
	},
	divider: {
		margin: '40px 0 25px',
		width: '100%'
	},
	exchangeItem: {
		columnBreakInside: 'avoid',
		color: '#FFFFFF',
		marginBottom: 0,
		position: 'initial',
		'& a': {
			textDecoration: 'none',
			color: '#FFFFFF'
		},
		'& a:hover': {
			'& p': {
				color: primary
			}
		}
	},
	exchanges: {
		columnCount: 2,
		marginBottom: '30px',
		marginLeft: '-15px'
	},
	icon: {
		marginRight: '45px'
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	}
});

const getExchanges = (exchanges, classes, onLinkClick) => {
	return exchanges.map(exchange => {
		return (
			<ListItem key={exchange.id} className={classes.exchangeItem}>
				<a
					href={exchange.trade_url || exchange.url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={onLinkClick}
				>
					<Typography variant="body1">
						<span className={classes.circle}>&#9675;</span> {exchange.name}
					</Typography>
				</a>
			</ListItem>
		);
	});
};

export const BuyKeyModal = withStyles(styles)(
	({ classes, address, onMoonpayClick, onLinkClick, exchanges, onCloseClick }) => (
		<Popup closeAction={onCloseClick} text="Buy KEY">
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				wrap="nowrap"
			>
				<Grid item className={classes.icon}>
					<PaymentIcon />
				</Grid>
				<Grid item>
					<Grid container direction="column" justify="flex-start" alignItems="flex-start">
						<Grid item id="header">
							<Typography variant="h1" gutterBottom>
								Get KEY Tokens
							</Typography>
						</Grid>
						{onMoonpayClick && (
							<React.Fragment>
								<Grid item className={classes.bottomSpace}>
									<Typography variant="body1">
										You can purchase KEY tokens with Credit Card directly in the
										wallet using the MoonPay service.
									</Typography>
								</Grid>
								<Grid item className={classes.bottomSpace}>
									<Button
										size="large"
										variant="contained"
										onClick={onMoonpayClick}
									>
										Connect With Moonpay
									</Button>
								</Grid>
								<Grid item>
									<Typography variant="body1">Alternatively:</Typography>
								</Grid>
							</React.Fragment>
						)}
						<Grid item id="body" className={classes.body}>
							<Grid
								container
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Typography variant="body1" className={classes.bottomSpace}>
									You can buy KEY tokens, to use in the wallet, from one of the
									many exchanges worldwide.
								</Typography>
								<List className={classes.exchanges}>
									{getExchanges(exchanges, classes, onLinkClick)}
								</List>
								{address && (
									<Grid container>
										<Typography variant="body1" color="secondary">
											Your Address to receive KEY:
										</Typography>
										<Grid container alignItems="center">
											<Typography className={classes.address} variant="body1">
												{address}
											</Typography>
											<Copy text={address} />
										</Grid>
										<Divider className={classes.divider} />
										<Typography variant="subtitle2" color="secondary">
											KEY is the main token used in the SelfKey Wallet, and
											it’s used when accessing services in the marketplace.
											ETH is needed for the network transaction fee{' '}
											<a
												className={classes.link}
												target="_blank"
												rel="noopener noreferrer"
												onClick={onLinkClick}
												href="https://help.selfkey.org/article/128-how-to-pay-for-marketplace-products-services-with-key"
											>
												(what’s this?)
											</a>
											.
										</Typography>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	)
);

BuyKeyModal.propTypes = {
	address: PropTypes.string,
	onMoonpayClick: PropTypes.func,
	onLinkClick: PropTypes.func,
	exchanges: PropTypes.array.isRequired,
	onCloseClick: PropTypes.func
};

BuyKeyModal.defaultProps = {
	moonpayEnabled: false
};

export default BuyKeyModal;
