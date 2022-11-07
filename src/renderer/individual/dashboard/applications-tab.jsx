import React, { PureComponent } from 'react';
import moment from 'moment';
import classNames from 'classnames';
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
	ListItem
} from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
	KeyTooltip,
	TooltipArrow,
	SimpleCheckIcon,
	SimpleDeniedIcon,
	SimpleHourglassIcon,
	AttributeAlertLargeIcon,
	NewRefreshIcon,
	MarketplaceIcon,
	DropdownIcon,
	success,
	warning,
	typography,
	error
} from 'selfkey-ui';
import HeaderIcon from '../../common/header-icon';
import { ApplicationMessages } from './applications-messages';

const styles = theme => ({
	statusIcon: {
		width: '36px !important',
		height: '36px !important'
	},
	type: {
		paddingRight: '10px'
	},
	label: {
		minWidth: '150px',
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
	},
	statusName: {
		marginLeft: '8px'
	},
	rpLink: {
		marginTop: '1em'
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
									TransitionProps={{ timeout: 0 }}
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

const LoadingScreen = ({ classes }) => (
	<Grid container justify="center" alignItems="center">
		<CircularProgress size={50} className={classes.loading} />
	</Grid>
);

class IndividualApplicationsTabComponent extends PureComponent {
	render() {
		const { classes, loading, applications = [], vendors, onSendMessage } = this.props;

		const getRpInfo = (rpName, field) => {
			const vendor = vendors.find(v => v.vendorId === rpName);
			return vendor && vendor[field] ? vendor[field] : 'N/A';
		};

		const getRpName = application => getRpInfo(application.rpName, 'name');

		if (loading) {
			return <LoadingScreen classes={this.props.classes} />;
		}

		if (!loading && applications && applications.length === 0) {
			return (
				<Grid container spacing={4} style={{ minHeight: '600px' }}>
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
										onClick={this.props.onMarketplaceClick}
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
				{this.props.applications.map((item, index) => (
					<React.Fragment key={item.id}>
						<ExpansionPanel defaultExpanded={index === 0}>
							<ExpansionPanelSummary expandIcon={<DropdownIcon />}>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="baseline"
								>
									<Typography variant="h2" className={classes.type}>
										{item.title}
									</Typography>
									<Typography variant="subtitle2" color="secondary">
										{getRpName(item)}
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
									<Typography
										variant="subtitle2"
										color="secondary"
										className={classes.statusName}
									>
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
									application={item}
									status={item.currentStatus}
									onClick={() =>
										this.props.onApplicationAdditionalRequirements(item)
									}
									handleRefresh={() => this.props.onApplicationRefresh(item)}
									tooltip={moment(new Date(item.updatedAt)).format('DD MMM YYYY')}
									loading={loading}
								/>
							</Grid>
							<ExpansionPanelDetails>
								<Grid container spacing={4}>
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
															{moment(item.applicationDate).format(
																'DD MMM YYYY'
															)}
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
															{getRpInfo(item.rpName, 'contactEmail')}
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
												{getRpInfo(item.rpName, 'name') === 'KeyFI' &&
													item.currentStatus === 2 && (
														<React.Fragment>
															<Divider variant="middle" />
															<Button
																className={classes.rpLink}
																variant="contained"
																onClick={() =>
																	window.openExternal(
																		null,
																		'https://keyfi.com'
																	)
																}
															>
																visit keyfi.com
															</Button>
														</React.Fragment>
													)}
											</CardContent>
										</Card>
									</Grid>
									{item.rpName === 'selfkey_certifier' && item.messages && (
										<Grid item xs>
											<Card>
												<Typography variant="h2" className={classes.title}>
													Messages
												</Typography>
												<Divider variant="middle" />
												<CardContent>
													<ApplicationMessages
														application={item}
														onSendMessage={onSendMessage}
													/>
												</CardContent>
											</Card>
										</Grid>
									)}
									{item.payments && Object.keys(item.payments).length > 0 && (
										<Grid item xs>
											<Card>
												<Typography variant="h2" className={classes.title}>
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
					</React.Fragment>
				))}
			</React.Fragment>
		);
	}
}

export const IndividualApplicationsTab = withStyles(styles)(IndividualApplicationsTabComponent);
export default IndividualApplicationsTab;
