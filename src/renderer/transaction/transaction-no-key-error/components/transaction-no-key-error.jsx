import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { Typography, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { DefaultBullet } from 'selfkey-ui';

const styles = theme => ({
	bodyText: {
		marginBottom: '30px',
		paddingRight: '30px'
	},
	list: {
		columns: 3,
		paddingLeft: 0,
		width: '100%',
		'& li': {
			paddingLeft: 0
		}
	},
	bottomSpace: {
		marginBottom: '30px'
	}
});

export const TransactionNoKeyError = withStyles(styles)(
	({ classes, children, keyPrice, address, closeAction, listingExchanges = [] }) => {
		const numeric = keyPrice && +keyPrice;
		const key = numeric.toLocaleString();
		return (
			<TransactionErrorBox address={address} closeAction={closeAction}>
				<div className={classes.bodyText}>
					<Typography variant="caption" gutterBottom>
						You do not have enough KEY tokens to pay for this marketplace application.
					</Typography>
					<Typography variant="body1" className={classes.bottomSpace}>
						To access this marketplace, you will need to deposit {key} KEY tokens in
						your SelfKey Wallet. KEY tokens are listed on many exchanges worldwide:
					</Typography>
					<List className={classes.list}>
						{listingExchanges.map(item => (
							<ListItem key={item.id}>
								<DefaultBullet />
								<Typography variant="body1">{item.name}</Typography>
							</ListItem>
						))}
					</List>
				</div>
			</TransactionErrorBox>
		);
	}
);

export default TransactionNoKeyError;
