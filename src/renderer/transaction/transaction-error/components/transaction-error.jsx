import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	bodyText: {
		textAlign: 'justify'
	}
});

export const TransactionError = withStyles(styles)(({ classes, message, address, closeAction }) => {
	return (
		<TransactionErrorBox
			address={address}
			closeAction={closeAction}
			subtitle="Transaction Failed"
		>
			<Typography variant="body1" className={classes.bodyText}>
				{message}
			</Typography>
		</TransactionErrorBox>
	);
});

export default TransactionError;
