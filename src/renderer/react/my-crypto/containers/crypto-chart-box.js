import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as localeActions from 'common/locale/actions';
import * as fiatCurrencyActions from 'common/fiatCurrency/actions';
import { CryptoChartBox } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';

const mapStateToProps = state => {
	return { ...getLocale(state), ...getFiatCurrency(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...localeActions, ...fiatCurrencyActions }, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoChartBox);
