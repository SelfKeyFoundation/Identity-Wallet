import React from 'react';
import {
	Typography,
	Button,
	withStyles,
	Card,
	CardHeader,
	Divider,
	CardContent,
	Input
} from '@material-ui/core';
import { RoundCompany, RoundPerson, baseDark, grey } from 'selfkey-ui';
import moment from 'moment';

const styles = theme => ({
	container: {
		margin: '0 auto',
		// maxWidth: '1100px',
		width: '100%'
	},
	cardContent: {
		paddingBottom: `${theme.spacing(0)} !important`
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: theme.spacing(0, 3)
	},
	send: {
		backgroundColor: '#313D49',
		boxSizing: 'border-box',
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		marginLeft: theme.spacing(-3),
		marginTop: theme.spacing(6),
		padding: theme.spacing(3),
		width: 'calc(100% + 60px)'
	},
	textArea: {
		marginRight: theme.spacing(3),
		width: '100%',
		'& div': {
			width: '100%'
		},
		'& input': {
			backgroundColor: baseDark,
			boxSizing: 'border-box',
			outline: 'none',
			width: '100%',
			'&::placeholder': {
				color: grey
			}
		}
	}
});

const messageStyles = theme => ({
	messageBox: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: theme.spacing(3),
		marginTop: theme.spacing(3),
		width: '100%',
		'& .messageHead': {
			display: 'flex',
			width: '100%'
		},
		'& .messageBody': {
			display: 'flex',
			flexDirection: 'column',
			width: '100%'
		}
	},
	person: {
		marginBottom: theme.spacing(2),
		'& .messageHead': {
			'& h2': {
				marginLeft: theme.spacing(2)
			}
		},
		'& .messageBody': {
			'& div': {
				boxSizing: 'border-box',
				backgroundColor: '#313D49',
				borderRadius: '4px',
				marginLeft: theme.spacing(6),
				maxWidth: '75%',
				padding: theme.spacing(2)
			},
			'& .date': {
				marginLeft: theme.spacing(6),
				marginTop: theme.spacing(2)
			}
		}
	},
	company: {
		alignItems: 'flex-end',
		marginBottom: theme.spacing(2),
		'& .messageHead': {
			flexDirection: 'row-reverse',
			'& h2': {
				marginRight: theme.spacing(2)
			}
		},
		'& .messageBody': {
			alignItems: 'flex-end',
			'& div': {
				boxSizing: 'border-box',
				backgroundColor: '#384E64',
				borderRadius: '4px',
				marginRight: theme.spacing(6),
				maxWidth: '75%',
				padding: theme.spacing(2),
				textAlign: 'right'
			},
			'& .date': {
				marginRight: theme.spacing(6),
				marginTop: theme.spacing(2)
			}
		}
	}
});

export const DirectMessage = withStyles(messageStyles)(({ classes, data, index }) => {
	const messageType = `${data.type === 'person' ? `${classes.person}` : `${classes.company}`}`;
	return (
		<div key={index} className={`${classes.messageBox} ${messageType}`}>
			<div className="messageHead">
				{data.type === 'person' ? <RoundPerson /> : <RoundCompany />}
				<Typography variant="h2">{data.name}</Typography>
			</div>
			<div className="messageBody">
				<div>
					<Typography variant="body2">{data.message}</Typography>
				</div>
				<Typography variant="subtitle2" color="secondary" className="date">
					{moment(data.date).format('DD MMM YYYY')}
				</Typography>
			</div>
		</div>
	);
});

export const MessageWidget = withStyles(styles)(props => {
	const { classes, onBackClick, messages } = props;
	return (
		<Card className={classes.container}>
			<CardHeader title="Direct Messages" />
			<Divider variant="middle" />
			<CardContent className={classes.cardContent}>
				{messages &&
					messages.map((message, index) => ({
						/* <DirectMessage key={index} data={message} index={index} /> */
					}))}
				<div className={classes.send}>
					<div className={classes.textArea}>
						<Input disableUnderline placeholder="Write your message..." />
					</div>
					<Button variant="contained" size="large" onClick={onBackClick}>
						Send
					</Button>
				</div>
			</CardContent>
			{/* <div className={classes.contentContainer}>
			</div> */}
		</Card>
	);
});

export default MessageWidget;
