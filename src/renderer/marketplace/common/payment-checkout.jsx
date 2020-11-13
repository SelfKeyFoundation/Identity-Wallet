import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { FlagCountryName } from '.';
import { WhatYouGet } from './marketplace-what-you-get';
import { HowServiceWorks } from './marketplace-how-service-works';
import { Popup } from '../../common';

const styles = theme => ({
	closeButton: {
		marginLeft: theme.spacing(22)
	},
	containerHeader: {
		'& div': {
			color: '#FFF',
			display: 'inline-block'
		},
		'& h2': {
			marginLeft: theme.spacing(2)
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
			marginRight: theme.spacing(4)
		}
	},
	priceRow: {
		padding: theme.spacing(1, 0),
		'& div.rowItem': {
			color: '#FFF',
			width: '33%'
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
		background: '#313D49',
		margin: theme.spacing(4, 0),
		padding: theme.spacing(4)
	},
	rowSeparator: {
		border: '1px solid #475768',
		marginRight: theme.spacing(4, 0)
	},
	serviceCost: {
		borderBottom: '2px solid #475768',
		marginBottom: theme.spacing(4),
		paddingBottom: theme.spacing(4),
		width: '100%'
	},
	bottomSpace: {
		marginBottom: theme.spacing(2)
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
					<Typography variant="h2" className={classes.bottomSpace}>
						Service Costs
					</Typography>

					<div className={classes.priceTable}>
						{options.map(option => (
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
									${usdFee.toLocaleString()}
									<div className="time">{ethFee.toLocaleString()} ETH</div>
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
