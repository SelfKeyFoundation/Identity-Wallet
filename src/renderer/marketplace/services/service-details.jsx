import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Grid, Divider, FormGroup, FormControl, Button, Typography } from '@material-ui/core';
import { KycRequirements } from '../../kyc';
import { kycOperations } from 'common/kyc';
import { push } from 'connected-react-router';

import Truncate from 'react-truncate';

const styles = theme => ({
	root: {
		width: '946px',
		height: '100%',
		margin: '50px auto 30px',
		borderRadius: '4px'
	},

	title: {
		margin: '20px'
	},

	icon: {
		marginLeft: '20px'
	},

	header: {
		backgroundColor: '#2a3540',
		border: '1px solid #303C49',
		borderRadius: '4px 4px 0 0'
	},

	body: {
		backgroundColor: '#262F39',
		border: '1px solid #303C49',
		borderRadius: '0 0 4px 4px',
		borderTop: 0,
		color: '#fff',
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '16px',
		fontWeight: 400,
		lineHeight: 1.67,
		// margin: '20px',
		margin: 0,
		padding: '16px',
		textAlign: 'justify',
		width: '100%'
	},

	formControl: {
		marginRight: '100px'
	},

	divider: {
		backgroundColor: '#475768'
	},

	dividerWrapper: {
		width: '100%'
	},

	fullWidth: {
		width: '100%'
	},

	formGroup: {
		backgroundColor: 'transparent',
		'& span': {
			fontSize: '14px',
			lineHeight: '35px',
			'& h5': {
				display: 'inline'
			},
			'& p': {
				display: 'inline'
			}
		},

		'& span strong': {
			fontSize: '16px'
		}
	},

	bullet: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '30px',
		height: '28px',
		borderRadius: '18px',
		backgroundColor: '#3b4b59',
		border: 'solid 1px #495b70'
	},

	description: {
		marginTop: '0px',
		textAlign: 'left',
		maxWidth: '620px'
	},

	buttonWrapper: {
		marginRight: '30px'
	},

	button: {
		color: '#93b0c1',
		border: '1px solid #3b4a5a',
		fontWeight: 400,
		'&:disabled': {
			color: '#48565f'
		}
	},

	buttonDescription: {
		fontSize: '12px',
		width: '100%'
	},

	requirementListItem: {
		columnBreakInside: 'avoid',
		color: '#93b0c1'
	},

	requirementList: {
		columnCount: 2
	},

	notEnteredRequeriment: {
		height: '28px',
		width: '30px',
		borderRadius: '18px',
		backgroundColor: '#F5A623'
	},

	bold: {
		fontWeight: 600
	},

	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},

	descriptionContainer: {
		width: '100%'
	},

	bottomSpace: {
		marginBottom: '20px'
	},

	exchange: {
		paddingTop: '3px'
	},
	strong: {
		fontWeight: '600'
	},
	kyc: {
		'& div:first-child': {
			marginTop: 0
		}
	}
});

class MarketplaceServiceDetailsComponent extends Component {
	state = {
		isDescriptionTruncated: true
	};

	handleViewAllDetails() {
		this.setState({ isDescriptionTruncated: !this.state.isDescriptionTruncated });
	}

	renderDescription(description) {
		if (this.state.isDescriptionTruncated) {
			return <Truncate lines={5}>{description}</Truncate>;
		}

		return description;
	}

	handleSignup = () => {
		const { item, templates, wallet } = this.props;

		if (!wallet.isSetupFinished) {
			return this.props.dispatch(push('/main/marketplace-selfkey-id-required'));
		}

		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				item.name,
				templates[0],
				'/main/kyc/application-in-progress',
				`/main/marketplace-services/${item.name}`,
				`${item.name} Application Checklist:`,
				`You are about to begin the application process for ${
					item.name
				}. Please double check your
				required documents. Failure to do so
				will result in delays in the application process. You may also be asked to provide
				more information by the service provider`,
				'conducting KYC',
				item.name,
				item.privacyPolicy,
				item.termsOfService
			)
		);
	};

	render() {
		const { classes, item, backAction, relyingPartyName, templates } = this.props;

		return (
			<Grid container>
				<Grid item>
					<div className={classes.backButtonContainer}>
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							onClick={backAction}
						>
							<Typography
								variant="subtitle2"
								color="secondary"
								className={classes.bold}
							>
								‹ Back
							</Typography>
						</Button>
					</div>
				</Grid>
				<Grid container className={classes.root}>
					<Grid
						container
						id="header"
						direction="row"
						justify="flex-start"
						alignItems="center"
						className={classes.header}
					>
						<Grid item id="icon" className={classes.icon}>
							<img src={item.logo[0].url} />
						</Grid>
						<Grid item id="title" className={classes.title}>
							<Grid container alignItems="center">
								<Typography variant="h1">{item.name}</Typography>
								<Typography variant="h1">&nbsp;</Typography>
								<Typography
									variant="subtitle2"
									color="secondary"
									className={classes.exchange}
								>
									- Exchange
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item id="body" className={classes.body}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={32}
						>
							<Grid
								item
								id="description"
								xs={12}
								className={classes.descriptionContainer}
							>
								<Grid
									container
									direction="row"
									justify="center"
									alignItems="flex-start"
									spacing={40}
								>
									<Grid item xs={8}>
										<Typography variant="body1" className={classes.bottomSpace}>
											{this.renderDescription(item.description)}
										</Typography>
										<Button
											variant="outlined"
											className={`${classes.button} ${
												classes.buttonDescription
											}`}
											onClick={() => this.handleViewAllDetails()}
										>
											{this.state.isDescriptionTruncated
												? 'VIEW ALL DETAILS'
												: 'COLLAPSE DETAILS'}
										</Button>
									</Grid>
									<Grid item xs={4}>
										<Button
											disabled={['pending', 'Inactive'].includes(item.status)}
											variant="contained"
											size="large"
											onClick={this.handleSignup}
										>
											SIGN UP
										</Button>
									</Grid>
								</Grid>
							</Grid>
							<Grid item className={classes.dividerWrapper}>
								<Divider className={classes.divider} />
							</Grid>
							<Grid item id="highlights" className={classes.fullWidth}>
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<Grid item>
										<Typography variant="h2">Exchange Highlights</Typography>
									</Grid>
									<Grid item>
										<FormControl className={classes.formControl}>
											<FormGroup className={classes.formGroup}>
												<span>
													<Typography variant="h5">Location:</Typography>{' '}
													<Typography variant="body2">
														{item.location}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">
														Year Launched:
													</Typography>{' '}
													<Typography variant="body2">
														{item.year_launched}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">
														Coin Pairs:
													</Typography>{' '}
													<Typography variant="body2">
														{item.coin_pairs}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">Maker Fee:</Typography>{' '}
													<Typography variant="body2">
														{item.maker_fee}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">Taker Fee:</Typography>{' '}
													<Typography variant="body2">
														{item.taker_fee}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">URL:</Typography>{' '}
													<Typography variant="body2">
														{item.url}{' '}
													</Typography>
												</span>
											</FormGroup>
										</FormControl>
										<FormControl className={classes.formControl}>
											<FormGroup className={classes.formGroup}>
												<span>
													<Typography variant="h5">
														FIAT Payment:
													</Typography>{' '}
													<Typography variant="body2">
														{item.fiat_payments}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">
														FIAT Supported:
													</Typography>{' '}
													<Typography variant="body2">
														{item.fiat_supported
															? item.fiat_supported
																	.toString()
																	.replace(/,/g, ' ')
															: ''}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">
														Margin Trading:
													</Typography>{' '}
													<Typography variant="body2">
														{item.margin_trading}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">KYC/AML:</Typography>{' '}
													<Typography variant="body2">
														{item.kyc_aml}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">
														Excluded Resident:
													</Typography>{' '}
													<Typography variant="body2">
														{item.excluded_residents}{' '}
													</Typography>
												</span>
												<span>
													<Typography variant="h5">Contact:</Typography>{' '}
													<Typography variant="body2">
														{item.email}{' '}
													</Typography>
												</span>
											</FormGroup>
										</FormControl>
									</Grid>
								</Grid>
							</Grid>
							{templates[0] && (
								<Grid item id="requirements" className={classes.fullWidth}>
									<Grid
										container
										direction="column"
										justify="flex-start"
										alignItems="flex-start"
										spacing={16}
									>
										<Grid
											item
											style={{ width: '100%' }}
											className={classes.kyc}
										>
											<KycRequirements
												relyingPartyName={relyingPartyName}
												templateId={templates[0]}
											/>
										</Grid>
									</Grid>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const MarketplaceServiceDetails = withStyles(styles)(MarketplaceServiceDetailsComponent);

export default MarketplaceServiceDetails;
