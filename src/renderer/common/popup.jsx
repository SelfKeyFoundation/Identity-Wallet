import React from 'react';
import { Modal, Typography, withStyles } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	modal: {
		overflow: 'auto'
	},
	title: {
		// verticalAlign: 'middle',
		// lineHeight: '30px'
	}
});

export const Popup = withStyles(styles)(({ classes, children, closeAction, text, open = true }) => (
	<Modal open={open} className={classes.modal}>
		<ModalWrap>
			<ModalCloseButton onClick={closeAction}>
				<ModalCloseIcon />
			</ModalCloseButton>
			<ModalHeader>
				{typeof text === 'string' ? (
					<Typography variant="h6" className={classes.title}>
						{text}
					</Typography>
				) : (
					text
				)}
			</ModalHeader>
			<ModalBody>{children}</ModalBody>
		</ModalWrap>
	</Modal>
));

export default Popup;
