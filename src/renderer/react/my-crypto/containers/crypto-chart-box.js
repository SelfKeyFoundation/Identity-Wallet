import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { viewAllOperations } from 'common/view-all-tokens';
import { CryptoChartBox } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';
import { getViewAll } from 'common/view-all-tokens/selectors';
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
	return bindActionCreators(viewAllOperations, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoChartBox);
