import React from 'react';
import { connect } from 'react-redux';
import { getExchangeLinks } from 'common/exchanges/selectors';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WarningShieldIcon } from 'selfkey-ui';
import { Popup } from '../../common/popup';

const styles = theme => ({
	exchangeItem: {
		columnBreakInside: 'avoid',
		color: '#FFFFFF',
		marginBottom: 0,
		'& a': {
			textDecoration: 'none',
			color: '#FFFFFF'
		}
	},

	body: {
		color: '#FFFFFF',
		fontFamily: 'Proxima Nova',
		fontSize: '18px',
		lineHeight: '30px'
	},

	exchanges: {
		columnCount: 2,
		marginLeft: '-15px'
	},

	circle: {
		fontSize: '16px',
		paddingRight: '10px'
	},

	bottomSpace: {
		marginBottom: '15px'
	}
});

const getExchanges = (exchanges, classes) => {
	return exchanges.map(exchange => {
		return (
			<ListItem key={exchange.name} className={classes.exchangeItem}>
				<a href={exchange.url} target="_blank" rel="noopener noreferrer">
					<Typography variant="body1">
						<span className={classes.circle}>&#9675;</span> {exchange.name}
					</Typography>
				</a>
			</ListItem>
		);
	});
};

export const WithoutBalanceContent = withStyles(styles)(({ classes, children, exchanges }) => (
	<Grid container direction="row" justify="flex-start" alignItems="flex-start">
		<Grid item xs={2}>
			<WarningShieldIcon />
		</Grid>
		<Grid item xs={10}>
			<Grid container direction="column" justify="flex-start" alignItems="flex-start">
				<Grid item id="header">
					<Typography variant="caption" className={classes.bottomSpace}>
						You need at least 25 KEY tokens to unlock this listing.
					</Typography>
				</Grid>
				<Grid item id="body" className={classes.body}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="flex-start"
						spacing={16}
					>
						<Grid item>
							<Typography variant="body1" className={classes.bottomSpace}>
								To access this marketplace, you will need a deposit of 25 KEY
								tokens. This deposit is reclaimable after 30 days. KEY tokens are
								listed on many exchanges worldwide:
							</Typography>
						</Grid>
						<List className={classes.exchanges}>
							{getExchanges(exchanges, classes)}
						</List>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
));

const WithoutBalancePopupComponent = props => {
	return (
		<Popup closeAction={props.closeAction} text="Unlock This Marketplace: Crypto Exchanges">
			<WithoutBalanceContent {...props} />
		</Popup>
	);
};

const mapStateToProps = state => {
	return {
		exchanges: getExchangeLinks(state)
	};
};

export const MarketplaceWithoutBalancePopup = connect(mapStateToProps)(
	WithoutBalancePopupComponent
);

export default MarketplaceWithoutBalancePopup;
