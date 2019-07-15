import React from 'react';
import { Modal, Typography, withStyles } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	modal: {
		overflow: 'auto'
	},
	disableTransparency: {
		'& > div:first-of-type': {
			background: 'linear-gradient(135deg, rgba(43,53,64,1) 0%, rgba(30,38,46,1) 100%)',
			opacity: '1 !important'
		}
	},
	closeButton: {
		top: '20px'
	}
});

const PopupWrap = props => {
	const {
		classes,
		children,
		disableTransparency = false,
		closeAction,
		text,
		open = true
	} = props;
	const extraClass = disableTransparency ? `${classes.disableTransparency}` : '';
	return (
		<Modal open={open} className={`${classes.modal} ${extraClass}`}>
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
	);
};

export const Popup = withStyles(styles)(PopupWrap);
export default Popup;
