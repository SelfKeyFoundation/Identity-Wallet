import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core';
import MarketplaceNotariesComponent from './marketplace-notaries-component';
import TOCDisagreementPopup from './toc-disagreement-popup';

const styles = theme => ({});

class NotarizationTOCdisagreementComponent extends MarketplaceNotariesComponent {
	state = {};

	onBackClick = () => this.props.dispatch(push(this.processPath()));
	onReturnClick = () => this.props.dispatch(push(this.tocPath()));

	render() {
		return (
			<TOCDisagreementPopup
				onBackClick={this.onBackClick}
				onReturnClick={this.onReturnClick}
			/>
		);
	}
}

const mapStateToProps = () => {};

const styledComponent = withStyles(styles)(NotarizationTOCdisagreementComponent);
export const NotarizationTOCdisagreement = connect(mapStateToProps)(styledComponent);
export default NotarizationTOCdisagreement;
