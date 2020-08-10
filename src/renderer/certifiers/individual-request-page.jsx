import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import {
	Typography,
	Card,
	CardContent,
	CardHeader,
	Divider,
	List,
	ListItem,
	Button,
	Grid
} from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/styles';
import {
	success,
	warning,
	typography,
	error,
	BackButton,
	SimpleCheckIcon,
	SimpleDeniedIcon,
	SimpleHourglassIcon,
	HourGlassIcon
} from 'selfkey-ui';
import DocumentsList from './common/documents-list-container';

const styles = theme => ({
	container: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		margin: '30px auto 0',
		width: '960px'
	},
	containerHeader: {
		alignItems: 'center',
		background: '#2A3540',
		border: '1px solid #303C49',
		borderRadius: '4px 4px 0 0',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '22px 30px',
		width: 'inherit'
	},
	identity: {
		alignItems: 'baseline',
		display: 'flex',
		justifyContent: 'flex-start'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '0 0 4px 4px',
		padding: '22px 30px',
		width: 'inherit'
	},
	card: {
		minHeight: '242px',
		width: '48%'
	},
	fullCard: {
		width: '100%'
	},
	cardContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: '30px'
	},
	did: {
		marginLeft: '10px'
	},
	bottomSpace: {
		marginBottom: '15px'
	},
	topSpace: {
		marginTop: '30px',
		width: 'inherit'
	},
	list: {
		paddingLeft: 0,
		paddingRight: 0
	},
	listItem: {
		alignItems: 'baseline',
		padding: 0
	},
	label: {
		minWidth: '130px',
		paddingRight: '20px'
	},
	required: {
		marginTop: '30px'
	},
	currentStatus: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			marginRight: '5px !important'
		}
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	}
});

const ApplicationDetails = withStyles(styles)(({ classes }) => {
	return (
		<Card className={classes.card}>
			<CardHeader title="Application Details" />
			<Divider variant="middle" />
			<CardContent>
				<List className={classes.list}>
					<ListItem key="applicationDate" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							Application Date
						</Typography>
						<Typography variant="body2">
							{/* {moment(item.applicationDate).format('DD MMM YYYY')} */}
							date
						</Typography>
					</ListItem>
					<ListItem key="serviceProvider" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							Type
						</Typography>
						<Typography variant="body2">type</Typography>
					</ListItem>
					<ListItem key="providerContact" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							No. of documents
						</Typography>
						<Typography variant="body2">
							{/* {getRpInfo(item.rpName, 'contactEmail')} */}4
						</Typography>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	);
});

const PaymentDetails = withStyles(styles)(({ classes }) => {
	return (
		<Card className={classes.card}>
			<CardHeader title="Payment Details" />
			<Divider variant="middle" />
			<CardContent>
				<List className={classes.list}>
					<ListItem key="transactionId" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							Transaction ID
						</Typography>
						<Typography variant="body2">
							{/* {item.payments.transactionHash} */}
							transaction id
						</Typography>
					</ListItem>
					<ListItem key="transactionDate" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							Transaction Date
						</Typography>
						<Typography variant="body2">
							{/* {item.payments &&
                                moment(item.payments.transactionDate).format(
                                    'DD MMM YYYY'
                                )} */}
							-
						</Typography>
					</ListItem>
					<ListItem key="amount" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							Amount
						</Typography>
						<Typography variant="body2">{/* {item.payments.amountKey} */}-</Typography>
					</ListItem>
					<ListItem key="paymentStatus" className={classes.listItem}>
						<Typography variant="body2" color="secondary" className={classes.label}>
							Payment Status
						</Typography>
						<Typography variant="body2">{/* {item.payments.status} */}---</Typography>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	);
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
			marginBottom: '30px',
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
				message = 'Notarization Completed';
				button = (
					<Button variant="contained" size="large" onClick={onClick} disabled={loading}>
						{loading ? 'Loading' : 'View Notarization Process'}
					</Button>
				);
				break;
			case 3:
			case 7:
			case 8:
				icon = <SimpleDeniedIcon className={classes.statusIcon} />;
				message = 'Application denied.';
				statusStyle = 'denied';
				break;
			default:
				icon = <SimpleHourglassIcon className={classes.statusIcon} />;
				message = 'Application started. Documents submitted. Start notarization.';
				button = (
					<Button variant="contained" size="large" onClick={onClick} disabled={loading}>
						{loading ? 'Loading' : 'Start Notarization'}
					</Button>
				);
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
					</Grid>
				</Grid>
			</div>
		);
	}
);

export const IndividualRequestPage = withStyles(styles)(props => {
	const { classes, item, documents, did, firstName, lastName, handleBackClick } = props;
	return (
		<div>
			<div item className={classes.backButtonContainer}>
				<BackButton onclick={handleBackClick} />
			</div>
			<div className={classes.container}>
				<div className={classes.containerHeader}>
					<div className={classes.identity}>
						<Typography variant="h2">
							{firstName} {lastName}
						</Typography>
						<Typography className={classes.did} variant="subtitle2" color="secondary">
							- did:selfkey:{did}
						</Typography>
					</div>
					<div className={classes.currentStatus}>
						<HourGlassIcon />
						<Typography variant="subtitle2" color="secondary">
							{item.currentStatusName}
						</Typography>
					</div>
				</div>
				<div className={classes.contentContainer}>
					<StatusInfo
						application={item}
						status={item.currentStatus}
						onClick={() => this.props.onApplicationAdditionalRequirements(item)}
						handleRefresh={() => this.props.onApplicationRefresh(item)}
						tooltip={moment(new Date(item.updatedAt)).format('DD MMM YYYY')}
						loading={false}
					/>
					<div className={classes.cardContainer}>
						<ApplicationDetails />
						<PaymentDetails />
					</div>
					<div>
						<Card className={classes.fullCard}>
							<CardHeader title="Notarization request" />
							<Divider variant="middle" />
							<CardContent>
								<DocumentsList documents={documents} />
								<Typography className={classes.required} variant="h2" gutterBottom>
									Description of work required
								</Typography>
								<Typography variant="body2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Suspendisse id odio commodo, convallis purus quis, dictum orci.
									Maecenas eros justo, aliquam in fermentum a, gravida non nisl.
								</Typography>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
});

export default IndividualRequestPage;
