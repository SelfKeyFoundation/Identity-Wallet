import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { WarningShieldIcon } from 'selfkey-ui';
import { Popup } from '../../common';

const createPasswordLink = props => <Link to="/createPassword" {...props} />;
const backHome = props => <Link to="/home" {...props} />;

const styles = theme => ({
	bottomSpace: {
		marginBottom: '50px'
	},
	icon: {
		marginRight: '45px'
	}
});

export const CreateWallet = props => {
	const { classes } = props;
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
					<Typography variant="body1" className={classes.bottomSpace}>
						The SelfKey Identity Wallet protects your wallet and Ethereum address with a
						password. You must remember this password to unlock the wallet. It cannot be
						restored or reset. As the wallet is stored locally in your device, SelfKey
						does not have access and cannot help you if the password is lost.
					</Typography>
					<Button
						id="protectWallet"
						variant="outlined"
						component={createPasswordLink}
						size="large"
						color="secondary"
						fullWidth
					>
						I UNDERSTAND, THERE IS NO WAY TO RECOVER THIS PASSWORD
					</Button>
				</Grid>
			</Grid>
		</Popup>
	);
};

export default withStyles(styles)(CreateWallet);
