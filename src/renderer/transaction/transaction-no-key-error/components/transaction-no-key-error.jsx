import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { withStyles, Typography } from '@material-ui/core';

const styles = theme => ({
	bodyText: {
		marginBottom: '30px',
		textAlign: 'justify'
	},
	learnMoreText: {
		paddingTop: '15px',
		color: '#93B0C1',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},
	learnMoreLink: {
		textDecoration: 'none'
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
					<Typography variant="body1">
						Please transfer some KEY to this address and try again. Your KEY address of
						this wallet is listed below.
					</Typography>
				</div>
			</TransactionErrorBox>
		);
	}
);

export default TransactionNoKeyError;
