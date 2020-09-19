import React from 'react';
import { withStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';
import { Popup } from '../../common';
import { Grid } from '@material-ui/core';
import { ContractChooser } from './contract-chooser';
import { ContractTokensChooser } from './contract-tokens-chooser';
import { AllowanceAmount } from './allowance-amount';

const styles = theme => ({});

export const AllowanceEditor = withStyles(styles)(
	({
		classes,
		onCancel,
		contractAddress,
		contractName,
		errors,
		tokens,
		selectedToken,
		currentAmount,
		requestedAmount,
		amount,
		checkingAmount,
		checkingGasPrice
	}) => {
		return (
			<Popup text={'Edit Permission'} closeAction={onCancel}>
				<Grid container direction="column" spacing={2}>
					<Grid item>
						<ContractTokensChooser
							tokens={tokens}
							selected={selectedToken}
							title="Select Token"
						/>
					</Grid>
					<Grid item>
						<ContractChooser
							title="Input Contract Address"
							address={contractAddress}
							name={contractName}
							error={errors.contractError}
						/>
					</Grid>
					{contractAddress && selectedToken && (
						<AllowanceAmount
							currentAmount={currentAmount}
							loading={checkingAmount}
							requestedAmount={requestedAmount}
							amount={amount}
							error={errors.allowanceError}
						/>
					)}
				</Grid>
			</Popup>
		);
	}
);

AllowanceEditor.propTypes = {
	contractAddress: PropTypes.string,
	contractName: PropTypes.string,
	tokens: PropTypes.array,
	selectedToken: PropTypes.object,
	errors: PropTypes.object,
	currentAmount: PropTypes.string,
	checkingAmount: PropTypes.bool,
	checkingGasPrice: PropTypes.bool,
	requestedAmount: PropTypes.string,
	amount: PropTypes.string
};

AllowanceEditor.defaultProps = {
	errors: {}
};
