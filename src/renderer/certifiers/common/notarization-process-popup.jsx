import React from 'react';
import { Typography, Button, Divider, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ExchangeIcon, baseDark, grey, OkayIcon } from 'selfkey-ui';
import { Popup } from '../../common';

const styles = theme => ({
	popup: {
		'& p:fild-child': {
			paddingLeft: '15px'
		}
	},
	container: {
		alignItems: 'flex-start',
		display: 'flex',
		justifyContent: 'flex-start',
		paddingRight: '10px'
	},
	content: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	icon: {
		marginRight: '30px'
	},
	title: {
		marginBottom: '20px'
	},
	payButton: {
		marginRight: '20px'
	},
	input: {
		marginBottom: '5px',
		width: '100%'
	},
	divider: {
		height: '2px',
		margin: '40px 0 35px'
	},
	secondDivider: {
		height: '2px',
		margin: '20px 0 35px'
	},
	did: {
		marginRight: '5px'
	},
	usdWrap: {
		textAlign: 'right'
	},
	usd: {
		marginTop: '-36px',
		position: 'absolute',
		right: '60px'
	},
	key: {
		marginRight: '1px'
	},
	footer: {
		'& textarea': {
			backgroundColor: baseDark,
			boxSizing: 'border-box',
			border: '1px solid #384656',
			borderRadius: '4px',
			color: '#fff',
			fontFamily: 'Lato,arial,sans-serif',
			fontSize: '14px',
			lineHeight: '21px',
			outline: 'none',
			padding: '10px 15px',
			width: '100%',
			'&::placeholder': {
				color: grey
			}
		}
	},
	marginBottom: {
		marginBottom: '20px'
	},
	actions: {
		marginTop: '54px'
	},
	list: {
		paddingLeft: 0,
		paddingRight: 0
	},
	listItem: {
		alignItems: 'baseline',
		marginBottom: '24px',
		padding: 0
	},
	label: {
		minWidth: '260px',
		paddingRight: '20px'
	}
});

export const NotarizationProcess = withStyles(styles)(props => {
	const { classes, status, summary } = props;

	let icon,
		title,
		bodyText,
		buttonText,
		cancelButtonText,
		notarizationStatus,
		onSubmitClick,
		onCancelClick;

	switch (status) {
		// Completed
		case 1:
			icon = <OkayIcon />;
			title = 'Notarization Process Completed';
			bodyText =
				'If you finished notarizing all the documents the user has submited and you have received payment for your services, please finish the notarization. The documents you notarized, as well as the details of this process will be available under the requests history tab.';
			buttonText = 'Finish Notarization';
			onSubmitClick = '';
			onCancelClick = '';
			break;
		// Reimbursment
		case 2:
			icon = <ExchangeIcon />;
			title = 'You received a reimbursment request';
			bodyText =
				'The user is entitled to ask for a reimbursment for the ammount associated with each document they wanted notarized. You might refuse this reimbursment, depending how advanced they were with your notarisation process.';
			buttonText = 'Reimburse User';
			cancelButtonText = 'Refuse';
			notarizationStatus = true;
			onSubmitClick = '';
			onCancelClick = '';
			break;
		// default:
		// break;
	}

	return (
		<Popup className={classes.popup} closeAction={''} open text="Notarization Process">
			<div className={classes.container}>
				<div className={classes.icon}>{icon}</div>
				<div>
					<div className={classes.content}>
						<div className={classes.title}>
							<Typography variant="h1">{title}</Typography>
						</div>
						<div>
							<Typography variant="body1">{bodyText}</Typography>
						</div>
						<div>
							<Divider className={classes.divider} />
						</div>

						<div className={classes.title}>
							<Typography variant="h1">Summary</Typography>
						</div>

						<List className={classes.list}>
							<ListItem key="user" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									User
								</Typography>
								<Typography variant="body2">{summary.user}</Typography>
							</ListItem>
							<ListItem key="userDid" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									User DID
								</Typography>
								<Typography variant="body2">{summary.did}</Typography>
							</ListItem>
							<ListItem key="applicationDate" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									Application Date
								</Typography>
								<Typography variant="body2">{summary.applicationDate}</Typography>
							</ListItem>
							<ListItem key="type" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									Type
								</Typography>
								<Typography variant="body2">{summary.type}</Typography>
							</ListItem>
							<ListItem key="documents" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									No. of Documents Notarized
								</Typography>
								<Typography variant="body2">{summary.noOfDocuments}</Typography>
							</ListItem>
							{notarizationStatus && (
								<ListItem key="notarizationStatus" className={classes.listItem}>
									<Typography
										variant="body2"
										color="secondary"
										className={classes.label}
									>
										Notarization Status
									</Typography>
									<Typography variant="body2" color="error">
										Canceled by Notary
									</Typography>
								</ListItem>
							)}
							<ListItem key="transId" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									Transaction ID
								</Typography>
								<Typography variant="body2">{summary.transactionID}</Typography>
							</ListItem>
							<ListItem key="transDate" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									Transaction Date
								</Typography>
								<Typography variant="body2">{summary.transactionDate}</Typography>
							</ListItem>
							<ListItem key="amount" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									Amount
								</Typography>
								<Typography variant="body2">{summary.amount} KEY</Typography>
							</ListItem>
							<ListItem key="paymentStatus" className={classes.listItem}>
								<Typography
									variant="body2"
									color="secondary"
									className={classes.label}
								>
									Payment Status
								</Typography>
								<Typography variant="body2">{summary.paymentStatus}</Typography>
							</ListItem>
						</List>

						{notarizationStatus && (
							<React.Fragment>
								<div>
									<Divider className={classes.secondDivider} />
								</div>
								<div className={classes.footer}>
									<Typography variant="overline" gutterBottom>
										Message for user*
									</Typography>
									<textarea
										rows="5"
										placeholder="Please describe the extra payment represents"
									/>
								</div>
							</React.Fragment>
						)}

						<div className={classes.actions}>
							<div>
								<Button
									className={classes.payButton}
									variant="contained"
									size="large"
									onClick={onSubmitClick}
								>
									{buttonText}
								</Button>
								<Button variant="outlined" size="large" onClick={onCancelClick}>
									{(cancelButtonText && cancelButtonText) || 'Cancel'}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Popup>
	);
});

export default NotarizationProcess;
