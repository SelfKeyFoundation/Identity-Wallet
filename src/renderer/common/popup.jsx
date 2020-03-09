import React from 'react';
import { Modal, Typography, withStyles, Grid, Paper } from '@material-ui/core';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	SelfkeyLogoTemp
} from 'selfkey-ui';

const styles = theme => ({
	modal: {
		overflow: 'auto'
	},
	closeButton: {
		top: '20px'
	},
	logoSection: {
		paddingBottom: '50px',
		marginTop: '-100px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	paper: {
		boxShadow: 'inherit'
	},
	popup: {
		position: 'relative'
	}
});

const PopupWrap = props => {
	const {
		classes,
		children,
		closeAction,
		text,
		open = true,
		isHeaderVisible = true,
		displayLogo = false,
		headerClass = '',
		xtraClass = ''
	} = props;
	return (
		<Modal open={open} className={`${classes.modal} ${props.className}`}>
			<ModalWrap className={classes.modalWrap}>
				{displayLogo && (
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={8}
						className={classes.logoSection}
					>
						<Grid item>
							<SelfkeyLogoTemp />
						</Grid>
					</Grid>
				)}
				<Paper className={classes.paper}>
					<div className={classes.popup}>
						{closeAction && (
							<ModalCloseButton onClick={closeAction} className={classes.closeButton}>
								<ModalCloseIcon />
							</ModalCloseButton>
						)}
						{isHeaderVisible && (
							<ModalHeader className={headerClass}>
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
					</div>
				</Paper>
			</ModalWrap>
		</Modal>
	);
};

export const Popup = withStyles(styles)(PopupWrap);
export default Popup;
