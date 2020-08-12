import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import MarketplaceNotariesComponent from './marketplace-notaries-component';
import TOCPopup from './toc-popup';

const styles = theme => ({});

class NotarizationTOCComponent extends MarketplaceNotariesComponent {
	state = {};

	onBackClick = () => this.props.dispatch(push(this.rootPath()));

	onDisagreeClick = () => this.props.dispatch(push(this.tocDisagreementRoute()));

	onAgreeClick = () => this.props.dispatch(push(this.checkoutRoute()));

	render() {
		return (
			<TOCPopup
				onBack={this.onBackClick}
				onDisagree={this.onDisagreeClick}
				onAgree={this.onAgreeClick}
			/>
		);
	}
}

const mapStateToProps = () => {
	return {};
};

const styledComponent = withStyles(styles)(NotarizationTOCComponent);
export const NotarizationTOC = connect(mapStateToProps)(styledComponent);
export default NotarizationTOC;
