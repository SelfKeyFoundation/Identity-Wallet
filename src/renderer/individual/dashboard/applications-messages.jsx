import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { baseDark, grey } from 'selfkey-ui';

const styles = theme => ({
	textArea: {
		backgroundColor: baseDark,
		boxSizing: 'border-box',
		border: '1px solid #384656',
		borderRadius: '4px',
		color: grey,
		fontFamily: 'Lato,arial,sans-serif',
		fontSize: '14px',
		lineHeight: '21px',
		marginBottom: '1em',
		outline: 'none',
		padding: '10px 15px',
		width: '100%',
		'&::placeholder': {
			color: grey
		}
	},
	messagesRow: {
		display: 'flex',
		marginBottom: '1em',
		justifyContent: 'space-between',
		'& > div.content': {
			padding: '5px 10px',
			display: 'inline-block',
			background: '#69e',
			borderRadius: '10px',
			maxWidth: '45%'
		},
		'& > div.certifier': {
			background: '#666'
		}
	}
});

const onClick = (textArea, application, onSendMessage) => {
	if (textArea.value) {
		onSendMessage({ application, message: textArea.value });
	}
};

const ApplicationMessages = withStyles(styles)(({ classes, application, onSendMessage }) => {
	let textAreaEl = null;
	if (application.messages.length) {
		console.log(application.messages);
	}
	return (
		<React.Fragment>
			<div>
				{application.messages.map(m => (
					<div key={m.key} className={classes.messagesRow}>
						<div className={m.name === 'Certifier' ? 'content certifier' : ''}>
							{m.name === 'Certifier' ? m.message : ''}
						</div>
						<div className={m.name !== 'Certifier' ? 'content person' : ''}>
							{m.name !== 'Certifier' ? m.message : ''}
						</div>
					</div>
				))}
			</div>
			<textarea
				ref={el => (textAreaEl = el)}
				className={classes.textArea}
				rows="5"
				placeholder="Please describe the work that needs to be done…."
			/>
			<Button
				id="addDocuments"
				variant="outlined"
				size="normal"
				color="secondary"
				onClick={e => onClick(textAreaEl, application, onSendMessage)}
			>
				Send Message
			</Button>
		</React.Fragment>
	);
});

export { ApplicationMessages };
export default ApplicationMessages;
