import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { withStyles, Typography, List, ListItem } from '@material-ui/core';

const styles = theme => ({
	bodyText: {
		marginBottom: '30px',
		paddingRight: '30px',
		textAlign: 'justify'
	},
	bottomSpace: {
		marginBottom: '30px'
	}
});

export const TransactionNoKeyError = withStyles(styles)(
	({ classes, children, address, closeAction }) => {
		return (
			<TransactionErrorBox address={address} closeAction={closeAction}>
				<div className={classes.bodyText}>
					<Typography variant="caption" gutterBottom>
						You do not have enough KEY tokens to pay for this marketplace application.
					</Typography>
					<Typography variant="body1" className={classes.bottomSpace}>
						To access this marketplace, you will need to deposit 39.730,293 KEY tokens
						in your SelfKey Wallet. KEY tokens are listed on many exchanges worldwide:
					</Typography>
					<List style={{ width: '70%', columns: 2 }}>
						{[
							'Binance',
							'KuCoin',
							'Latoken',
							'ProBit',
							'Tidex',
							'DCoin',
							'WhiteBit',
							'P2PB2B'
						].map(item => (
							<ListItem key={item}>
								<Typography variant="body1" align="right">
									{item}
								</Typography>
							</ListItem>
						))}
					</List>
				</div>
			</TransactionErrorBox>
		);
	}
);

export default TransactionNoKeyError;
