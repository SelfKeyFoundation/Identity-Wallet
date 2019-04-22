import React, { Component } from 'react';
import config from 'common/config';
import {
	Grid,
	Checkbox,
	FormControlLabel,
	FormControl,
	FormHelperText,
	withStyles,
	Typography
} from '@material-ui/core';

import { StyledButton, TransactionFeeSelector, ExchangeLargeIcon } from 'selfkey-ui';

const styles = theme => ({
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

class DepositContentComponent extends Component {
	state = {
		error: false,
		understood: false,
		fee: 0
	};
	handleUnderstoodChange = (event, checked) => {
		this.setState({ understood: checked });
	};
	handleFeeChange = fee => {
		this.setState({ fee });
	};
	handleSubmit = event => {
		event.preventDefault();
		if (!this.state.understood) {
			return this.setState({ error: true });
		}
		return this.props.onConfirm(this.state.fee);
	};

	render() {
		const {
			classes,
			amount = 25,
			token = config.constants.primaryToken,
			days = 30,
			minGasPrice,
			maxGasPrice,
			gasLimit,
			fiat,
			fiatRate,
			onCancel
		} = this.props;

		const { error, understood } = this.state;
		return (
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<ExchangeLargeIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item classes={{ item: classes.contentSection }}>
							<Typography variant="body2">
								A refundable deposit of {amount} {token} tokens is required to
								unlock this marketplace for {days} days.
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
							<form onSubmit={this.handleSubmit}>
								<FormControl required={true} error={error}>
									<FormControlLabel
										classes={{ label: classes.understandLabel }}
										checked={understood}
										value="understood"
										onChange={this.handleUnderstoodChange}
										control={
											<Checkbox
												color="primary"
												classes={{
													root: classes.understandCheckbox,
													colorPrimary: classes.primary,
													checked: classes.checked
												}}
											/>
										}
										label={`OK, I understand that this deposit is refundable after ${days} days.`}
									/>
									{error ? (
										<FormHelperText>
											Please confirm you understand how the deposit works.
										</FormHelperText>
									) : (
										''
									)}
								</FormControl>
								<div className={classes.actions}>
									<StyledButton variant="contained" size="medium" type="submit">
										Confirm
									</StyledButton>
									<StyledButton
										variant="outlined"
										size="medium"
										onClick={onCancel}
									>
										Cancel
									</StyledButton>
								</div>
							</form>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const DepositContent = withStyles(styles)(DepositContentComponent);

export default DepositContent;
