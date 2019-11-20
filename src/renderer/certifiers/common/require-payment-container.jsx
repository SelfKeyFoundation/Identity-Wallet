import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import RequirePayment from './require-payment-popup';

const styles = theme => ({});

class CertifiersRequirePaymentContainer extends PureComponent {
	state = {};

	render() {
		return <RequirePayment />;
	}
}

const mapStateToProps = (state, props) => {};

const styledComponent = withStyles(styles)(CertifiersRequirePaymentContainer);
const CertifiersDashboard = connect(mapStateToProps)(styledComponent);
export default CertifiersDashboard;
