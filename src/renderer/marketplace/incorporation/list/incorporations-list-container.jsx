import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { marketplaceSelectors } from 'common/marketplace';
import { IncorporationsListPage } from './incorporations-list-page';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class IncorporationsListContainer extends MarketplaceIncorporationsComponent {
	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onDetailsClick = jurisdiction => {
		const { companyCode, countryCode } = jurisdiction.data;
		const { templateId, vendorId } = jurisdiction;
		this.props.dispatch(
			push(this.detailsRoute({ companyCode, countryCode, templateId, vendorId }))
		);
	};

	render() {
		const { isLoading, incorporations, keyRate } = this.props;

		const data = incorporations.filter(jurisdiction => jurisdiction.status === 'active');

		return (
			<IncorporationsListPage
				keyRate={keyRate}
				data={data}
				onBackClick={this.onBackClick}
				onDetailsClick={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

IncorporationsListContainer.propTypes = {
	incorporations: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		incorporations: marketplaceSelectors.selectIncorporations(state, identity.type),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(IncorporationsListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as IncorporationsListContainer };
