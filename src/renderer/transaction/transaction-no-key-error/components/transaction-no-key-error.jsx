import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { withStyles, Typography, List, ListItem } from '@material-ui/core';
import { DefaultBullet } from 'selfkey-ui';

const styles = theme => ({
	bodyText: {
		marginBottom: '30px',
		paddingRight: '30px',
		textAlign: 'justify'
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
	({ classes, children, keyPrice, address, closeAction }) => {
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
						{[
							'Binance',
							'Hitbtc',
							'DCoin',
							'Kucoin',
							'WhiteBit',
							'P2PB2B',
							'ProBit',
							'Tidex',
							'Abcc',
							'Idex',
							'Crex24',
							'Rightbtc',
							'IDCM',
							'Lukki',
							'Bilaxy',
							'Bw'
						].map(item => (
							<ListItem key={item}>
								<DefaultBullet />
								<Typography variant="body1">{item}</Typography>
							</ListItem>
						))}
					</List>
				</div>
			</TransactionErrorBox>
		);
	}
);

export default TransactionNoKeyError;
