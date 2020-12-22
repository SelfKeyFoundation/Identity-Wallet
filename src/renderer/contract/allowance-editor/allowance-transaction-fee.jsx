import React from 'react';
// import { makeStyles } from '@material-ui/styles';
import TransactionFeeBox from '../../transaction/send/components/transaction-fee-box';

// const useStyles = makeStyles({});

export const AllowanceTransactionFee = props => {
	// const classes = useStyles();
	return <TransactionFeeBox {...props} />;
};
