/**
 * NOT USED, KEPT HERE FOR FUTURE REFERENCE
 */
import React, { PureComponent } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import history from 'common/store/history';
import { Popup } from '../../common';

const styles = theme => ({
	cancel: {
		paddingLeft: '20px'
	}
});

const selfkeyId = React.forwardRef((props, ref) => (
	<Link to="/main/selfkeyId" {...props} ref={ref} />
));
const main = React.forwardRef((props, ref) => <Link to="/main/dashboard" {...props} ref={ref} />);

class SelfKeyIdCreateDisclaimerComponent extends PureComponent {
	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
	};

	render() {
		const { classes } = this.props;
		return (
			<Popup displayLogo open text="What Are ID Attributes & Documents?">
				<Grid container direction="row" justify="flex-start" alignItems="flex-start">
					<Grid item>
						<Typography variant="body1" gutterBottom>
							Your identity profile is broken down into two parts: attributes and
							documents. Attributes are details about your identity such as birthday,
							phone, address, and city. Documents are proof of your identity such as a
							passport or utility bill.
						</Typography>
						<br />
						<br />
						<Typography variant="body1" gutterBottom>
							We{"'"}ll be adding more features in the future, such as blockchain
							verified claims in your identity profile. All attributes and documents
							regarding your identity profile are stored locally on your computer, and
							SelfKey does not have any access to your information.
						</Typography>
						<br />
						<br />
						<br />
					</Grid>
					<Grid item>
						<Button
							id="selfkeyIdDisclaimerButton"
							variant="contained"
							size="large"
							component={selfkeyId}
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

export const SelfKeyIdCreateDisclaimer = withStyles(styles)(SelfKeyIdCreateDisclaimerComponent);

export default SelfKeyIdCreateDisclaimer;
