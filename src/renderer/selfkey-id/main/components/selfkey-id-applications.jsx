import React, { PureComponent } from 'react';
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
import moment from 'moment';
import { Popup } from '../../../common/popup';
import MessageContainer from './message-container';
import HeaderIcon from '../../../common/header-icon';

const styles = theme => ({
	statusIcon: {
		width: '36px !important',
		height: '36px !important'
	},
	type: {
		paddingRight: theme.spacing(1)
	},
	label: {
		minWidth: '130px',
		paddingRight: theme.spacing(3)
	},
	statusInfoWrap: {
		padding: theme.spacing(4, 3)
	},
	statusInfo: {
		width: '100%'
	},
	headerIcon: {
		marginRight: theme.spacing(2)
	},
	list: {
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(0)
	},
	listItem: {
		alignItems: 'baseline',
		padding: theme.spacing(0)
	},
	noRightPadding: {
		paddingRight: '0 !important'
	},
	title: {
		padding: theme.spacing(2)
	},
	next: {
		marginBottom: theme.spacing(6),
		marginLeft: theme.spacing(2),
		minWidth: '120px'
	},
	marketplaceIcon: {
		'& svg': {
			height: '55px !important',
			marginLeft: theme.spacing(-4),
			width: '68px !important'
		}
	},
	cardItem: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center'
	},
	cardHeader: {
		padding: theme.spacing(4)
	},
	loading: {
		marginTop: theme.spacing(10)
	}
});

const statusInfoStyle = theme =>
	createStyles({
		defaultStatus: {
			border: `1px solid ${success}`,
			borderRadius: '4px',
			boxSizing: 'border-box',
			padding: theme.spacing(3, 4)
		},
		grow: {
			flexGrow: 1
		},
		statusIcon: {
			marginRight: theme.spacing(3)
		},
		iconContainer: {
			marginRight: theme.spacing(3),
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
			marginLeft: theme.spacing(4)
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

class SelfkeyIdApplicationsComponent extends PureComponent {
	renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	renderApplicationRefreshModal = () => (
		<Popup
			open={true}
			text={'Update Application'}
			closeAction={this.props.onCloseApplicationRefreshModal}
		>
			<Grid
				container
				className={this.props.classes.root}
				spacing={4}
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
					<Grid container spacing={3}>
						<Grid item>
							<Button
								variant="outlined"
								size="large"
								onClick={this.props.onCloseApplicationRefreshModal}
							>
								Close
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);

	render() {
		const { classes, showApplicationRefreshModal, loading, applications, vendors } = this.props;

		const getRpInfo = (rpName, field) => {
			const vendor = vendors.find(v => v.vendorId === rpName);
			if (vendor && vendor[field]) {
				return vendor[field];
			} else {
				return 'N/A';
			}
		};

		const getRpName = application => getRpInfo(application.rpName, 'name');

		if (loading) {
			return this.renderLoadingScreen();
		}

		if (!loading && applications && applications.length === 0) {
			return (
				<Grid container spacing={4}>
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
										onClick={this.props.onMarketplaceAccessClick}
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
										application={item}
										status={item.currentStatus}
										onClick={() =>
											this.props.onApplicationAdditionalRequirements(item)
										}
										handleRefresh={() => this.props.onApplicationRefresh(item)}
										tooltip={moment(new Date(item.updatedAt)).format(
											'DD MMM YYYY'
										)}
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
															key="chatr"
															className={classes.listItem}
														>
															<Typography
																variant="body2"
																color="secondary"
																className={classes.label}
															>
																Chats
															</Typography>
															<Typography variant="body2">
																{item.messages}
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
																{getRpInfo(
																	item.rpName,
																	'contactEmail'
																)}
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
													<MessageContainer messages={item.messages} />
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

export const SelfkeyIdApplications = withStyles(styles)(SelfkeyIdApplicationsComponent);

export default SelfkeyIdApplications;
