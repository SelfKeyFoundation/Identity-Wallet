import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as localeActions from 'common/locale/actions';
import * as fiatCurrencyActions from 'common/fiatCurrency/actions';
import * as walletTokensActions from 'common/wallet-tokens/actions';
import * as viewAllActions from 'common/view-all/actions';
import { CryptoChartBox } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';
import { getViewAll } from 'common/view-all/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getVisibleTokens, getTopTokenListSize } from 'common/wallet-tokens/selectors';

const mapStateToProps = state => {
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		tokens: getVisibleTokens(state),
		topTokenListSize: getTopTokenListSize(state),
		...getViewAll(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{ ...localeActions, ...fiatCurrencyActions, ...walletTokensActions, ...viewAllActions },
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoChartBox);
