import React from 'react';
import { Modal, Typography, withStyles } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	modal: {
		overflow: 'auto'
	},
	closeButton: {
		top: '20px'
	},
	title: {
		// verticalAlign: 'middle',
		// lineHeight: '30px'
	}
});

export const Popup = withStyles(styles)(
	({ classes, xtraClass, children, closeAction, text, open = true }) => (
		<Modal open={open} className={`${classes.modal} ${xtraClass}`}>
			<ModalWrap>
				<ModalCloseButton onClick={closeAction} className={classes.closeButton}>
					<ModalCloseIcon />
				</ModalCloseButton>
				<ModalHeader>
					{typeof text === 'string' ? (
						<Typography variant="body1" className={classes.title}>
							{text}
						</Typography>
					) : (
						text
					)}
				</ModalHeader>
				<ModalBody>{children}</ModalBody>
			</ModalWrap>
		</Modal>
	)
);

export default Popup;
