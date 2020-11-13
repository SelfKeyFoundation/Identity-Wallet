import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { MarketplaceKycRequirements } from '../../common/marketplace-kyc-requirements';
import { BackButton, DefiIcon } from 'selfkey-ui';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';

const styles = theme => ({
	pageContent: {
		width: '1074px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	title: {
		padding: '22px 30px',
		background: '#2A3540'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
	content: {
		background: '#262F39',
		padding: '45px 30px 50px',
		width: '100%',
		justifyContent: 'space-between',
		boxSizing: 'border-box',
		margin: 0
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	},
	ctabutton: {
		backgroundColor: '#1E262E',
		display: 'flex',
		justifyContent: 'space-between',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '1em',
		position: 'relative',
		width: '100%',
		zIndex: 1,
		'& span': {
			flexGrow: 1
		},
		'& svg': {
			width: '24px !important',
			height: '24px !important',
			fill: 'white !important'
		},
		'& svg g': {
			fill: 'white !important'
		}
	},
	priceRow: {
		display: 'grid',
		gridTemplateColumns: '1fr max-content 1fr',
		paddingTop: '20px',
		alignItems: 'center',

		'& > div': {
			padding: '1em'
		},

		'& div.price': {
			color: '#00C0D9',
			fontWeight: 'bold',
			textAlign: 'left',
			'& .amount-in-crypto': {
				marginTop: '5px'
			},
			border: '1px solid #262F39',
			borderRadius: '5px',
			cursor: 'pointer',
			'&:hover': {
				border: '1px solid #aaa'
			}
		},
		'& div.price.selected': {
			border: '1px solid #00C0D9',
			'&:hover': {
				border: '1px solid #00C0D9'
			}
		},
		'& div.amount-in-crypto': {
			color: theme.palette.secondary.main,
			fontSize: '13px'
		},
		'& .transactionFee': {
			color: theme.palette.secondary.main
		},
		'& div.price:last-child': {
			textAlign: 'right'
		}
	},
	feeRow: {
		color: '#00C0D9',
		fontWeight: 'bold',
		textAlign: 'left',
		display: 'flex',
		margin: '1em 0',
		alignItems: 'center',
		padding: '0 1em',
		justifyContent: 'space-between',
		'& .amount-in-crypto': {
			color: theme.palette.secondary.main,
			fontSize: '13px'
		}
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
	whatYouGet: {
		'& p': {
			maxWidth: 'calc(100% - 10px)',
			marginBottom: '1em'
		}
	},
	status: {
		alignItems: 'center',
		backgroundColor: '#262F39',
		'& p': {
			display: 'inline-block'
		},
		'& svg': {
			verticalAlign: 'middle'
		}
	}
});

const howItWorksstyles = theme => ({
	howItWorks: {
		marginTop: '40px'
	},
	howItWorksBox: {
		width: '30%',
		padding: '2em 3%',
		margin: '2em 0',
		color: '#FFF',
		minHeight: '250px',
		background: '#313D49',
		'& header': {
			display: 'flex'
		},
		'& header h4': {
			display: 'inline-block',
			marginLeft: '0.5em',
			fontSize: '16px'
		},
		'& header span': {
			color: '#00C0D9',
			fontWeight: 'bold',
			fontSize: '20px',
			lineHeight: '26px'
		},
		'& h3': {
			fontSize: '13px'
		}
	}
});

const KeyFiHowServiceWorks = withStyles(howItWorksstyles)(({ classes }) => {
	return (
		<div className={classes.howItWorks}>
			<Typography variant="h2">DeFi Process</Typography>
			<Grid container direction="row" justify="space-between" alignItems="center" spacing={0}>
				<div className={classes.howItWorksBox}>
					<header>
						<span>1</span>
						<Typography variant="h4" gutterBottom>
							Provide Standard Details About Yourself
						</Typography>
					</header>
					<div>
						<Typography variant="h3" gutterBottom>
							Provide few standard information about yourself and documents
							substantiating that information.
						</Typography>
					</div>
				</div>
				<div className={classes.howItWorksBox}>
					<header>
						<span>2</span>
						<Typography variant="h4" gutterBottom>
							Get your Credentials Verified
						</Typography>
					</header>
					<div>
						<Typography variant="h3" gutterBottom>
							A trusted third party will verify your data through a one-time process
							without storing or retrieving your data.
						</Typography>
					</div>
				</div>
				<div className={classes.howItWorksBox}>
					<header>
						<span>3</span>
						<Typography variant="h4" gutterBottom>
							Access KeyFi.ai and Earn Rewards
						</Typography>
					</header>
					<div>
						<Typography variant="h3" gutterBottom>
							Once your Credentials are verified, you will be eligible to claim a
							limited-period KEY airdrop, and can access and use KeyFi.ai to earn
							rewards.
						</Typography>
					</div>
				</div>
			</Grid>
		</div>
	);
});

const KeyFiCheckout = withStyles(styles)(
	({
		classes,
		title,
		price,
		ethPrice,
		keyPrice,
		keyAmount,
		ethAmount,
		usdFee,
		ethFee,
		onBackClick,
		onStartClick,
		onSelectCrypto,
		kycRequirements,
		loading,
		templateId,
		cryptoCurrency,
		applicationStatus,
		onStatusAction,
		primaryToken
	}) => (
		<Grid container>
			<Grid item className={classes.backButtonContainer}>
				<BackButton onclick={onBackClick} />
			</Grid>
			<Grid item className={classes.container}>
				<Grid
					id="keyFiCheckout"
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.title}
				>
					<Typography variant="h1" className={classes.headerTitle}>
						{title}
					</Typography>
				</Grid>
				<Grid container className={classes.contentContainer}>
					<Grid
						container
						justify="flex-start"
						alignItems="center"
						className={classes.content}
					>
						<Grid container className={classes.serviceCost}>
							<Grid item className={classes.whatYouGet} xs={8}>
								<Typography variant="body2" gutterBottom>
									<p>
										Investing and managing in DeFi has its complexity. With
										multiple DeFi platforms, this complexity tends to increase
										exponentially.
									</p>
									<p>
										KeyFi.ai is a first of its kind DeFi aggregator platform
										that lets you manage your investments among the top DeFi
										protocols with ease.
									</p>
									<p>
										Powered by AI, KeyFi.ai aims to prepare the DeFi ecosystem
										for regulatory compliance with a first of its kind
										decentralized user verification system backed by SelfKey
										Credentials.
									</p>
									<p>
										Verify your Credentials now to enjoy the ease of managing
										multiple platforms, all while earning rewards and claiming a
										limited period KEY airdrop.
									</p>
								</Typography>
							</Grid>
							<Grid item xs={4}>
								<div className={classes.actions}>
									<Button
										variant="contained"
										size="large"
										onClick={onStartClick}
										disabled={!!applicationStatus || loading}
										className={classes.ctabutton}
									>
										<DefiIcon width="24px" height="24px" />
										<span>Get Credentials</span>
									</Button>
								</div>
								{price > 0 && (
									<div>
										<div className={classes.priceRow}>
											<div
												className={`rowItem price ${
													cryptoCurrency === primaryToken
														? 'selected'
														: ''
												}`}
												onClick={() => onSelectCrypto(primaryToken)}
											>
												Cost: ${keyPrice.toLocaleString()}
												<div className="amount-in-crypto">
													{keyAmount.toLocaleString()} KEY
												</div>
											</div>
											<div>Or</div>
											<div
												className={`rowItem price ${
													cryptoCurrency === 'ETH' ? 'selected' : ''
												}`}
												onClick={() => onSelectCrypto('ETH')}
											>
												Cost: ${ethPrice.toLocaleString()}
												<div className="amount-in-crypto">
													{ethAmount.toLocaleString()} ETH
												</div>
											</div>
										</div>
										<div className={classes.feeRow}>
											<div>Network Fee</div>
											<div className="amount-in-crypto">
												{ethFee.toLocaleString()} ETH
											</div>
										</div>
									</div>
								)}
							</Grid>
						</Grid>

						<ApplicationStatusBar
							status={applicationStatus}
							statusAction={onStatusAction}
							loading={loading}
							barStyle={classes.barStyle}
						/>

						<KeyFiHowServiceWorks classes={classes.howItWorks} />

						<MarketplaceKycRequirements
							requirements={kycRequirements}
							loading={loading}
							templateId={templateId}
							title="KYC Requirements and Forms"
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export { KeyFiCheckout };
export default KeyFiCheckout;
