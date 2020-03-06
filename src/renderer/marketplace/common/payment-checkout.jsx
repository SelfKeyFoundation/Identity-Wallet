import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon, ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';
import { FlagCountryName } from '.';
import { WhatYouGet } from './marketplace-what-you-get';
import { HowServiceWorks } from './marketplace-how-service-works';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	modalHeader: {
		display: 'flex',
		height: '76px'
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
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	serviceCost: {
		borderBottom: '2px solid #475768',
		width: '100%',
		paddingBottom: '30px',
		marginBottom: '30px'
	},
	priceTable: {
		padding: '2em',
		margin: '2em 0',
		background: '#313D49'
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
	rowSeparator: {
		border: '1px solid #475768',
		margin: '30px 0'
	},
	payButton: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	},
	modalWrap: {
		left: 'calc(50% - 452px)',
		width: '960px'
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
		onBackClick,
		onStartClick,
		startButtonText
	}) => (
		<ModalWrap className={classes.modalWrap}>
			<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
			<ModalHeader className={classes.modalHeader}>
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
			</ModalHeader>
			<ModalBody>
				<Grid
					container
					justify="flex-start"
					alignItems="center"
					className={classes.content}
				>
					<div className={classes.serviceCost}>
						<WhatYouGet
							classes={classes}
							description={description}
							timeToForm={timeToForm}
							initialDocsText={initialDocsText}
							kycProcessText={kycProcessText}
							getFinalDocsText={getFinalDocsText}
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
			</ModalBody>
		</ModalWrap>
	)
);

export { PaymentCheckout };
export default PaymentCheckout;
