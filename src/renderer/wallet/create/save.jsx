import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { WarningShieldIcon } from 'selfkey-ui';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../../common';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { appSelectors, appOperations } from 'common/app';

const useStyles = makeStyles(theme => ({
	bottomSpace: {
		marginBottom: '50px'
	},
	icon: {
		marginRight: '45px'
	},
	button: {
		marginTop: '10px'
	}
}));

const backHome = React.forwardRef((props, ref) => <Link to="/home" {...props} ref={ref} />);

export const SaveWallet = props => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const app = useSelector(appSelectors.selectApp);

	const handleSkip = () =>
		dispatch(
			appOperations.unlockWalletWithPrivateKeyOperation(app.selectedPrivateKey, '', false)
		);

	const handleNext = () => dispatch(push('/createPassword'));

	return (
		<Popup closeComponent={backHome} open text="Protect Your Wallet">
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				wrap="nowrap"
			>
				<Grid item className={classes.icon}>
					<WarningShieldIcon />
				</Grid>
				<Grid item>
					<Typography variant="body1">
						The SelfKey Identity Wallet protects your wallet and Ethereum address with a
						password. You must remember this password to unlock the wallet. It cannot be
						restored or reset. As the wallet is stored locally in your device, SelfKey
						does not have access and cannot help you if the password is lost.
					</Typography>
					<Typography variant="body1" className={classes.bottomSpace}>
						Do you want to store this wallet?
					</Typography>
					<Button
						id="protectWallet"
						variant="outlined"
						onClick={handleNext}
						color="primary"
					>
						YES, AND I UNDERSTAND THERE IS NO WAY TO RECOVER THIS PASSWORD
					</Button>
					<Button
						id="protectWallet"
						variant="outlined"
						onClick={handleSkip}
						color="secondary"
						className={classes.button}
					>
						NO, SKIP THIS STEP
					</Button>
					{app.error !== '' && (
						<div>
							<Typography variant="subtitle2" color="error" gutterBottom>
								{app.error}
							</Typography>
						</div>
					)}
				</Grid>
			</Grid>
		</Popup>
	);
};

export default SaveWallet;
