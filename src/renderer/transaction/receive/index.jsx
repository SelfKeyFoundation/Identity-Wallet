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
	Copy
} from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react';

const styles = theme => ({
	modalHeader: {
		'& svg': {
			width: '1.5em !important',
			height: '1.5em !important',
			position: 'relative',
			top: '-5px',
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
		const { classes, cryptoCurrency, publicKey } = this.props;

		// TODO: test if pulicKey and cryptoCurrency are available and valid
		// Redirect to dashboard with error if not

		return (
			<Modal open={true}>
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
								<Typography variant="body2" gutterBottom>
									Receive {cryptoCurrency}
								</Typography>
							</Grid>
						</ModalHeader>

						<ModalBody>
							<div className={classes.tokenAddress}>
								<div className={classes.qrCode}>
									<QRCode value={publicKey} />
								</div>
								<Typography variant="body2" gutterBottom>
									Your Ethereum address to receive {cryptoCurrency}
								</Typography>
								<div className={classes.tokenPublicKey}>
									<Typography variant="body2" color="secondary" gutterBottom>
										{publicKey}
									</Typography>
									<Copy text={publicKey} />
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
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(withStyles(styles)(ReceiveTransfer));
