import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon, ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';
import { sanitize, FlagCountryName } from '.';

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
	whatYouGet: {
		paddingBottom: '30px',
		marginBottom: '30px',
		borderBottom: '2px solid #475768'
	},
	description: {
		margin: '1em 1em 1em 0',
		fontFamily: 'Lato, arial',
		color: '#FFF',
		width: '60%',
		borderRight: '1px solid #475768',
		lineHeight: '1.4em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em',
			maxWidth: '90%'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	descriptionHelp: {
		width: '35%',
		color: theme.palette.secondary.main,
		fontFamily: 'Lato, arial',
		fontSize: '12px',
		lineHeight: '1.5em',
		'& p': {
			marginBottom: '1em'
		}
	},
	howItWorks: {
		paddingBottom: '30px',
		marginBottom: '30px',
		borderBottom: '2px solid #475768'
	},
	howItWorksBox: {
		width: '26%',
		padding: '2em 3%',
		margin: '2em 0',
		color: '#FFF',
		background: '#313D49',
		'& header h4': {
			display: 'inline-block',
			marginLeft: '0.5em',
			fontSize: '16px'
		},
		'& header span': {
			color: '#00C0D9',
			fontWeight: 'bold',
			fontSize: '20px'
		},
		'& h3': {
			fontSize: '13px'
		}
	},
	serviceCost: {
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
					<div className={classes.whatYouGet}>
						<Typography variant="body2" gutterBottom>
							What you get
						</Typography>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
							spacing={0}
						>
							<div
								className={classes.description}
								dangerouslySetInnerHTML={{
									__html: sanitize(description)
								}}
							/>
							<div className={classes.descriptionHelp}>
								<p>Time to form: {timeToForm} week(s).</p>
								<p>
									All our incorporation services include a yearly consulting
									session, a dedicated account manager and access to our global
									network of trusted business services, including introductions to
									accountants, financial, tax and legal advisors at no cost.
								</p>
							</div>
						</Grid>
					</div>
					<div className={classes.howItWorks}>
						<Typography variant="body2" gutterBottom>
							How the service works
						</Typography>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
							spacing={0}
						>
							<div className={classes.howItWorksBox}>
								<header>
									<span>1</span>
									<Typography variant="h4" gutterBottom>
										Provide initial documents
									</Typography>
								</header>
								<div>
									<Typography variant="h3" gutterBottom>
										{initialDocsText}
									</Typography>
								</div>
							</div>
							<div className={classes.howItWorksBox}>
								<header>
									<span>2</span>
									<Typography variant="h4" gutterBottom>
										KYC Process
									</Typography>
								</header>
								<div>
									<Typography variant="h3" gutterBottom>
										{kycProcessText}
									</Typography>
								</div>
							</div>
							<div className={classes.howItWorksBox}>
								<header>
									<span>3</span>
									<Typography variant="h4" gutterBottom>
										Get final documents
									</Typography>
								</header>
								<div>
									<Typography variant="h3" gutterBottom>
										{getFinalDocsText}
									</Typography>
								</div>
							</div>
						</Grid>
					</div>
					<div className={classes.serviceCost}>
						<Typography variant="body2" gutterBottom>
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
