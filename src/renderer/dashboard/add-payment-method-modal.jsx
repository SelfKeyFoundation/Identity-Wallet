import React from 'react';
import moment from 'moment';
import { Grid, Typography, Button, FormControl, Input, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup, InputTitle } from '../common';
import { PropTypes } from 'prop-types';
import { CodeIcon, KeyPicker } from 'selfkey-ui';
import PhysicalAddressChooser from './physical-address-chooser';

const useStyles = makeStyles(theme => ({
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	},
	resend: {
		marginTop: 5,
		textAlign: 'right'
	},
	actions: {
		marginTop: 30
	}
}));

export const AddPaymentMethodModal = ({
	onCloseClick,
	onContinueClick,
	cardNumber,
	onCreditCardNumberChange,
	onExpiryDateChange,
	addresses,
	loading,
	disabled,
	error
}) => {
	const classes = useStyles();
	const startOfMonth = moment(Date.now()).startOf('month');
	return (
		<Popup closeAction={onCloseClick} text="Add a payment method">
			<Grid container direction="row" spacing={4}>
				<Grid item xs={2}>
					<CodeIcon />
				</Grid>
				<Grid item xs>
					<Grid container direction="column" spacing={4}>
						<Grid item>
							<Typography variant="h1">Add payment information</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1">
								Add the card you will use to make this purchase.
							</Typography>
						</Grid>
						{loading && (
							<Grid item>
								<CircularProgress />
							</Grid>
						)}
						{!loading && (
							<React.Fragment>
								<Grid item>
									<Grid container direction="column" spacing={2}>
										<Grid item>
											<FormControl variant="filled" fullWidth>
												<InputTitle title="Card Number" />
												<Input
													fullWidth
													type="text"
													onChange={onCreditCardNumberChange}
													value={cardNumber}
													placeholder="1234 1234 1234 1234"
												/>
											</FormControl>
										</Grid>
										<Grid item>
											<Grid container direction="row" spacing={2}>
												<Grid item xs={8}>
													<FormControl variant="filled" fullWidth>
														<InputTitle title="Expiry Date" />
														<KeyPicker
															onChange={onExpiryDateChange}
															viewDate={startOfMonth}
															format="MM/YYYY"
															isValidDate={current => {
																return current.isSameOrAfter(
																	startOfMonth,
																	'month'
																);
															}}
														/>
													</FormControl>
												</Grid>
												<Grid item xs={4}>
													<FormControl variant="filled" fullWidth>
														<InputTitle title="CCV" />
														<Input
															fullWidth
															type="text"
															onChange={onCreditCardNumberChange}
															value={cardNumber}
															placeholder="123"
														/>
													</FormControl>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Typography variant="body1">Billing Address</Typography>
								</Grid>
								<Grid item>
									<PhysicalAddressChooser addresses={addresses} />
								</Grid>
							</React.Fragment>
						)}
						{error && (
							<Grid item>
								<Typography variant="subtitle2" color="error" gutterBottom>
									{error}
								</Typography>
							</Grid>
						)}
						<Grid item>
							<Grid container direction="row" spacing={2} className={classes.actions}>
								<Grid item>
									<Button
										variant="contained"
										size="large"
										onClick={onContinueClick}
										disabled={loading || !disabled}
									>
										Continue
									</Button>
								</Grid>
								<Grid item>
									<Button variant="outlined" size="large" onClick={onCloseClick}>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

AddPaymentMethodModal.propTypes = {
	onContinueClick: PropTypes.func.isRequired,
	onCloseClick: PropTypes.func.isRequired,
	onResendClick: PropTypes.func.isRequired,
	phone: PropTypes.string.isRequired,
	code: PropTypes.string,
	onCodeChange: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.string,
	addresses: PropTypes.arrayOf(PropTypes.object)
};

AddPaymentMethodModal.defaultProps = {
	code: '',
	loading: false,
	error: '',
	addresses: []
};

export default AddPaymentMethodModal;
