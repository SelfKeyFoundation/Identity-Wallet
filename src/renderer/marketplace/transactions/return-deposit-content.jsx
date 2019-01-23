import React, { Component } from 'react';

import { Grid, withStyles } from '@material-ui/core';
import { P, StyledButton, ReturnIcon, TransactionFeeSelector } from 'selfkey-ui';
import config from 'common/config';

const styles = theme => ({
	text: {
		fontSize: '18px',
		lineHeight: '30px'
	},
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
	contentSection: {
		marginBottom: '20px',
		marginTop: '20px'
	},
	understandLabel: {
		fontFamily: theme.typography.fontFamily,
		fontSize: '14px',
		lineHeight: '21px',
		color: '#93B0C1'
	},
	understandCheckbox: {
		color: '#00C0D9',
		'&$primary$checked': {
			color: '#00C0D9'
		}
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	primary: {},
	checked: {}
});

class ReturnDepositContentComponent extends Component {
	state = {
		error: false,
		understood: false,
		fee: 0
	};
	handleFeeChange = fee => {
		this.setState({ fee });
	};
	handleConfirm = event => {
		event.preventDefault();
		return this.props.onConfirm(this.state.fee);
	};

	render() {
		const {
			classes,
			amount = 25,
			token = config.constants.primaryToken,
			minGasPrice,
			maxGasPrice,
			gasLimit,
			fiat,
			fiatRate,
			onCancel
		} = this.props;
		return (
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<ReturnIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item classes={{ item: classes.contentSection }}>
							<P className={classes.text}>
								You can now get your deposit of {amount} {token} tokens back. After
								the transaction is confirmed, you will lose access to this
								marketplace.
							</P>
						</Grid>
						<Grid item classes={{ item: classes.contentSection }}>
							<TransactionFeeSelector
								minGasPrice={minGasPrice}
								maxGasPrice={maxGasPrice}
								gasLimit={gasLimit}
								fiat={fiat}
								fiatRate={fiatRate}
								onChange={this.handleFeeChange}
							/>
						</Grid>
						<Grid item classes={{ item: classes.footer }}>
							<div className={classes.actions}>
								<StyledButton
									variant="contained"
									size="medium"
									onClick={this.handleConfirm}
								>
									Confirm
								</StyledButton>
								<StyledButton variant="outlined" size="medium" onClick={onCancel}>
									Cancel
								</StyledButton>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const ReturnDepositContent = withStyles(styles)(ReturnDepositContentComponent);

export default ReturnDepositContent;
