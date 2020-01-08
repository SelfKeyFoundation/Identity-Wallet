import React, { PureComponent } from 'react';

import { Button, Grid, withStyles, Typography } from '@material-ui/core';
import { ReturnLargeIcon, TransactionFeeSelector } from 'selfkey-ui';
import config from 'common/config';

const styles = theme => ({
	contentSection: {
		marginBottom: '50px',
		'& [role="slider"]': {
			marginBottom: '5px',
			marginTop: '10px'
		}
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

class ReturnDepositContentComponent extends PureComponent {
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
					<ReturnLargeIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item classes={{ item: classes.contentSection }}>
							<Typography variant="body1">
								You can now get your deposit of {amount} {token} tokens back. After
								the transaction is confirmed, you will lose access to this
								marketplace.
							</Typography>
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
								<Button
									variant="contained"
									size="large"
									onClick={this.handleConfirm}
								>
									Confirm
								</Button>
								<Button variant="outlined" size="large" onClick={onCancel}>
									Cancel
								</Button>
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
