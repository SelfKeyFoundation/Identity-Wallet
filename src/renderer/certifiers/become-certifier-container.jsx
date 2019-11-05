import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import BecomeCertifierPage from './become-certifier-page';

const styles = theme => ({});

class BecomeCertifierComponent extends Component {
	handleWhatsThisClicked = e => {
		window.openExternal(e, 'https://help.selfkey.org/');
	};

	// rootPath = () => `/main/certifiers`;

	// onStartClick = () => props.dispatch(push('/main/crypto-manager'));
	// onBackClick = () => props.dispatch(push('/main/certifiers'));

	render() {
		return (
			<BecomeCertifierPage
				handleWhatsThisClicked={this.handleWhatsThisClicked}
				onBackClick={() => this.props.dispatch(push('/main/crypto-manager'))}
				onStartClick={() => this.props.dispatch(push('/main/certifiers/dashboard'))}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {};

const styledComponent = withStyles(styles)(BecomeCertifierComponent);
const BecomeCertifier = connect(mapStateToProps)(styledComponent);
export default BecomeCertifier;
