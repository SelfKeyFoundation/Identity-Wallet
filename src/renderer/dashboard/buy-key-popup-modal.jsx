import React from 'react';
import { Grid, Typography, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ExchangeSmallIcon, CardsIcon, Copy, primary } from 'selfkey-ui';
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
		columnCount: 3,
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

/*
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
*/

export const BuyKeyModal = withStyles(styles)(
	({ classes, address, onMoonpayClick, onLinkClick, exchanges, onCloseClick }) => (
		<Popup closeAction={onCloseClick} text="Buy KEY">
			{onMoonpayClick && (
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<CardsIcon />
					</Grid>
					<Grid item>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
						>
							<Grid item id="header">
								<Typography variant="h1" gutterBottom>
									Buy KEY with a Credit Card
								</Typography>
							</Grid>

							<Grid item className={classes.bottomSpace}>
								<Typography variant="body2">
									You can purchase KEY using a Credit Card by connecting your
									wallet with MoonPay.
								</Typography>
							</Grid>
							<Grid item className={classes.bottomSpace}>
								<Button size="large" variant="contained" onClick={onMoonpayClick}>
									Connect With MoonPay
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			)}
			<Grid item>
				<Divider className={classes.divider} />
			</Grid>
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				wrap="nowrap"
			>
				<Grid item className={classes.icon}>
					<ExchangeSmallIcon />
				</Grid>
				<Grid item id="body" className={classes.body}>
					<Grid item id="header">
						<Typography variant="h1" gutterBottom>
							Buy KEY on an External Exchange
						</Typography>
					</Grid>

					<Grid container direction="column" justify="flex-start" alignItems="flex-start">
						<Typography variant="body2" className={classes.bottomSpace}>
							You may purchase KEY on many Exchanges worldwide and then transfer them
							to this wallet. KEY is availabe on{' '}
							<a
								className={classes.link}
								target="_blank"
								rel="noopener noreferrer"
								onClick={onLinkClick}
								href="https://www.coingecko.com/en/coins/selfkey#markets"
							>
								these markets
							</a>
							.
						</Typography>
						{address && (
							<Grid container>
								<Typography variant="body2" color="secondary">
									After purchasing KEY on an external Exchange, transfer them to
									your wallet address:
								</Typography>
								<Grid container alignItems="center">
									<Typography className={classes.address} variant="body2">
										{address}
									</Typography>
									<Copy text={address} />
								</Grid>
								<Divider className={classes.divider} />
								<Typography variant="subtitle2" color="secondary">
									KEY is the main token used in the SelfKey Wallet, and it’s used
									when accessing services in the marketplace. ETH is needed for
									the network transaction fee{' '}
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
