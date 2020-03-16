import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import { Popup, InputTitle } from '../../common';
/*
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
*/
import { Grid, Select, Input, Typography, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
/*
import TokenPrice from '../../common/token-price';
import { push } from 'connected-react-router';
import TransactionsHistory from '../transactions-history';
*/

const styles = theme => ({
	body: {
		color: '#FFFFFF',
		fontFamily: 'Proxima Nova',
		fontSize: '18px',
		lineHeight: '30px',
		width: '100%',
		'& > div': {
			marginBottom: '30px'
		}
	},
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	},
	tokenMax: {
		display: 'flex',
		flexWrap: 'nowrap'
	},
	amountInput: {
		borderTopRightRadius: '0',
		borderBottomRightRadius: '0'
	},
	maxSourceInput: {
		border: '1px solid #384656',
		marginRight: '45px',
		fontWeight: 'normal',
		color: '#93B0C1',
		background: '#1E262E',
		borderTopLeftRadius: '0',
		borderBottomLeftRadius: '0'
	},
	divider: {
		margin: '40px 0'
	}
});

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
	state = {
		sourceToken: 'ETH',
		targetToken: 'KEY',
		amount: 0
	};
	componentDidMount() {}

	handleSend = () => {};

	handleReceive = () => {};

	handleSourceTokenChange = () => {};

	handleTargetTokenChange = () => {};

	handleAmountChange = () => {};

	handleExchange = () => {};

	renderSelectSourceTokenItems = () => null;

	renderSelectTargetTokenItems = () => null;

	render() {
		const { classes, closeAction } = this.props;

		return (
			<Popup closeAction={closeAction} text="Swap your tokens">
				<Grid container direction="column" justify="flex-start" alignItems="flex-start">
					<Grid item id="body" className={classes.body}>
						<div>
							<InputTitle title="Token" />
							<Select
								className={classes.cryptoSelect}
								value={this.state.sourceToken}
								onChange={e => this.handleSourceTokenChange(e)}
								name="source"
								disableUnderline
								IconComponent={KeyboardArrowDown}
								input={<Input disableUnderline />}
							>
								{this.renderSelectSourceTokenItems()}
							</Select>
						</div>
						<div>
							<InputTitle title="Change to" />
							<Select
								className={classes.cryptoSelect}
								value={this.state.targetToken}
								onChange={e => this.handleTargetTokenChange(e)}
								name="target"
								disableUnderline
								IconComponent={KeyboardArrowDown}
								input={<Input disableUnderline />}
							>
								{this.renderSelectTargetTokenItems()}
							</Select>
						</div>
						<div>
							<Typography variant="body2" color="secondary">
								Available:
								<span style={{ color: '#fff', fontWeight: 'bold' }}>
									{this.state.amount}
									{'USD'}
								</span>
							</Typography>
						</div>
						<div>
							<InputTitle title="Amount" />
							<div className={classes.tokenMax}>
								<Input
									type="text"
									onChange={this.handleAmountChange}
									value={this.state.amount}
									placeholder="0.00"
									className={classes.amountInput}
									fullWidth
								/>
								<Button
									onClick={this.handleAllAmountClick}
									variant="outlined"
									size="large"
									className={classes.maxSourceInput}
								>
									USD
								</Button>
								<Button
									onClick={this.handleAllAmountClick}
									variant="outlined"
									size="large"
								>
									Max
								</Button>
							</div>
						</div>
						<Divider className={classes.divider} />
						<div>
							<Typography variant="body2" color="secondary">
								Network Transaction Fee:
								<span style={{ color: '#fff', fontWeight: 'bold' }}>
									{this.state.amount}
									{'USD'}
								</span>
							</Typography>
						</div>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="center"
							className={classes.actionButtonsContainer}
							spacing={24}
						>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={this.handleExchange}
								>
									Exchange
								</Button>
							</Grid>
							<Grid item>
								<Typography variant="body2" color="secondary">
									Exchange Rate:
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
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
