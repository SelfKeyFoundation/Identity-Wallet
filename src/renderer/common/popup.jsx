import React from 'react';
import { Modal, Typography, Grid, Paper } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/styles';
import { PropTypes } from 'prop-types';
import { ModalWrap, ModalCloseButton, ModalCloseIcon, SelfkeyLogoTemp } from 'selfkey-ui';

const ModalBody = withStyles(
	createStyles({
		root: {
			background: 'linear-gradient(180deg, #161A1F 39.84%, #14202D 100%)',
			border: 'none',
			borderRadius: '0 0 16px 16px',
			boxShadow: 'none',
			boxSizing: 'border-box',
			minHeight: '200px',
			padding: '32px 40px 56px',
			width: '100%'
		}
	})
)(Paper);

const ModalHeader = withStyles(
	createStyles({
		root: {
			alignItems: 'center',
			background: 'linear-gradient(180deg, #161A1F 39.84%, #14202D 100%);',
			border: 'none',
			borderBottom: '1px solid #303C49',
			borderRadius: '16px 16px 0 0',
			boxShadow: 'none',
			boxSizing: 'border-box',
			display: 'flex',
			height: '65px',
			justifyContent: 'space-between',
			padding: '16px 32px',
			width: '100%'
		}
	})
)(Paper);

const styles = theme => ({
	modal: {
		overflow: 'auto',
		border: 'none',
		'& > div:nth-of-type(1)': {
			background: `linear-gradient(180deg, #111111 0%, #13212e 100%)`
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
		margin: '0 auto 80px'
	},
	paper: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)',
		borderRadius: '16px'
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
		<Modal
			open={open}
			className={`${classes.modal} ${props.className}`}
			disableEnforceFocus={!!process.env.STORYBOOK}
		>
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

Popup.propTypes = {
	children: PropTypes.element.isRequired,
	closeAction: PropTypes.func,
	closeComponent: PropTypes.element,
	text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	open: PropTypes.bool,
	isHeaderVisible: PropTypes.bool,
	displayLogo: PropTypes.bool,
	closeButtonClass: PropTypes.string,
	headerClass: PropTypes.string,
	xtraClass: PropTypes.string,
	popupClass: PropTypes.string
};

Popup.defaultProps = {
	open: true,
	closeButtonClass: '',
	isHeaderVisible: true,
	displayLogo: false,
	headerClass: '',
	xtraClass: '',
	popupClass: '',
	text: ''
};
