import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	learnMoreText: {
		paddingTop: '15px',
		color: '#93B0C1',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},
	learnMoreLink: {
		color: primary,
		textDecoration: 'none'
	}
});

export const TransactionNoGasError = withStyles(styles)(
	({ classes, children, address, openLink, closeAction }) => {
		const gasExplanationUrl =
			'https://help.selfkey.org/article/87-how-does-gas-impact-transaction-speed';
		const handleLinkClick = event => {
			event.preventDefault();
			if (!openLink) {
				return;
			}
			openLink(gasExplanationUrl);
		};
		return (
			<TransactionErrorBox
				address={address}
				closeAction={closeAction}
				token="ETH"
				subtitle="Transaction Failed"
			>
				<div>
					<Typography variant="body1">
						You do not have enough Ethereum (ETH) to pay for the network transaction
						fee. Please transfer some ETH to this address and try again. Your ETH
						address of this wallet is listed below.
					</Typography>
					<div className={classes.learnMoreText}>
						To learn more about transaction fees,{' '}
						<a
							className={`${classes.learnMoreText}  ${classes.learnMoreLink}`}
							href={gasExplanationUrl}
							onClick={handleLinkClick}
						>
							click here.
						</a>
					</div>
				</div>
			</TransactionErrorBox>
		);
	}
);

export default TransactionNoGasError;
