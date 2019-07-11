import React from 'react';
import { Modal, Typography, withStyles } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	modal: {
		overflow: 'auto'
	},
	disableTranparency: {
		'& > div:first-of-type': {
			opacity: '1 !important'
		}
	},
	closeButton: {
		top: '20px'
	},
	title: {
		// verticalAlign: 'middle',
		// lineHeight: '30px'
	}
});

const PopupWrap = props => {
	const { classes, children, disableTranparency = false, closeAction, text, open = true } = props;
	const extraClass = disableTranparency ? `${classes.disableTranparency}` : '';
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
