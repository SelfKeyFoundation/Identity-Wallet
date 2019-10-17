import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';
import NotarizationDetailsPage from './notarization-details-page';

const styles = theme => ({});

class NotarizationDetailsContainer extends MarketplaceNotariesComponent {
	state = {
		tab: 'types'
	};

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onTabChange = tab => this.setState({ tab });

	render() {
		const { isLoading, keyRate } = this.props;

		return (
			<NotarizationDetailsPage
				onBackClick={this.onBackClick}
				keyRate={keyRate}
				loading={isLoading}
				tab={this.state.tab}
				onTabChange={this.onTabChange}
			/>
		);
	}
}

NotarizationDetailsContainer.propTypes = {
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

const styledComponent = withStyles(styles)(NotarizationDetailsContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as NotarizationDetailsContainer };
