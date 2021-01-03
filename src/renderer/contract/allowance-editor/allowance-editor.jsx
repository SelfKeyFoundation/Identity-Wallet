import React from 'react';
import { withStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';
import { Popup } from '../../common';
import { Grid, Divider, Button } from '@material-ui/core';
import { ContractChooser } from './contract-chooser';
import { ContractTokensChooser } from './contract-tokens-chooser';
import { AllowanceAmount } from './allowance-amount';
import { AllowanceTransactionFee } from './allowance-transaction-fee';

const styles = theme => ({
	divider: {
		marginBottom: '20px',
		marginTop: '40px'
	},
	actions: {
		textAlign: 'right',
		'&>button': {
			marginRight: '20px',
			marginTop: '40px'
		}
	},
	body: {
		marginBottom: '30px'
	}
});

export const AllowanceEditor = withStyles(styles)(
	({
		classes,
		fixed,
		onCancel,
		onConfirm,
		contractAddress,
		contractName,
		errors,
		tokens,
		selectedToken,
		currentAmount,
		requestedAmount,
		amount,
		checkingAmount,
		checkingGasPrice,
		locale,
		gas,
		gasPrice,
		nonce,
		ethFee,
		fiatCurrency,
		usdFee,
		ethRate,
		ethGasStationInfo,
		onGasStationReload,
		onGasLimitChange,
		onGasPriceChange,
		onTokenChange,
		onContractAddressChange,
		onAmountChange,
		onNonceChange
	}) => {
		const readyToTransact =
			contractAddress && selectedToken && !errors.amountError && !errors.contractError;
		return (
			<Popup text={fixed ? 'Permission Request' : 'Edit Permission'} closeAction={onCancel}>
				<Grid container direction="column" spacing={2} className={classes.body}>
					<Grid item>
						<ContractTokensChooser
							tokens={tokens}
							fixed={fixed}
							selected={selectedToken}
							title="Select Token"
							onTokenChange={onTokenChange}
						/>
					</Grid>
					<Grid item>
						<ContractChooser
							title="Input Contract Address"
							fixed={fixed}
							address={contractAddress}
							name={contractName}
							onContractAddressChange={onContractAddressChange}
							error={errors.contractError}
						/>
					</Grid>
					{contractAddress && selectedToken && !errors.contractError && (
						<Grid item>
							<AllowanceAmount
								title={'Change Allowance'}
								currentAmount={currentAmount}
								loading={checkingAmount}
								requestedAmount={requestedAmount}
								amount={amount}
								onAmountChange={onAmountChange}
								error={errors.allowanceError}
							/>
						</Grid>
					)}

					{readyToTransact && (
						<Grid item>
							<Divider className={classes.divider} />
						</Grid>
					)}
					{readyToTransact && (
						<Grid item>
							<AllowanceTransactionFee
								locale={locale}
								gasLimit={gas}
								gasPrice={gasPrice}
								nonce={nonce}
								ethFee={ethFee}
								fiatCurrency={fiatCurrency}
								usdFee={usdFee}
								ethRate={ethRate}
								ethGasStationInfo={ethGasStationInfo}
								reloadEthGasStationInfoAction={onGasStationReload}
								changeGasLimitAction={onGasLimitChange}
								changeGasPriceAction={onGasPriceChange}
								changeNonceAction={onNonceChange}
							/>
						</Grid>
					)}
				</Grid>
				<Divider />
				<div className={classes.actions}>
					<Button variant="outlined" size="large" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={onConfirm}
						disabled={!readyToTransact}
					>
						Allow
					</Button>
				</div>
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
	amount: PropTypes.string,
	ethRate: PropTypes.string
};

AllowanceEditor.defaultProps = {
	errors: {},
	gas: 0,
	gasPrice: 0,
	ethFee: 0,
	usdFee: 0
};
