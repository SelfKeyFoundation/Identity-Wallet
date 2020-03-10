import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
/*
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
*/
import { Grid, Typography, Paper, Modal, Divider /* Button */ } from '@material-ui/core';
import {
	/*
	SelfkeyIcon,
	EthereumIcon,
	CustomIcon,
	*/
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalBody
} from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
/*
import TokenPrice from '../../common/token-price';
import { push } from 'connected-react-router';
import TransactionsHistory from '../transactions-history';
*/

const styles = theme => ({
	cryptoIcon: {
		marginRight: '20px'
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modal: {
		height: '100%',
		overflow: 'auto'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent',
		width: '850px',
		left: 'calc(50% - 425px)'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: '20px'
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px',
			left: '70px'
		}
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
			width: '0.9em !important',
			height: '0.9em !important',
			marginRight: '0.5em'
		},
		'& svg path': {
			fill: '#09a8ba'
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
	transactionEntry: {
		display: 'flex',
		padding: '20px 0',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& svg path': {
			fill: 'transparent',
			stroke: '#93B0C1'
		}
	},
	transactionEntryDate: {
		width: '50px',
		textAlign: 'center'
	},
	transactionEntryIcon: {
		width: '100px',
		textAlign: 'center'
	},
	transactionEntryStatus: {
		width: 'calc(100% - 200px)'
	},
	transactionEntryAmount: {
		width: '100px',
		textAlign: 'right'
	}
});

const goBackDashboard = props => <Link to="/main/dashboard" {...props} />;
/*
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
*/
export class TokenSwapComponent extends PureComponent {
	componentDidMount() {}

	handleSend = () => {};

	handleReceive = _ => {};

	render() {
		const { classes } = this.props;

		return (
			<Modal open={true} className={classes.modal}>
				<ModalWrap className={classes.modalWrap}>
					<Paper className={classes.modalContentWrapper}>
						<ModalCloseButton className={classes.closeIcon} component={goBackDashboard}>
							<ModalCloseIcon />
						</ModalCloseButton>

						<ModalBody style={{ boxShadow: 'none' }}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
								spacing={16}
							>
								<div className={classes.cryptoIcon} />
								<div>
									<Typography variant="h5" />
									<Typography variant="h2" className={classes.cryptoSymbol} />
								</div>
							</Grid>
							<div className={classes.tokenPrice} />
							<Divider />
							<div className={classes.tokenAddress} />
							<Divider />
							<div className={classes.actionButtons} />
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

const TokenSwap = connect(mapStateToProps)(withStyles(styles)(TokenSwapComponent));
export default TokenSwap;
export { TokenSwap };
