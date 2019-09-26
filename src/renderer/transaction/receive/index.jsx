import React from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import { Grid, Typography, Paper, Modal } from '@material-ui/core';
import {
	SelfkeyIcon,
	EthereumIcon,
	CustomIcon,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	MailIcon,
	CopyWithIcon,
	PrintSmallIcon
} from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react';

const styles = theme => ({
	modalHeader: {
		padding: '10px 30px',
		'@media print': {
			display: 'none'
		},
		'& svg': {
			width: '44px !important',
			height: '44px !important',
			position: 'relative',
			marginRight: '0.5em'
		}
	},
	cryptoIcon: {
		marginRight: '20px'
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: '20px'
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px'
		}
	},
	tokenPublicKey: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '30px',
		'& > p': {
			display: 'inline'
		},
		'& > button': {
			display: 'inline'
		}
	},
	tokenAddress: {
		padding: '20px 0',
		textAlign: 'center'
	},
	qrCode: {
		textAlign: 'center',
		marginBottom: '20px',
		'& canvas': {
			background: '#FFF',
			padding: '10px'
		}
	},
	publicKey: {
		fontSize: '20px',
		'@media print': {
			color: '#000000',
			display: 'block !important'
		}
	},
	bottomSpace: {
		marginBottom: '20px'
	},
	mailIcon: {
		height: '27px',
		width: '35px'
	},
	printIcon: {
		height: '36px',
		width: '34px'
	},
	iconWrap: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		'@media print': {
			display: 'none'
		}
	},
	space: {
		margin: '0 20px'
	},
	padding: {
		padding: '0 5px'
	},
	icon: {
		cursor: 'pointer',
		textDecoration: 'none',
		'&:hover': {
			'& svg': {
				fill: '#FFFFFF'
			}
		}
	},
	emailMargin: {
		marginTop: '11px'
	},
	printMargin: {
		marginTop: '7px'
	},
	modalBody: {
		'@media print': {
			border: 0,
			boxShadow: 'none'
		}
	},
	modal: {
		'& > div:first-of-type': {
			opacity: '1 !important'
		},
		'@media print': {
			border: '0'
		}
	}
});

const goBackDashboard = props => <Link to="/main/dashboard" {...props} />;

const getIconForToken = token => {
	let icon = null;
	switch (token) {
		case 'KEY':
			icon = <SelfkeyIcon />;
			break;
		case 'ETH':
			icon = <EthereumIcon />;
			break;
		default:
			icon = <CustomIcon />;
	}
	return icon;
};

export class ReceiveTransfer extends React.Component {
	render() {
		const { classes, cryptoCurrency, address } = this.props;
		let link = `mailto:?body=${address}`;

		let printDiv = () => {
			window.print();
		};
		// TODO: test if pulicKey and cryptoCurrency are available and valid
		// Redirect to dashboard with error if not

		return (
			<Modal open={true} className={classes.modal}>
				<ModalWrap className={classes.modalWrap}>
					<Paper className={classes.modalContentWrapper}>
						<ModalCloseButton className={classes.closeIcon} component={goBackDashboard}>
							<ModalCloseIcon />
						</ModalCloseButton>

						<ModalHeader className={classes.modalHeader}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="center"
								spacing={0}
							>
								{getIconForToken(cryptoCurrency)}
								<Typography variant="body2">Receive {cryptoCurrency}</Typography>
							</Grid>
						</ModalHeader>

						<ModalBody className={classes.modalBody}>
							<div className={classes.tokenAddress}>
								<div className={classes.qrCode}>
									<QRCode value={address} />
								</div>
								<Typography
									variant="h1"
									color="secondary"
									className={classes.bottomSpace}
								>
									Your Ethereum address to receive {cryptoCurrency}
								</Typography>
								<div className={classes.tokenPublicKey}>
									<Typography
										variant="body2"
										className={classes.publicKey}
										id="printableArea"
									>
										{address}
									</Typography>
								</div>
								<div className={classes.iconWrap}>
									<div className={classes.space}>
										<CopyWithIcon text={address} />
									</div>
									<a
										href={link}
										className={`${classes.space} ${classes.padding} ${
											classes.icon
										}`}
									>
										<MailIcon
											className={classes.mailIcon}
											style={{ marginTop: '5px' }}
										/>
										<Typography
											variant="subtitle2"
											color="secondary"
											className={classes.emailMargin}
										>
											E-mail
										</Typography>
									</a>
									<div
										className={`${classes.space} ${classes.padding} ${
											classes.icon
										}`}
										onClick={printDiv}
									>
										<PrintSmallIcon className={classes.printIcon} />
										<Typography
											variant="subtitle2"
											color="secondary"
											className={classes.printMargin}
										>
											Print
										</Typography>
									</div>
								</div>
							</div>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(withStyles(styles)(ReceiveTransfer));
