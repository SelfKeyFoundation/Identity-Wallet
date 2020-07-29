import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { Typography, Divider } from '@material-ui/core';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceProcessStarted } from '../../common/marketplace-process-started';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = `/main/marketplace/bank-accounts`;
const SELFKEY_PATH = `/main/selfkeyId`;

class BankAccountsProcessStartedContainer extends PureComponent {
	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	onSelfKeyClick = () => this.props.dispatch(push(SELFKEY_PATH));

	render() {
		const { vendor } = this.props;
		const body = (
			<React.Fragment>
				<Typography variant="h1" className="title">
					Bank Account Process Started
				</Typography>
				<Typography variant="body1" gutterBottom>
					Thank you for payment!
				</Typography>
				<Typography variant="body1" gutterBottom>
					One of our managers is reviewing the information you submitted and{' '}
					<strong>will contact you shortly on the e-mail you provided</strong>, to
					continue the process. If you have any questions in the meantime, you can reach
					us at:
				</Typography>
				<Typography variant="body1" color="primary" className="email">
					{vendor.contactEmail}
				</Typography>
				<Divider className="divider" />
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

const mapStateToProps = (state, props) => {
	const { vendorId } = props.match.params;
	return {
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId)
	};
};

const styledComponent = withStyles(styles)(BankAccountsProcessStartedContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsProcessStartedContainer };
