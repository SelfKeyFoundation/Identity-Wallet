import React from 'react';
import { Modal, Typography, Grid, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
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
		overflow: 'auto',
		'& > div:nth-of-type(1)': {
			background: `linear-gradient(135deg, rgba(43, 53, 64, 0.9) 0%, rgba(30, 38, 46, 0.9) 100%)`
		}
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between'
	},
	logoSection: {
		paddingBottom: '50px',
		marginTop: '-100px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent',
		boxShadow: 'none',
		left: 0,
		right: 0,
		margin: '0 auto'
	},
	paper: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)'
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
		closeComponent,
		isHeaderVisible = true,
		displayLogo = false,
		closeButtonClass = '',
		headerClass = '',
		xtraClass = '',
		popupClass = ''
	} = props;
	return (
		<Modal open={open} className={`${classes.modal} ${props.className}`}>
			<ModalWrap className={`${classes.modalWrap} ${popupClass}`}>
				{displayLogo && (
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={1}
						className={classes.logoSection}
					>
						<Grid item>
							<SelfkeyLogoTemp />
						</Grid>
					</Grid>
				)}
				<Paper className={`${classes.paper} paper`}>
					<div className={classes.popup}>
						{closeAction || closeComponent ? (
							<ModalCloseButton
								onClick={closeAction}
								component={closeComponent}
								className={`${classes.closeButton} ${closeButtonClass}`}
							>
								<ModalCloseIcon />
							</ModalCloseButton>
						) : (
							''
						)}
						{isHeaderVisible && (
							<ModalHeader className={`${headerClass} ${classes.header}`}>
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
