import React from 'react';
import { Grid, List, ListItem, withStyles, Typography, Divider } from '@material-ui/core';
import { PaymentIcon, Copy } from 'selfkey-ui';

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
		}
	},
	exchanges: {
		columnCount: 2,
		marginBottom: '30px',
		marginLeft: '-15px'
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	}
});

const handleLinkClick = e => {
	window.openExternal(e, e.target.href || e.currentTarget.href);
};

const getExchanges = (exchanges, classes) => {
	return exchanges.map(exchange => {
		return (
			<ListItem key={exchange.id} className={classes.exchangeItem}>
				<a
					href={exchange.trade_url || exchange.url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleLinkClick}
				>
					<Typography variant="body1">
						<span className={classes.circle}>&#9675;</span> {exchange.name}
					</Typography>
				</a>
			</ListItem>
		);
	});
};

export const BuyKeyContent = withStyles(styles)(
	({ classes, address, children, exchanges, externalLink }) => (
		<Grid container direction="row" justify="flex-start" alignItems="flex-start">
			<Grid item xs={2}>
				<PaymentIcon />
			</Grid>
			<Grid item xs={10}>
				<Grid container direction="column" justify="flex-start" alignItems="flex-start">
					<Grid item id="header">
						<Typography variant="h1" gutterBottom>
							Get KEY Tokens
						</Typography>
					</Grid>
					<Grid item id="body" className={classes.body}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={2}
						>
							<Grid item>
								<Typography variant="body1" className={classes.bottomSpace}>
									You can buy KEY tokens, to use in the wallet, from one of the
									many exchanges worldwide.
								</Typography>
							</Grid>
							<List className={classes.exchanges}>
								{getExchanges(exchanges, classes)}
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
										KEY is the main token used in the SelfKey Wallet, and it’s
										used when accessing services in the marketplace. ETH is
										needed for the network transaction fee{' '}
										<a className={classes.link} onClick={externalLink}>
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
	)
);

export default BuyKeyContent;
