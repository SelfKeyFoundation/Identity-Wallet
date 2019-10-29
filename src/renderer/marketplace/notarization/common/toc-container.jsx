import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core';
import MarketplaceNotariesComponent from './marketplace-notaries-component';
import TOCPopup from './toc-popup';

const styles = theme => ({});

class NotarizationTOCComponent extends MarketplaceNotariesComponent {
	state = {};

	onBackClick = () => this.props.dispatch(push(this.processPath()));
	onDisagreeClick = () => this.props.dispatch(push(this.tocDisagreementPath()));
	// onAgreeClick = () => this.props.dispatch(push(this.rootPath()));

	render() {
		return <TOCPopup onBackClick={this.onBackClick} onDisagreeClick={this.onDisagreeClick} />;
	}
}

const mapStateToProps = () => {};

const styledComponent = withStyles(styles)(NotarizationTOCComponent);
export const NotarizationTOC = connect(mapStateToProps)(styledComponent);
export default NotarizationTOC;
