import React, { PureComponent } from 'react';
import config from 'common/config';
import {
	Grid,
	Checkbox,
	FormControlLabel,
	FormControl,
	FormHelperText,
	Button,
	Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { TransactionFeeSelector, ExchangeLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	footer: {
		marginTop: '10px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
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
	}
});

class DepositContentComponent extends PureComponent {
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
							<Typography variant="body1">
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
												color={error && !understood ? 'primary' : ''}
												style={{
													color: 'transparent',
													border:
														error && !understood
															? '1px solid #FE4B61'
															: '1px solid #697C95'
												}}
											/>
										}
										label={`OK, I understand that this deposit is refundable after ${days} days.`}
									/>
									{error && !understood ? (
										<FormHelperText>
											Please confirm you understand how the deposit works.
										</FormHelperText>
									) : (
										''
									)}
								</FormControl>
								<div className={classes.actions}>
									<Button variant="contained" size="large" type="submit">
										Confirm
									</Button>
									<Button variant="outlined" size="large" onClick={onCancel}>
										Cancel
									</Button>
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
