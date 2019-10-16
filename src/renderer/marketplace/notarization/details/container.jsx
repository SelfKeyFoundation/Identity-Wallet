import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';
import NotarizationDetailsPage from './details-page';

const styles = theme => ({});

class NotariesTableContainer extends MarketplaceNotariesComponent {
	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	render() {
		const { isLoading, keyRate } = this.props;

		return (
			<NotarizationDetailsPage
				onBackClick={this.onBackClick}
				keyRate={keyRate}
				loading={isLoading}
				tab={this.tab}
			/>
		);
	}
}

NotariesTableContainer.propTypes = {
	// inventory: PropTypes.array,
	// vendors: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	return {
		// vendors: marketplaceSelectors.selectVendorsForCategory(state, 'banking'),
		// inventory: marketplaceSelectors.selectBanks(state),
		isLoading: marketplaceSelectors.isLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(NotariesTableContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as NotariesTableContainer };
