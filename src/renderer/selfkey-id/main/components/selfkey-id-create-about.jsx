import React, { PureComponent } from 'react';
import { Grid, Modal, Typography, Paper, Button, withStyles } from '@material-ui/core';
import { SelfkeyLogoTemp, ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';
import { Link } from 'react-router-dom';
import history from 'common/store/history';

const styles = theme => ({
	container: {
		minHeight: '100vh'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	button: {
		width: '100%'
	},
	cancel: {
		paddingLeft: '20px'
	},
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	}
});

const selfkeyIdCreateDisclaimer = props => <Link to="/selfkeyIdCreateDisclaimer" {...props} />;

const main = props => <Link to="/main/dashboard" {...props} />;

class SelfKeyIdCreateAboutComponent extends PureComponent {
	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
	};

	render() {
		const { classes } = this.props;
		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
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
					<Paper>
						<ModalHeader>
							<Typography variant="body1" id="modal-title">
								About the SelfKey Identity Wallet
							</Typography>
						</ModalHeader>

						<ModalBody>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item>
									<Typography variant="body1" gutterBottom>
										Inside the SelfKey Identity Wallet you can manage, own, and{' '}
										fully control various parts of your SelfKey ID. It is also a{' '}
										direct interface to the Ethereum blockchain, allowing you to{' '}
										manage all of your ETH and ERC-20 token assets inside the{' '}
										wallet.
									</Typography>
									<br />
									<br />
									<Typography variant="body1" gutterBottom>
										After building out your SelfKey ID, you can unlock products{' '}
										and services inside the SelfKey Marketplace by staking KEY{' '}
										tokens. Think of staking like a refundable deposit. Staking{' '}
										is required to prevent spam and to secure all parties{' '}
										interact in a professional and respectable manner. To learn{' '}
										more about this,{' '}
										<a
											className={classes.link}
											onClick={e => {
												window.openExternal(e, 'https://help.selfkey.org/');
											}}
										>
											click here
										</a>
										.
									</Typography>
									<br />
									<br />
									<br />
								</Grid>
								<Grid item>
									<Button
										id="selfkeyIdAboutButton"
										variant="contained"
										size="large"
										component={selfkeyIdCreateDisclaimer}
									>
										Continue
									</Button>
								</Grid>
								<Grid item className={classes.cancel}>
									<Button variant="outlined" size="large" component={main}>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

export const SelfKeyIdCreateAbout = withStyles(styles)(SelfKeyIdCreateAboutComponent);

export default SelfKeyIdCreateAbout;
