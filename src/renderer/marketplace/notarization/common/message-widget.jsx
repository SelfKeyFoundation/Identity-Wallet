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
	containerHeader: {
		alignItems: 'flex-start',
		background: '#2A3540',
		display: 'flex',
		justifyContent: 'flex-start',
		padding: '25px 30px',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		}
	},
	cardContent: {
		paddingBottom: '0 !important'
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '0 30px'
	},
	send: {
		backgroundColor: '#313D49',
		boxSizing: 'border-box',
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		marginLeft: '-30px',
		marginTop: 50,
		padding: 30,
		width: 'calc(100% + 60px)'
	},
	textArea: {
		marginRight: '30px',
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
		marginBottom: 30,
		marginTop: 30,
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
		marginBottom: 15,
		'& .messageHead': {
			'& h2': {
				marginLeft: 15
			}
		},
		'& .messageBody': {
			'& div': {
				boxSizing: 'border-box',
				backgroundColor: '#313D49',
				borderRadius: '4px',
				marginLeft: 50,
				maxWidth: '75%',
				padding: 15
			},
			'& .date': {
				marginLeft: 50,
				marginTop: '15px'
			}
		}
	},
	company: {
		alignItems: 'flex-end',
		marginBottom: 15,
		'& .messageHead': {
			flexDirection: 'row-reverse',
			'& h2': {
				marginRight: 15
			}
		},
		'& .messageBody': {
			alignItems: 'flex-end',
			'& div': {
				boxSizing: 'border-box',
				backgroundColor: '#384E64',
				borderRadius: '4px',
				marginRight: 50,
				maxWidth: '75%',
				padding: 15,
				textAlign: 'right'
			},
			'& .date': {
				marginRight: 50,
				marginTop: '15px'
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

export const NotarizationMessageWidget = withStyles(styles)(props => {
	const { classes, onBackClick, messages } = props;
	return (
		<Card className={classes.container}>
			<CardHeader title="Message Reply" />
			<Divider variant="middle" />
			<CardContent className={classes.cardContent}>
				{messages &&
					messages.map((message, indx) => (
						<DirectMessage key={indx} data={message} index={indx} />
					))}
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

export default NotarizationMessageWidget;
