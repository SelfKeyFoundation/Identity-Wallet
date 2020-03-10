import React from 'react';
import { Modal, Typography, Grid, Button, withStyles } from '@material-ui/core';
import history from 'common/store/history';
import { Link } from 'react-router-dom';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	WarningShieldIcon,
	warning
} from 'selfkey-ui';

const createPasswordLink = props => <Link to="/createPassword" {...props} />;

const styles = theme => ({
	orange: {
		border: `1px solid ${warning}`,
		background: 'transparent',
		color: warning,
		'&:hover': {
			border: `1px solid ${warning}`
		}
	},
	closeIcon: {
		marginTop: '20px'
	},
	modalWrap: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)'
	}
});

export const CreateWallet = props => {
	const { classes } = props;
	return (
		<Modal open={true}>
			<ModalWrap className={classes.modalWrap}>
				<ModalCloseButton onClick={history.getHistory().goBack}>
					<ModalCloseIcon className={classes.closeIcon} />
				</ModalCloseButton>
				<ModalHeader>
					<Typography variant="body1" id="modal-title">
						Protect Your Wallet
					</Typography>
				</ModalHeader>

				<ModalBody>
					<Grid container direction="row" justify="flex-start" alignItems="flex-start">
						<Grid item xs={2}>
							<WarningShieldIcon />
						</Grid>
						<Grid item xs={10}>
							<Typography variant="body1" gutterBottom>
								The SelfKey Identity Wallet protects your wallet and Ethereum
								address with a password. You must remember this password to unlock
								the wallet. It cannot be restored or reset. As the wallet is stored
								locally in your device, SelfKey does not have access and cannot help
								you if the password is lost.
							</Typography>
							<br />
							<br />
							<Grid container spacing={24}>
								<Grid item>
									<Button
										id="protectWallet"
										variant="outlined"
										component={createPasswordLink}
										size="large"
										className={classes.orange}
									>
										I UNDERSTAND, THERE IS NO WAY TO RECOVER THIS PASSWORD
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</ModalBody>
			</ModalWrap>
		</Modal>
	);
};

export default withStyles(styles)(CreateWallet);
