import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { pricesSelectors } from 'common/prices';
import { identitySelectors } from 'common/identity';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplacePassportsComponent } from '../common/marketplace-passports-component';
import { PassportsListPage } from './passports-list-page';

const styles = theme => ({});

class PassportsListContainerComponent extends MarketplacePassportsComponent {
	state = {
		type: 'passport'
	};

	componentDidMount() {
		this.trackMarketplaceVisit('passports');
	}

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onTypeChange = type => this.setState({ type });

	onDetailsClick = program => {
		console.log(program);
		const { programCode, countryCode } = program.data;
		const { templateId, vendorId } = program;
		console.log({ programCode, countryCode, templateId, vendorId });
		this.props.dispatch(
			push(this.detailsRoute({ programCode, countryCode, templateId, vendorId }))
		);
	};

	render() {
		const { isLoading, keyRate, vendors, inventory } = this.props;
		let { type } = this.state;

		const passports = inventory.filter(
			bank =>
				bank.data.programTypeResidencyVsCitizenshipOnly &&
				bank.data.programTypeResidencyVsCitizenshipOnly.includes('Citizenship')
		);
		const residencies = inventory.filter(
			bank =>
				bank.data.programTypeResidencyVsCitizenshipOnly &&
				!bank.data.programTypeResidencyVsCitizenshipOnly.includes('Citizenship')
		);

		return (
			<PassportsListPage
				keyRate={keyRate}
				vendors={vendors}
				passports={passports}
				residencies={residencies}
				onBackClick={this.onBackClick}
				type={type}
				onTypeChange={this.onTypeChange}
				onDetails={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

PassportsListContainerComponent.propTypes = {
	inventory: PropTypes.array,
	vendors: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		identity,
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'passports'),
		inventory: marketplaceSelectors.selectPassports(state, identity.type),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(PassportsListContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as PassportsListContainer };
