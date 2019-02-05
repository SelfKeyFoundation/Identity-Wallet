import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import { Grid, Typography, Paper, Modal } from '@material-ui/core';
import { SelfkeyIcon, ModalWrap, ModalCloseButton, ModalCloseIcon, ModalBody } from 'selfkey-ui';
// import { SelfkeyIcon, EthereumIcon, CustomIcon, CustomTokenText } from 'selfkey-ui';
import { Link } from 'react-router-dom';
// import TransactionSendBox from './containers/transaction-send-box';
import { withStyles } from '@material-ui/core/styles';
import TokenPrice from '../../common/token-price';

const styles = theme => ({
	logo: {
		width: '50px',
		height: '65px'
	},
	container: {
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	passwordIcon: {
		width: '66px',
		height: '76px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	passwordScore: {
		width: '100%'
	},
	passwordInput: {
		width: '100%'
	},
	modalContentWrapper: {}
});

const goBackDashboard = props => <Link to="/main/dashboard" {...props} />;

export class TransactionSendBoxWrapper extends React.Component {
	render() {
		const { classes, cryptoCurrency } = this.props;
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
									<SelfkeyIcon />
									<div>
										<Typography variant="h3">Selfkey</Typography>
										<Typography variant="h5">{cryptoCurrency}</Typography>
									</div>
								</Grid>
								<div>
									<TokenPrice cryptoCurrency={cryptoCurrency} />
								</div>
							</ModalBody>
						</Paper>
					</ModalWrap>
				</Modal>
			</Provider>
		);
	}
}

export default withStyles(styles)(TransactionSendBoxWrapper);
