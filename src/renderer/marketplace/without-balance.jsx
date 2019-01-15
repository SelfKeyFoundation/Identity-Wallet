import React from 'react';
import { Grid, List, ListItem, withStyles } from '@material-ui/core';
import { H3, P, WarningShieldIcon } from 'selfkey-ui';

const styles = theme => ({
	headerText: {
		color: '#E98548',
		fontFamily: 'Proxima Nova',
		fontSize: '16px',
		lineHeight: '24px'
	},

	exchangeItem: {
		columnBreakInside: 'avoid',
		color: '#FFFFFF',
		fontFamily: 'Proxima Nova',
		fontSize: '18px',
		lineHeight: '3px',
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
	}
});

const getExchanges = (exchanges, classes) => {
	return exchanges.map(exchange => {
		return (
			<ListItem key={exchange.name} className={classes.exchangeItem}>
				<a href={exchange.url} target="_blank" rel="noopener noreferrer">
					<span className={classes.circle}>&#9675;</span> {exchange.name}
				</a>
			</ListItem>
		);
	});
};

export const WithoutBalance = withStyles(styles)(({ classes, children, exchanges }) => (
	<Grid container direction="row" justify="flex-start" alignItems="flex-start">
		<Grid item xs={2}>
			<WarningShieldIcon />
		</Grid>
		<Grid item xs={10}>
			<Grid container direction="column" justify="flex-start" alignItems="flex-start">
				<Grid item id="header">
					<H3 className={classes.headerText}>
						You need at least 25 KEY tokens to unlock this listing.
					</H3>
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
							<P>
								To access this marketplace, you will need a deposit of 25 KEY
								tokens. This deposit is reclaimable after 30 days. KEY tokens are
								listed on many exchanges worldwide:
							</P>
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

export default WithoutBalance;
