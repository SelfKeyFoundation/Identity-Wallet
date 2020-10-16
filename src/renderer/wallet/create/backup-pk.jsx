import React, { PureComponent } from 'react';
import { Grid, Typography, Input, Button, InputAdornment } from '@material-ui/core';
import { PrintIcon, VisibilityOnIcon, VisibilityOffIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { Link } from 'react-router-dom';
import { Popup } from '../../common';
import { getGlobalContext } from 'common/context';

const styles = theme => ({
	bottomSpace: {
		marginBottom: '50px'
	},
	buttonBottomSpace: {
		marginBottom: '20px'
	},
	container: {
		minHeight: '100vh'
	},
	downloadIcon: {
		width: '66px',
		height: '71px'
	},
	icon: {
		marginRight: '45px'
	},
	input: {
		display: 'none'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent',
		boxShadow: 'none'
	},
	paper: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	publicKey: {
		color: '#fff !important',
		opacity: '1 !important'
	},
	root: {
		top: '-50px'
	}
});

const main = React.forwardRef((props, ref) => <Link to="/main/dashboard" {...props} ref={ref} />);

class BackupPK extends PureComponent {
	state = {
		inputType: 'password',
		visibilityComponent: <VisibilityOffIcon />
	};

	handleVisibility = event => {
		if (this.state.inputType === 'password') {
			this.setState({
				...this.state,
				inputType: 'text',
				visibilityComponent: <VisibilityOnIcon />
			});
		} else {
			this.setState({
				...this.state,
				inputType: 'password',
				visibilityComponent: <VisibilityOffIcon />
			});
		}
	};

	handlePrintClick = event => {
		window.print();
		getGlobalContext().matomoService.trackEvent(
			'wallet_setup',
			'print_private_key',
			undefined,
			undefined,
			true
		);
	};

	render() {
		const { classes } = this.props;
		return (
			<Popup
				closeAction={this.handleBackAction}
				open
				displayLogo
				text="Step 4: Backup Your Private Keys"
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<PrintIcon className={classes.downloadIcon} />
					</Grid>
					<Grid item>
						<Typography variant="body1" className={classes.bottomSpace}>
							Your private key is used to authorize transactions for sending Ether or
							tokens on your Ethereum address. Do not share this with anyone, as this
							will give them full access to move your assets somewhere else. You can
							print a copy to make an offline backup. This is also known as &#34;cold
							storage&#34;.
						</Typography>
						<Typography variant="overline" gutterBottom>
							Your Private Key
						</Typography>
						<Input
							id="privateKey"
							fullWidth
							disableUnderline={true}
							value={this.props.privateKey}
							endAdornment={
								<InputAdornment position="start">
									<div onClick={this.handleVisibility}>
										{this.state.visibilityComponent}
									</div>
								</InputAdornment>
							}
							type={this.state.inputType}
							disabled
							className={`${classes.publicKey} ${classes.bottomSpace}`}
						/>
						<Button
							variant="contained"
							size="large"
							fullWidth
							onClick={e => this.handlePrintClick()}
							className={classes.buttonBottomSpace}
						>
							PRINT MY PRIVATE KEY
						</Button>
						{this.state.showFileDownloadedResult && this.showFileDownloadedResult()}
						<Button
							id="printWalletNext"
							variant="outlined"
							color="secondary"
							component={main}
							size="large"
							fullWidth
						>
							MY PRIVATE KEY IS BACKED UP, CONTINUE
						</Button>
					</Grid>
				</Grid>
				<span className="printPK" style={{ display: 'none' }}>
					{this.props.privateKey}
				</span>
				<style>{`@media print {.modalContent {display: none;} .printPK {display: block !important; text-align: center; color: #000000}}`}</style>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		privateKey: walletSelectors.getWallet(state).privateKey
	};
};

export default connect(mapStateToProps)(withStyles(styles)(BackupPK));
