import React from 'react';
import {
	CardHeader,
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
	Button,
	withStyles
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { GreenTick, FailedIcon, AttributeAlertIcon, HourGlassIcon, warning } from 'selfkey-ui';

const styles = theme => ({
	orange: {
		width: 'auto',
		margin: '30px 24px 24px 24px',
		border: `1px solid ${warning}`,
		background: 'transparent',
		color: warning,
		'&:hover': {
			border: `1px solid ${warning}`
		}
	},
	statusIcon: {
		width: '36px !important',
		height: '36px !important'
	},
	type: {
		paddingRight: '10px'
	},
	label: {
		paddingRight: '20px'
	}
});

const HeaderIcon = withStyles(styles)(({ status }) => {
	let icon = null;
	switch (status) {
		case 'Documents Required':
			icon = <HourGlassIcon />;
			break;
		case 'Documents Submitted':
			icon = <HourGlassIcon />;
			break;
		case 'Denied':
			icon = <FailedIcon />;
			break;
		default:
			icon = <GreenTick />;
	}

	return icon;
});

const StatusComponent = withStyles(styles)(({ status, classes }) => {
	let icon = null;
	let message = null;
	switch (status) {
		case 'Documents Required':
			icon = <AttributeAlertIcon className={{ root: classes.statusIcon }} />;
			message = 'Application started. Missing required documents.';
			break;
		case 'Documents Submitted':
			icon = <AttributeAlertIcon className={{ root: classes.statusIcon }} />;
			message =
				'Application started. Documents submitted. Please check your email for further instructions.';
			break;
		case 'Denied':
			icon = <AttributeAlertIcon className={{ root: classes.statusIcon }} />;
			message = 'Application denied. Please check your email for the reject reason.';
			break;
		default:
			icon = <AttributeAlertIcon className={{ root: classes.statusIcon }} />;
			message =
				'Application completed. Please check your email to receive relevant documents and information.';
	}

	return (
		<Grid
			container
			direction="row"
			justify="flex-start"
			alignItems="center"
			className={classes.orange}
		>
			<Grid item>{icon}</Grid>
			<Grid item>
				<Typography variant="body1" gutterBottom>
					Status
				</Typography>
				<Typography variant="body2" color="secondary" gutterBottom>
					{message}
				</Typography>
			</Grid>
			<Grid item justify="flex-end">
				<Button variant="contained" size="large">
					Add Documents
				</Button>
			</Grid>
		</Grid>
	);
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
								<Typography variant="subtitle2" color="secondary" gutterBottom>
									- {item.country}
								</Typography>
							</Grid>
							<Grid container direction="row" justify="flex-end" alignItems="center">
								<HeaderIcon status={item.status} />
								<Typography variant="subtitle2" color="secondary" gutterBottom>
									{item.status}
								</Typography>
							</Grid>
						</ExpansionPanelSummary>
						<Divider />
						<StatusComponent status={item.status} classes={classes} />
						<ExpansionPanelDetails>
							<Grid container spacing={32}>
								<Grid item xs>
									<Card>
										<CardHeader title="Application Details" />
										<Divider />
										<CardContent>
											<List>
												<ListItem key="applicationDate">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Application Date
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.applicationDate}
													</Typography>
												</ListItem>
												<ListItem key="serviceProvider">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Service Provider
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.serviceProvider}
													</Typography>
												</ListItem>
												<ListItem key="providerContact">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Provider Contact
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.providerContact}
													</Typography>
												</ListItem>
												<ListItem key="address">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Address
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.address}
													</Typography>
												</ListItem>
											</List>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs>
									<Card>
										<CardHeader title="Payment Details" />
										<Divider />
										<CardContent>
											<List>
												<ListItem key="transactionId">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Transaction ID
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.transactionId}
													</Typography>
												</ListItem>
												<ListItem key="transactionDate">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Transaction Date
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.transactionDate}
													</Typography>
												</ListItem>
												<ListItem key="amount">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Amount
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
														{item.amount}
													</Typography>
												</ListItem>
												<ListItem key="paymentStatus">
													<Typography
														variant="body2"
														color="secondary"
														gutterBottom
														className={classes.label}
													>
														Payment Status
													</Typography>
													<Typography
														variant="body2"
														align="right"
														gutterBottom
													>
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
