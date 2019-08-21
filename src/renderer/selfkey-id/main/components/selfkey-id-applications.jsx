import React, { Component } from 'react';
import config from 'common/config';
import {
	Button,
	Card,
	CardContent,
	Typography,
	ExpansionPanel,
	ExpansionPanelSummary,
	Grid,
	Divider,
	ExpansionPanelDetails,
	List,
	ListItem,
	createStyles,
	withStyles
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
	KeyTooltip,
	TooltipArrow,
	CheckMaIcon,
	DeniedIcon,
	HourGlassIcon,
	SimpleCheckIcon,
	SimpleDeniedIcon,
	SimpleHourglassIcon,
	AttributeAlertLargeIcon,
	NewRefreshIcon,
	MarketplaceIcon,
	success,
	warning,
	typography,
	error
} from 'selfkey-ui';
import moment from 'moment';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { kycSelectors, kycOperations, kycActions } from 'common/kyc';
import { Popup } from '../../../common/popup';
import { appSelectors } from 'common/app';

const styles = theme => ({
	statusIcon: {
		width: '36px !important',
		height: '36px !important'
	},
	type: {
		paddingRight: '10px'
	},
	label: {
		minWidth: '130px',
		paddingRight: '20px'
	},
	statusInfoWrap: {
		padding: '30px 24px'
	},
	statusInfo: {
		width: '100%'
	},
	headerIcon: {
		marginRight: '13px'
	},
	list: {
		paddingLeft: 0,
		paddingRight: 0
	},
	listItem: {
		alignItems: 'baseline',
		padding: 0
	},
	noRightPadding: {
		paddingRight: '0 !important'
	},
	title: {
		padding: '16px'
	},
	next: {
		marginBottom: '50px',
		marginLeft: '20px',
		minWidth: '120px'
	},
	marketplaceIcon: {
		'& svg': {
			height: '55px !important',
			marginLeft: '-30px',
			width: '68px !important'
		}
	},
	cardItem: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center'
	},
	cardHeader: {
		padding: '30px'
	},
	loading: {
		marginTop: '5em'
	}
});

const statusInfoStyle = theme =>
	createStyles({
		defaultStatus: {
			border: `1px solid ${success}`,
			borderRadius: '4px',
			boxSizing: 'border-box',
			padding: '25px 30px'
		},
		grow: {
			flexGrow: 1
		},
		statusIcon: {
			marginRight: '25px'
		},
		iconContainer: {
			marginRight: '25px',
			textAlign: 'center',
			width: '38px'
		},
		attribute: {
			height: '45px',
			width: '38px'
		},
		statusWrap: {
			width: '100%',
			'& .required': {
				border: `1px solid ${warning}`
			},
			'& .submitted': {
				border: `1px solid ${typography}`
			},
			'& .denied': {
				border: `1px solid ${error}`
			}
		},
		refresh: {
			cursor: 'pointer',
			marginLeft: '30px'
		}
	});

const StatusInfo = withStyles(statusInfoStyle)(
	({ classes, status, onClick, handleRefresh, tooltip, loading }) => {
		let icon;
		let message;
		let statusStyle;
		let button = null;
		switch (status) {
			case 2:
				icon = <SimpleCheckIcon className={classes.statusIcon} />;
				message =
					'Application completed. Please check your email to receive relevant documents and information.';
				break;
			case 3:
			case 7:
			case 8:
				icon = <SimpleDeniedIcon className={classes.statusIcon} />;
				message = 'Application denied. Please check your email for the reject reason.';
				statusStyle = 'denied';
				break;
			case 9:
				icon = <AttributeAlertLargeIcon className={classes.statusIcon} />;
				message = 'Application pending. Missing required documents.';
				button = (
					<Button variant="contained" size="large" onClick={onClick} disabled={loading}>
						{loading ? 'Loading' : 'Complete Application'}
					</Button>
				);
				statusStyle = 'required';
				break;
			default:
				icon = <SimpleHourglassIcon className={classes.statusIcon} />;
				message = 'Application started. Please check your email for further instructions.';
				statusStyle = 'submitted';
				break;
		}

		return (
			<div className={classes.statusWrap}>
				<Grid item className={classNames(classes.defaultStatus, status, statusStyle)}>
					<Grid
						container
						direction="row"
						justify="space-between"
						alignItems="center"
						wrap="nowrap"
					>
						<Grid item className={classes.iconContainer}>
							{icon}
						</Grid>
						<Grid item className={classes.grow}>
							<Typography variant="h2">Status</Typography>
							<Typography variant="subtitle2" color="secondary">
								{message}
							</Typography>
						</Grid>
						<Grid item>{button || <span />}</Grid>
						<Grid item style={{ height: '23px' }}>
							{status !== 2 && (
								<KeyTooltip
									interactive
									placement="top-start"
									title={
										<React.Fragment>
											<span>{tooltip}</span>
											<TooltipArrow />
										</React.Fragment>
									}
								>
									<span
										className={classes.refresh}
										onClick={handleRefresh}
										disabled={loading}
									>
										<NewRefreshIcon />
									</span>
								</KeyTooltip>
							)}
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
);

const HeaderIcon = withStyles(styles)(({ status, classes }) => {
	let icon = null;
	/* Check KYC Status here: https://confluence.kyc-chain.com/display/DEV/KYC+Process+Statuses
	 *	 1 In progress: HourGlassIcon
	 *	 2 Approved: CheckMaIcon
	 *	 3 Rejected: DeniedIcon
	 *	 4 Uploaded: HourGlassIcon
	 *	 5 Invited: HourGlassIcon
	 *	 6 User processing: HourGlassIcon
	 *	 7 User declined: DeniedIcon
	 *	 8 Cancelled: DeniedIcon
	 *	 9 Additional requested: HourGlassIcon
	 *	10 Corporate details: HourGlassIcon
	 *	11 User processing requirement: HourGlassIcon
	 *	12 Partially approved: HourGlassIcon
	 *	13 Send tokens: HourGlassIcon
	 *	14 Manager assigned: HourGlassIcon
	 */
	switch (status) {
		case 2:
			icon = <CheckMaIcon className={classes.headerIcon} />;
			break;
		case 3:
		case 7:
		case 8:
			icon = <DeniedIcon className={classes.headerIcon} />;
			break;
		default:
			icon = <HourGlassIcon />;
	}
	return icon;
});

const getRpInfo = (rpName, field) => {
	return config.relyingPartyInfo[rpName][field];
};

const getRpName = title => {
	return title.toLowerCase().startsWith('bank account') ? 'Bank Accounts' : 'Incorporations';
};

const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';

class SelfkeyIdApplicationsComponent extends Component {
	state = {
		loading: false,
		applicationId: null,
		addingDocuments: false,
		rpName: null,
		refreshing: false,
		showApplicationRefreshModal: false
	};

	async componentDidMount() {
		const { rp, afterAuthRoute } = this.props;
		const cancelRoute = `/main/selfkeyId`;
		const authenticate = true;

		await this.props.dispatch(kycOperations.resetApplications());
		// if relying party not loaded, try again
		if (!rp || !rp.authenticated) {
			this.setState({ loading: true }, async () => {
				await this.props.dispatch(kycOperations.setProcessing(true));
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticate,
						afterAuthRoute,
						cancelRoute
					)
				);
			});
		}

		// try to load existing kyc_applications data
		await this.props.dispatch(kycOperations.loadApplicationsOperation());

		// this is needed otherwise the rp keeps loading (stuck)
		if (!this.props.incorporations || !this.props.incorporations.length) {
			await this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.rp !== this.props.rp) {
			if (this.props.rp.authenticated) {
				await this.props.dispatch(kycOperations.loadApplicationsOperation());
			}
			this.setState({ loading: false }, () => {
				if (this.state.refreshing) {
					if (this.state.applicationId) {
						// try to refresh again after loading relying party
						this.handleApplicationRefresh(this.state.applicationId);
					}
				}
				if (this.state.addingDocuments) {
					if (this.state.applicationId) {
						// try to refresh again after loading relying party
						this.handleApplicationAddDocuments(
							this.state.applicationId,
							this.state.rpName
						);
					}
				}
			});
		}
	}

	handleApplicationAddDocuments = (id, rpName) => {
		const { rp, afterAuthRoute } = this.props;
		const cancelRoute = `/main/selfkeyId`;
		const authenticate = true;

		// if relying party not loaded, try again
		if (!rp || !rp.authenticated) {
			this.setState(
				{ loading: true, addingDocuments: true, applicationId: id, rpName },
				async () => {
					await this.props.dispatch(
						kycOperations.loadRelyingParty(
							'incorporations',
							authenticate,
							afterAuthRoute,
							cancelRoute
						)
					);
				}
			);
		} else {
			let self = this;
			this.setState(
				{
					loading: false,
					addingDocuments: false,
					applicationId: null,
					rpName: null
				},
				async () => {
					// Get current application info from kyc
					let currentApplication = self.props.rp.applications.find(app => {
						return app.id === id;
					});
					// get stored application from local database
					let application = this.props.applications.find(app => {
						return app.id === id;
					});
					const {
						template,
						vendor,
						privacyPolicy,
						termsOfService,
						attributes
					} = currentApplication;
					const { rpName, title } = application;
					/* eslint-disable camelcase */
					const description = application.sub_title;
					/* eslint-enable camelcase */
					const agreement = true;

					// Set application data
					await self.props.dispatch(
						kycActions.setCurrentApplication(
							rpName,
							template,
							afterAuthRoute,
							cancelRoute,
							title,
							description,
							agreement,
							vendor,
							privacyPolicy,
							termsOfService,
							attributes
						)
					);

					// Open add documents modal
					// (Later on, we will need to improve this to be able to distinguish requirements
					// that can be fulfilled by the wallet and ones that need redirect to KYCC.)
					//
					// await self.props.dispatch(
					// 	kycOperations.loadRelyingParty(
					// 		rpName,
					// 		true,
					// 		`/main/kyc/current-application/${rpName}?applicationId=${id}`
					// 	)
					// );

					// Redirects to KYCC chain on an external browser window with auto-login
					const instanceUrl = self.props.rp.session.ctx.config.rootEndpoint;
					const url = `${instanceUrl}/applications/${application.id}?access_token=${
						self.props.rp.session.access_token.jwt
					}`;
					window.openExternal(null, url);
				}
			);
		}
	};

	handleApplicationRefresh = id => {
		const { afterAuthRoute } = this.props;
		const cancelRoute = `/main/selfkeyId`;
		const authenticate = true;

		// if relying party not loaded, try again
		if (!this.state.refreshing) {
			this.setState({ loading: true, refreshing: true, applicationId: id }, async () => {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticate,
						afterAuthRoute,
						cancelRoute
					)
				);
			});
		} else {
			// get stored application from local database
			let application = this.props.applications.find(app => {
				return app.id === id;
			});
			// get current application info from kyc
			let kycApplication = this.props.rp.applications.find(app => {
				return app.id === id;
			});

			if (application && kycApplication) {
				// update stored application
				application.currentStatus = kycApplication.currentStatus;
				application.currentStatusName = kycApplication.statusName;
				application.updatedAt = kycApplication.updatedAt;
			}

			// sync of RP applications with local database is done automatically, all done, show modal
			this.setState({
				refreshing: false,
				applicationId: null,
				showApplicationRefreshModal: true
			});
		}
	};

	renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	handleCloseApplicationRefreshModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showApplicationRefreshModal: false });
	};

	renderApplicationRefreshModal() {
		const { classes } = this.props;
		return (
			<Popup
				open={true}
				text={'Update Application'}
				closeAction={this.handleCloseApplicationRefreshModal}
			>
				<Grid
					container
					className={classes.root}
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="overline">
							Application status updated successfully.
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									onClick={this.handleCloseApplicationRefreshModal}
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}

	handleAccessClick = _ => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	render() {
		const { classes, isLoading, processing } = this.props;
		const { showApplicationRefreshModal } = this.state;
		let loading = isLoading || processing || this.state.loading;

		if (loading) {
			return this.renderLoadingScreen();
		}

		if (!loading && this.props.applications && this.props.applications.length === 0) {
			return (
				<Grid container spacing={32}>
					<Grid item xs={12}>
						<Card>
							<Grid container direction="row" className={classes.cardHeader}>
								<Grid
									item
									xs={2}
									className={`${classes.cardItem} ${classes.marketplaceIcon}`}
								>
									<MarketplaceIcon />
								</Grid>
								<Grid item xs={10}>
									<Typography variant="h1" gutterBottom>
										You {"haven't"} applied for any service in the Marketplace
									</Typography>
									<Typography variant="body1" color="secondary" gutterBottom>
										Once you apply to a service in the marketplace, you will be
										able to manage it from this area.
									</Typography>
								</Grid>
							</Grid>
							<Grid container direction="row">
								<Grid item xs={2} className={classes.cardItem} />
								<Grid item xs={10}>
									<Button
										id="marketplace"
										variant="contained"
										onClick={this.handleAccessClick}
										className={classes.next}
										size="large"
									>
										Access Marketplace
									</Button>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
			);
		}

		return (
			<React.Fragment>
				{this.props.applications &&
					this.props.applications.map((item, index) => (
						<React.Fragment key={item.id}>
							<ExpansionPanel defaultExpanded={index === 0}>
								<ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="baseline"
									>
										<Typography variant="h2" className={classes.type}>
											{/* Until the scheduler (and associate vendor airtable) is released, we are going to use
											  the application's title because we are using the same rpName for BAM and Incorporations. */}
											{/* {item.rpName.charAt(0).toUpperCase() +
												item.rpName.slice(1)} */}
											{getRpName(item.title)}
										</Typography>
										<Typography variant="subtitle2" color="secondary">
											-{' '}
											{item.title.charAt(0).toUpperCase() +
												item.title.slice(1)}
										</Typography>
									</Grid>
									<Grid
										container
										direction="row"
										justify="flex-end"
										alignItems="center"
										className={classes.noRightPadding}
									>
										<HeaderIcon status={item.currentStatus} />
										<Typography variant="subtitle2" color="secondary">
											{item.currentStatusName}
										</Typography>
									</Grid>
								</ExpansionPanelSummary>
								<Divider />
								<Grid
									className={classes.statusInfoWrap}
									container
									direction="row"
									alignItems="center"
								>
									<StatusInfo
										status={item.currentStatus}
										onClick={() =>
											this.handleApplicationAddDocuments(item.id, item.rpName)
										}
										handleRefresh={() => this.handleApplicationRefresh(item.id)}
										tooltip={moment(new Date(item.updatedAt)).format(
											'DD MMM YYYY'
										)}
										loading={loading}
									/>
								</Grid>
								<ExpansionPanelDetails>
									<Grid container spacing={32}>
										<Grid item xs>
											<Card>
												<Typography variant="h2" className={classes.title}>
													Application Details
												</Typography>
												<Divider variant="middle" />
												<CardContent>
													<List className={classes.list}>
														<ListItem
															key="applicationDate"
															className={classes.listItem}
														>
															<Typography
																variant="body2"
																color="secondary"
																className={classes.label}
															>
																Application Date
															</Typography>
															<Typography variant="body2">
																{moment(
																	item.applicationDate
																).format('DD MMM YYYY')}
															</Typography>
														</ListItem>
														<ListItem
															key="serviceProvider"
															className={classes.listItem}
														>
															<Typography
																variant="body2"
																color="secondary"
																className={classes.label}
															>
																Service Provider
															</Typography>
															<Typography variant="body2">
																{getRpInfo(item.rpName, 'name')}
															</Typography>
														</ListItem>
														<ListItem
															key="providerContact"
															className={classes.listItem}
														>
															<Typography
																variant="body2"
																color="secondary"
																className={classes.label}
															>
																Provider Contact
															</Typography>
															<Typography variant="body2">
																{getRpInfo(item.rpName, 'email')}
															</Typography>
														</ListItem>
														<ListItem
															key="address"
															className={classes.listItem}
														>
															<Typography
																variant="body2"
																color="secondary"
																className={classes.label}
															>
																Address
															</Typography>
															<Typography variant="body2">
																{getRpInfo(item.rpName, 'address')}
															</Typography>
														</ListItem>
													</List>
												</CardContent>
											</Card>
										</Grid>
										{item.payments && Object.keys(item.payments).length > 0 && (
											<Grid item xs>
												<Card>
													<Typography
														variant="h2"
														className={classes.title}
													>
														Payment Details
													</Typography>
													<Divider variant="middle" />
													<CardContent>
														<List className={classes.list}>
															<ListItem
																key="transactionId"
																className={classes.listItem}
															>
																<Typography
																	variant="body2"
																	color="secondary"
																	className={classes.label}
																>
																	Transaction ID
																</Typography>
																<Typography variant="body2">
																	{item.payments.transactionHash}
																</Typography>
															</ListItem>
															<ListItem
																key="transactionDate"
																className={classes.listItem}
															>
																<Typography
																	variant="body2"
																	color="secondary"
																	className={classes.label}
																>
																	Transaction Date
																</Typography>
																<Typography variant="body2">
																	{item.payments &&
																		moment(
																			item.payments
																				.transactionDate
																		).format('DD MMM YYYY')}
																</Typography>
															</ListItem>
															<ListItem
																key="amount"
																className={classes.listItem}
															>
																<Typography
																	variant="body2"
																	color="secondary"
																	className={classes.label}
																>
																	Amount
																</Typography>
																<Typography variant="body2">
																	{item.payments.amountKey}
																</Typography>
															</ListItem>
															<ListItem
																key="paymentStatus"
																className={classes.listItem}
															>
																<Typography
																	variant="body2"
																	color="secondary"
																	className={classes.label}
																>
																	Payment Status
																</Typography>
																<Typography variant="body2">
																	{item.payments.status}
																</Typography>
															</ListItem>
														</List>
													</CardContent>
												</Card>
											</Grid>
										)}
									</Grid>
								</ExpansionPanelDetails>
							</ExpansionPanel>
							<br />
						</React.Fragment>
					))}
				{showApplicationRefreshModal && this.renderApplicationRefreshModal()}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const notAuthenticated = false;
	const walletType = appSelectors.selectApp(state).walletType;
	const afterAuthRoute =
		walletType === 'ledger' || walletType === 'trezor' ? `/main/selfkeyIdApplications` : '';
	return {
		wallet: walletSelectors.getWallet(state),
		isLoading: incorporationsSelectors.getLoading(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			notAuthenticated
		),
		applications: kycSelectors.selectApplications(state),
		processing: kycSelectors.selectProcessing(state),
		afterAuthRoute
	};
};

export const SelfkeyIdApplications = connect(mapStateToProps)(
	withStyles(styles)(SelfkeyIdApplicationsComponent)
);

export default SelfkeyIdApplications;
