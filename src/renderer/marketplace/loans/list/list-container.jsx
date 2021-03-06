import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { LoansListPage } from './list-page';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceLoansComponent } from '../common/marketplace-loans-component';
import { identitySelectors } from 'common/identity';
import { getTokens } from 'common/wallet-tokens/selectors';
import { walletSelectors, walletOperations } from 'common/wallet';
import { fiatCurrencyOperations, fiatCurrencySelectors } from 'common/fiatCurrency';

const styles = theme => ({});

class LoansListContainer extends MarketplaceLoansComponent {
	componentDidMount() {
		window.scrollTo(0, 0);
		this.props.dispatch(fiatCurrencyOperations.loadExchangeRatesOperation());

		this.trackMatomoGoal('MarketplaceVisitIndividualLoans', 'MarketplaceVisitCorporateLoans');
		this.trackMarketplaceVisit('loans');
	}

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onDetailsClick = offer => this.props.dispatch(push(this.detailsRoute(offer.id)));

	onCloseCalculatorCardClick = () =>
		this.props.dispatch(walletOperations.setLoanCardStatusOperation(true));

	render() {
		const { isLoading, rates, vendors, inventory, tokens, cardHidden, fiatRates } = this.props;
		return (
			<LoansListPage
				vendors={vendors}
				inventory={inventory}
				onBackClick={this.onBackClick}
				onDetailsClick={this.onDetailsClick}
				rates={rates}
				onCloseCalculatorCardClick={this.onCloseCalculatorCardClick}
				loading={isLoading}
				tokens={tokens}
				cardHidden={cardHidden}
				fiatRates={fiatRates}
			/>
		);
	}
}

LoansListContainer.propTypes = {
	identity: PropTypes.object,
	inventory: PropTypes.array,
	vendors: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number,
	tokens: PropTypes.array,
	rates: PropTypes.array
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		identity,
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'loans'),
		inventory: marketplaceSelectors.selectLoansInventory(state, identity.type),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		rates: pricesSelectors.getPrices(state).prices,
		cardHidden: walletSelectors.getLoanCalculatorCardStatus(state),
		tokens: getTokens(state),
		fiatRates: fiatCurrencySelectors.selectFiatRates(state)
	};
};

const styledComponent = withStyles(styles)(LoansListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as LoansListContainer };
