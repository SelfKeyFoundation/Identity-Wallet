import React from 'react';
import { Provider, connect } from 'react-redux';
import store from '../../common/store';
import { getWallet } from 'common/wallet/selectors';
import { Grid, Typography, Paper, Modal, Divider, Button } from '@material-ui/core';
import {
	SelfkeyIcon,
	EthereumIcon,
	CustomIcon,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalBody,
	Copy
} from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TokenPrice from '../../common/token-price';

const styles = theme => ({
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
	tokenPrice: {
		padding: '20px 0'
	},
	tokenAddress: {
		padding: '20px 0'
	},
	actionButtons: {
		padding: '36px 0 12px 0',
		'& button': {
			marginRight: '20px'
		},
		'& svg': {
			width: '1em !important',
			height: '1em !important',
			marginRight: '0.5em'
		}
	},
	tokenPublicKey: {
		'& > p': {
			display: 'inline'
		},
		'& > button': {
			display: 'inline'
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

const getNameForToken = token => {
	let name = '';
	switch (token) {
		case 'KEY':
			name = 'Selfkey';
			break;
		case 'ETH':
			name = 'Ethereum';
			break;
		default:
			name = 'Custom Tokens';
	}
	return name;
};

export class Transfer extends React.Component {
	render() {
		const { classes, cryptoCurrency, publicKey } = this.props;
		return (
			<Provider store={store}>
				<Modal open={true}>
					<ModalWrap className={classes.modalWrap}>
						<Paper className={classes.modalContentWrapper}>
							<ModalCloseButton component={goBackDashboard}>
								<ModalCloseIcon />
							</ModalCloseButton>

							<ModalBody>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<div className={classes.cryptoIcon}>
										{getIconForToken(cryptoCurrency)}
									</div>
									<div>
										<Typography variant="h5">
											{getNameForToken(cryptoCurrency)}
										</Typography>
										<Typography variant="h2" className={classes.cryptoSymbol}>
											{cryptoCurrency}
										</Typography>
									</div>
								</Grid>
								<div className={classes.tokenPrice}>
									<TokenPrice cryptoCurrency={cryptoCurrency} />
								</div>
								<Divider />
								<div className={classes.tokenAddress}>
									<Typography variant="body2" gutterBottom>
										Your Address
									</Typography>
									<div className={classes.tokenPublicKey}>
										<Typography variant="body2" color="secondary" gutterBottom>
											{publicKey}
										</Typography>
										<Copy text={publicKey} />
									</div>
								</div>
								<Divider />
								<div className={classes.actionButtons}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="flex-start"
										spacing={0}
									>
										<Button variant="outlined" size="large">
											<CustomIcon /> Receive
										</Button>
										<Button variant="outlined" size="large">
											Send
										</Button>
									</Grid>
								</div>
							</ModalBody>
						</Paper>

						<Paper className={classes.modalContentWrapper}>
							<ModalBody>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<div>
										<Typography variant="h4">Activity</Typography>
									</div>
								</Grid>
							</ModalBody>
						</Paper>
					</ModalWrap>
				</Modal>
			</Provider>
		);
	}
}

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Transfer));
