import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import RequirePayment from './require-payment-popup';

const styles = theme => ({});

class CertifiersRequirePaymentContainer extends PureComponent {
	state = {};

	render() {
		const { name, address } = this.props;
		return <RequirePayment name={name} address={address} />;
	}
}

const mapStateToProps = (state, props) => {};

const styledComponent = withStyles(styles)(CertifiersRequirePaymentContainer);
const CertifiersDashboard = connect(mapStateToProps)(styledComponent);
export default CertifiersDashboard;
