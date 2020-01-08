import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import NotarizationProcess from './notarization-process-popup';

const styles = theme => ({});

class NotarizationProcessContainer extends PureComponent {
	state = {};

	render() {
		const { status, summary } = this.props;
		return <NotarizationProcess status={status} summary={summary} />;
	}
}

const mapStateToProps = (state, props) => {};

const styledComponent = withStyles(styles)(NotarizationProcessContainer);
const CertifiersDashboard = connect(mapStateToProps)(styledComponent);
export default CertifiersDashboard;
