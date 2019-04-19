import React, { Component } from 'react';
import config from 'common/config';
import {
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
	withStyles
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { CheckMaIcon, DeniedIcon, HourGlassIcon, StatusInfo } from 'selfkey-ui';
import config from 'common/config';
import moment from 'moment';

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
	}
});

const getRpInfo = (rpName, field) => {
	return config.relyingPartyInfo[rpName][field];
};

const HeaderIcon = withStyles(styles)(({ status, classes }) => {
	let icon = null;
	// Check KYC Status here: https://confluence.kyc-chain.com/display/DEV/KYC+Process+Statuses
	switch (status) {
		case 2:
			icon = <CheckMaIcon className={classes.headerIcon} />;
			break;

		case 3:
		case 8:
			icon = <DeniedIcon className={classes.headerIcon} />;
			break;

		case 1:
		case 6:
		case 9:
		case 11:
			icon = <HourGlassIcon />;
			break;

		default:
			icon = <HourGlassIcon />;
	}

	return icon;
});

// FIXME: // Check KYC Status here: https://confluence.kyc-chain.com/display/DEV/KYC+Process+Statuses and adjust accordingly
// FIXME: default should not be Documents required buy application in progress
const getStatusName = status => {
	let name = '';
	switch (status) {
		case 2:
			name = 'Approved';
			break;
		case 3:
			name = 'Denied';
			break;
		case 8:
			name = 'Denied';
			break;
		case 4:
			name = 'Documents Submitted';
			break;
		default:
			name = 'Documents Required';
	}
	return name;
};

class SelfkeyIdApplicationsComponent extends Component {
	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				{this.props.applications.map((item, index) => (
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
										{item.rpName.charAt(0).toUpperCase() + item.rpName.slice(1)}
									</Typography>
									<Typography variant="subtitle2" color="secondary">
										- {item.title}
									</Typography>
								</Grid>
								<Grid
									container
									direction="row"
									justify="flex-end"
									alignItems="center"
									className={classes.noRightPadding}
								>
									<HeaderIcon status={getStatusName(item.currentStatus)} />
									<Typography variant="subtitle2" color="secondary">
										{getStatusName(item.currentStatus)}
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
									status={getStatusName(item.currentStatus)}
									onClick={() => this.props.handleAddDocuments(item.id)}
									handleRefresh={() => this.props.handleRefresh(item.id)}
									tooltip={moment(item.updatedAt).format('DD MMM YYYY')}
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
															{item.payments &&
																item.payments.transactionHash}
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
																	item.payments.transactionDate
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
															{item.payments &&
																item.payments.amountKey}
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
															{item.payments && item.payments.status}
														</Typography>
													</ListItem>
												</List>
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</React.Fragment>
				))}
			</React.Fragment>
		);
	}
}

export const SelfkeyIdApplications = withStyles(styles)(SelfkeyIdApplicationsComponent);

export default SelfkeyIdApplications;
