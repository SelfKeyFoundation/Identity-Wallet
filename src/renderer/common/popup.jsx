import React from 'react';
import { Modal, Typography, withStyles } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	modal: {
		overflow: 'auto'
	},
	closeButton: {
		top: '20px'
	}
});

const PopupWrap = props => {
	const {
		classes,
		children,
		closeAction,
		text,
		xtraClass = '',
		open = true,
		isHeaderVisible = true
	} = props;
	return (
		<Modal open={open} className={`${classes.modal} ${props.className}`}>
			<ModalWrap>
				<ModalCloseButton onClick={closeAction} className={classes.closeButton}>
					<ModalCloseIcon />
				</ModalCloseButton>
				{isHeaderVisible && (
					<ModalHeader>
						{typeof text === 'string' ? (
							<Typography variant="body1" className={classes.title}>
								{text}
							</Typography>
						) : (
							text
						)}
					</ModalHeader>
				)}
				<ModalBody className={xtraClass}>{children}</ModalBody>
			</ModalWrap>
		</Modal>
	);
};

export const Popup = withStyles(styles)(PopupWrap);
export default Popup;
