import React from 'react';
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

const HeaderIcon = withStyles(styles)(({ status, classes }) => {
	let icon = null;
	switch (status) {
		case 'Documents Required':
			icon = <HourGlassIcon />;
			break;
		case 'Documents Submitted':
			icon = <HourGlassIcon />;
			break;
		case 'Denied':
			icon = <DeniedIcon className={classes.headerIcon} />;
			break;
		default:
			icon = <CheckMaIcon className={classes.headerIcon} />;
	}

	return icon;
});

export const SelfkeyIdApplications = props => {
	const { classes } = props;
	return (
		<React.Fragment>
			{props.applications.map((item, index) => (
				<React.Fragment key={item.contry}>
					<ExpansionPanel defaultExpanded={index === 0}>
						<ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="baseline"
							>
								<Typography variant="h2" className={classes.type}>
									{item.type}
								</Typography>
								<Typography variant="subtitle2" color="secondary">
									- {item.country}
								</Typography>
							</Grid>
							<Grid
								container
								direction="row"
								justify="flex-end"
								alignItems="center"
								className={classes.noRightPadding}
							>
								<HeaderIcon status={item.status} />
								<Typography variant="subtitle2" color="secondary">
									{item.status}
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
							<StatusInfo status={item.status} />
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
														{item.applicationDate}
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
														{item.serviceProvider}
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
														{item.providerContact}
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
														{item.address}
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
														{item.transactionId}
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
														{item.transactionDate}
													</Typography>
												</ListItem>
												<ListItem key="amount" className={classes.listItem}>
													<Typography
														variant="body2"
														color="secondary"
														className={classes.label}
													>
														Amount
													</Typography>
													<Typography variant="body2">
														{item.amount}
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
														{item.paymentStatus}
													</Typography>
												</ListItem>
											</List>
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<br />
				</React.Fragment>
			))}
		</React.Fragment>
	);
};

export default withStyles(styles)(SelfkeyIdApplications);
