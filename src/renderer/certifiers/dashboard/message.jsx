import React, { Component } from 'react';
import { Grid, Typography, Button, withStyles } from '@material-ui/core';
import { CloseButtonIcon, RoundCompany, RoundPerson, baseDark, grey } from 'selfkey-ui';
import moment from 'moment';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '780px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		background: '#2A3540',
		padding: '25px 30px',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		}
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
		'& textarea': {
			backgroundColor: baseDark,
			boxSizing: 'border-box',
			border: '1px solid #384656',
			borderRadius: '4px',
			color: '#fff',
			fontFamily: 'Lato,arial,sans-serif',
			fontSize: '16px',
			outline: 'none',
			padding: '10px 15px',
			width: '100%',
			'&::placeholder': {
				color: grey
			}
		}
	}
});

const messageStyles = theme => ({
	messageBox: {
		marginBottom: 30,
		marginTop: 30
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
				maxWidth: '586px',
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
				maxWidth: '586px',
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
		<Grid container key={index} className={`${classes.messageBox} ${messageType}`}>
			<Grid container className="messageHead">
				{data.type === 'person' ? <RoundPerson /> : <RoundCompany />}
				<Typography variant="h2">{data.name}</Typography>
			</Grid>
			<Grid container direction="column" className="messageBody">
				<Grid item>
					<Typography variant="body2">{data.message}</Typography>
				</Grid>
				<Typography variant="subtitle2" color="secondary" className="date">
					{moment(data.date).format('DD MMM YYYY')}
				</Typography>
			</Grid>
		</Grid>
	);
});

class MessageComponent extends Component {
	render() {
		const { classes, onBackClick, messages } = this.props;
		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<Typography variant="h2" className="region">
						Message Reply
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					{messages &&
						messages.map((message, indx) => (
							<DirectMessage key={indx} data={message} index={indx} />
						))}
					<Grid container className={classes.send}>
						<Grid item className={classes.textArea}>
							<textarea rows="5" placeholder="Message..." />
						</Grid>
						<Grid item>
							<Button variant="contained" size="large" onClick={onBackClick}>
								Send
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

const MessageReply = withStyles(styles)(MessageComponent);
export default MessageReply;
export { MessageReply };
