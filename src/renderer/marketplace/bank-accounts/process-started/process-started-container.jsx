import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { MarketplaceProcessStarted } from '../../common/marketplace-process-started';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = `/main/marketplace-bank-accounts`;
const SELFKEY_PATH = `/main/selfkeyId`;

// TODO: future improvement load from rp config
const VENDOR_EMAIL = `support@flagtheory.com`;

class BankAccountsProcessStartedContainer extends Component {
	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	onSelfKeyClick = () => this.props.dispatch(push(SELFKEY_PATH));

	render() {
		const body = (
			<React.Fragment>
				<Typography variant="h1" gutterBottom>
					Bank Account Process Started
				</Typography>
				<Typography variant="body1" gutterBottom>
					Thank you for payment!
				</Typography>
				<Typography variant="body2" gutterBottom>
					One of our managers is reviewing the information you submitted and{' '}
					<strong>will contact you shortly on the e-mail you provided</strong>, to
					continue the process. If you have any questions in the meantime, you can reach
					us at:
				</Typography>
				<Typography variant="body2" color="primary" gutterBottom className="email">
					{VENDOR_EMAIL}
				</Typography>
			</React.Fragment>
		);

		return (
			<MarketplaceProcessStarted
				title={`KYC Process Started`}
				body={body}
				onBackClick={this.onBackClick}
				onSelfKeyClick={this.onSelfKeyClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {};

const styledComponent = withStyles(styles)(BankAccountsProcessStartedContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsProcessStartedContainer };
