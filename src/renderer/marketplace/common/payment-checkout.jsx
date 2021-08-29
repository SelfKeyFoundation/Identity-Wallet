import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { NumberFormat } from 'selfkey-ui';
import { FlagCountryName } from '.';
import { WhatYouGet } from './marketplace-what-you-get';
import { HowServiceWorks } from './marketplace-how-service-works';
import { Popup } from '../../common';

const styles = theme => ({
	closeButton: {
		marginLeft: '180px'
	},
	containerHeader: {
		'& div': {
			color: '#FFF',
			display: 'inline-block'
		},
		'& h2': {
			marginLeft: '16px'
		}
	},
	modalWrap: {
		left: 'calc(50% - 480px)',
		right: 'initial',
		width: '960px'
	},
	payButton: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	},
	priceRow: {
		padding: '10px 0',
		'& div.rowItem': {
			width: '33%',
			color: '#FFF'
		},
		'& div.price': {
			color: '#00C0D9',
			fontWeight: 'bold',
			textAlign: 'right',
			'& .time': {
				marginTop: '5px'
			}
		},
		'& div.time': {
			color: theme.palette.secondary.main,
			fontSize: '13px'
		},
		'& div.rowItem.transactionFee': {
			color: theme.palette.secondary.main
		}
	},
	priceTable: {
		padding: '2em',
		margin: '2em 0',
		background: '#313D49'
	},
	rowSeparator: {
		border: '1px solid #475768',
		margin: '30px 0'
	},
	serviceCost: {
		borderBottom: '2px solid #475768',
		width: '100%',
		paddingBottom: '30px',
		marginBottom: '30px'
	},
	currency: {
		'& > div': {
			display: 'inline-block'
		}
	}
});

const PaymentCheckout = withStyles(styles)(
	({
		classes,
		title,
		program,
		description,
		timeToForm,
		countryCode,
		price,
		keyAmount,
		usdFee,
		ethFee,
		options,
		initialDocsText,
		kycProcessText,
		getFinalDocsText,
		whatYouGet,
		onBackClick,
		onStartClick,
		startButtonText
	}) => (
		<Popup
			closeAction={onBackClick}
			open
			popupClass={classes.modalWrap}
			closeButtonClass={classes.closeButton}
			text={
				<Grid
					container
					justify="flex-start"
					alignItems="center"
					className={classes.containerHeader}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="h2">{title}</Typography>
				</Grid>
			}
		>
			<Grid container justify="flex-start" alignItems="center" className={classes.content}>
				<div className={classes.serviceCost}>
					<WhatYouGet
						classes={classes}
						description={description}
						timeToForm={timeToForm}
						initialDocsText={initialDocsText}
						kycProcessText={kycProcessText}
						getFinalDocsText={getFinalDocsText}
						whatYouGet={whatYouGet}
					/>

					<HowServiceWorks
						classes={classes}
						initialDocsText={initialDocsText}
						kycProcessText={kycProcessText}
						getFinalDocsText={getFinalDocsText}
					/>
				</div>
				<div style={{ width: '100%' }}>
					<Typography variant="h2" gutterBottom>
						Service Costs
					</Typography>

					<div className={classes.priceTable}>
						{options &&
							options.map(option => (
								<div key={option.id} className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={0}
									>
										<div className="rowItem">{option.description}</div>
										<div className="rowItem time">{option.notes}</div>
										<div className="rowItem price">
											{option.price && (
												<React.Fragment>
													${option.price.toLocaleString()}
												</React.Fragment>
											)}
										</div>
									</Grid>
								</div>
							))}
						<div className={classes.rowSeparator} />
						<div className={classes.priceRow}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="center"
								spacing={0}
							>
								<div className="rowItem">Cost</div>
								<div className="rowItem time" />
								<div className="rowItem price">
									Total: ${price.toLocaleString()}
									<div className="time">{keyAmount.toLocaleString()} KEY</div>
								</div>
							</Grid>
						</div>
						<div className={classes.priceRow}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="center"
								spacing={0}
							>
								<div className="rowItem transactionFee">
									Network Transaction Fee
								</div>
								<div className="rowItem time" />
								<div className="rowItem price">
									<div className={classes.currency}>
										$
										<NumberFormat
											locale={'en'}
											currency={'USD'}
											style="currency"
											value={usdFee}
											className={classes.currency}
											fractionDigits={2}
										/>
									</div>
									<div className="time">
										{Number.parseFloat(ethFee).toFixed(8)} ETH{' '}
									</div>
								</div>
							</Grid>
						</div>
					</div>
				</div>
				<div className={classes.payButton}>
					<Button variant="contained" size="large" onClick={onStartClick}>
						{startButtonText}
					</Button>
					<Button variant="outlined" size="large" onClick={onBackClick}>
						Cancel
					</Button>
				</div>
			</Grid>
		</Popup>
	)
);

export { PaymentCheckout };
export default PaymentCheckout;
