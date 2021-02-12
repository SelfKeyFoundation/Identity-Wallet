import React from 'react';
import { Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';
import { CodeIcon } from 'selfkey-ui';
import visa from 'payment-icons/min/flat/visa.svg';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import maestro from 'payment-icons/min/flat/maestro.svg';
import generic from 'payment-icons/min/flat/default.svg';

const useStyles = makeStyles(theme => ({
	cards: {
		'& > div:last-child': {
			borderBottom: '1px solid #384656'
		}
	},
	card: {
		display: 'flex',
		gap: '10px',
		alignItems: 'center',
		padding: '10px',
		borderTop: '1px solid #384656'
	},
	cardBody: {
		display: 'flex',
		gap: '10px',
		alignItems: 'center',
		'& img': {
			display: 'inline-block',
			maxHeight: '30px'
		}
	},
	addNewCard: {
		marginTop: '1em',
		marginBottom: '1em'
	}
}));

const CreditCardIcon = ({ provider }) => {
	switch (provider.toLowerCase()) {
		case 'visa':
			return <img src={visa} alt="Visa " />;
		case 'mastercard':
			return <img src={mastercard} alt="MasterCard" />;
		case 'maestro':
			return <img src={maestro} alt="MasterCard" />;
		default:
			return <img src={generic} alt="Credit Card" />;
	}
};

export const MoonPaySelectCardModal = ({
	onCloseClick,
	onContinueClick,
	loading,
	cards,
	selectedCard,
	disabled,
	error,
	onAddNewCard,
	onCardSelected
}) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text="Select Card for Transaction">
			<Grid container direction="row" spacing={4}>
				<Grid item xs={2}>
					<CodeIcon />
				</Grid>
				<Grid item xs>
					<Grid container direction="column" spacing={4}>
						<Grid item>
							<Typography variant="h1">Select Card for Transaction</Typography>
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
										<Grid item className={classes.cards}>
											{cards.map(c => (
												<div key={c.id} className={classes.card}>
													<input
														type="radio"
														id={`type_${c.id}`}
														name="card"
														value={c.id}
														checked={
															selectedCard
																? selectedCard.id === c.id
																: false
														}
														onChange={() => onCardSelected(c)}
													/>
													<label htmlFor={`type_${c.id}`}>
														<div className={classes.cardBody}>
															<CreditCardIcon provider={c.brand} />
															<Typography
																variant="body2"
																color="secondary"
																className={
																	classes.selectionBoxTitle
																}
															>
																xxxx xxxx xxxx {c.lastDigits}
															</Typography>
														</div>
													</label>
												</div>
											))}
										</Grid>
									</Grid>
									<Grid item className={classes.addNewCard}>
										<Button
											variant="outlined"
											size="small"
											onClick={onAddNewCard}
											disabled={loading || disabled}
										>
											Add new Card
										</Button>
									</Grid>
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
							<Grid container direction="row" spacing={2}>
								<Grid item>
									<Button
										variant="contained"
										size="large"
										onClick={onContinueClick}
										disabled={loading || disabled || !selectedCard}
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

MoonPaySelectCardModal.propTypes = {
	onContinueClick: PropTypes.func.isRequired,
	onCloseClick: PropTypes.func.isRequired,
	onAddNewCard: PropTypes.func.isRequired,
	cards: PropTypes.array.isRequred,
	onCardSelected: PropTypes.func.isRequired,
	loading: PropTypes.boolean,
	disabled: PropTypes.boolean,
	error: PropTypes.string
};

MoonPaySelectCardModal.defaultProps = {};

export default MoonPaySelectCardModal;
