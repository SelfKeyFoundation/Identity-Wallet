import React, { PureComponent } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import history from 'common/store/history';
import { Popup } from '../../../common';

const styles = theme => ({
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	}
});

const selfkeyIdCreateDisclaimer = React.forwardRef((props, ref) => (
	<Link to="/selfkeyIdCreateDisclaimer" {...props} ref={ref} />
));

const main = React.forwardRef((props, ref) => <Link to="/main/dashboard" {...props} ref={ref} />);

class SelfKeyIdCreateAboutComponent extends PureComponent {
	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
	};

	render() {
		const { classes } = this.props;
		return (
			<Popup displayLogo open text="About the SelfKey Identity Wallet">
				<Grid container direction="row" justify="flex-start" alignItems="flex-start">
					<Grid item>
						<Typography variant="body1" gutterBottom>
							Inside the SelfKey Identity Wallet you can manage, own, and fully
							control various parts of your SelfKey ID. It is also a direct interface
							to the Ethereum blockchain, allowing you to manage all of your ETH and
							ERC-20 token assets inside the wallet.
						</Typography>
						<br />
						<br />
						<Typography variant="body1" gutterBottom>
							After building out your SelfKey ID, you can unlock products and services
							inside the SelfKey Marketplace by staking KEY tokens. Think of staking
							like a refundable deposit. Staking is required to prevent spam and to
							secure all parties interact in a professional and respectable manner. To
							learn more about this,{' '}
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
			</Popup>
		);
	}
}

export const SelfKeyIdCreateAbout = withStyles(styles)(SelfKeyIdCreateAboutComponent);

export default SelfKeyIdCreateAbout;
