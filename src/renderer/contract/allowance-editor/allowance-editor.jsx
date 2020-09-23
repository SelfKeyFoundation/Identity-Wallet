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
		transactionInfo,
		ethGasStationInfo,
		onGasStationReload,
		onGasLimitChange,
		onGasPriceChange
	}) => {
		return (
			<Popup text={fixed ? 'Permission Request' : 'Edit Permission'} closeAction={onCancel}>
				<Grid container direction="column" spacing={2} className={classes.body}>
					<Grid item>
						<ContractTokensChooser
							tokens={tokens}
							fixed={fixed}
							selected={selectedToken}
							title="Select Token"
						/>
					</Grid>
					<Grid item>
						<ContractChooser
							title="Input Contract Address"
							fixed={fixed}
							address={contractAddress}
							name={contractName}
							error={errors.contractError}
						/>
					</Grid>
					{contractAddress && selectedToken && (
						<Grid item>
							<AllowanceAmount
								title={'Change Allowance'}
								currentAmount={currentAmount}
								loading={checkingAmount}
								requestedAmount={requestedAmount}
								amount={amount}
								error={errors.allowanceError}
							/>
						</Grid>
					)}

					{contractAddress && selectedToken && (
						<Grid item>
							<Divider className={classes.divider} />
						</Grid>
					)}
					{contractAddress && selectedToken && (
						<Grid item>
							<AllowanceTransactionFee
								locale={locale}
								{...transactionInfo}
								ethGasStationInfo={ethGasStationInfo}
								loading={checkingGasPrice}
								reloadEthGasStationInfoAction={onGasStationReload}
								changeGasLimitAction={onGasLimitChange}
								changeGasPriceAction={onGasPriceChange}
							/>
						</Grid>
					)}
				</Grid>
				<Divider />
				<div className={classes.actions}>
					<Button variant="outlined" size="large" onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="contained" size="large" onClick={onConfirm}>
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
	amount: PropTypes.string
};

AllowanceEditor.defaultProps = {
	errors: {}
};
