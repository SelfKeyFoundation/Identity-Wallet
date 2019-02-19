import React from 'react';
import { Modal, Typography, withStyles } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	title: {
		// verticalAlign: 'middle',
		// lineHeight: '30px'
	},
	marginSpace: {
		marginTop: '20px'
	}
});

export const Popup = withStyles(styles)(({ classes, children, closeAction, text, open = true }) => (
	<Modal open={open}>
		<ModalWrap>
			<ModalCloseButton onClick={closeAction}>
				<ModalCloseIcon className={classes.marginSpace} />
			</ModalCloseButton>
			<ModalHeader>
				{typeof text === 'string' ? (
					<Typography variant="h2" className={classes.title}>
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
