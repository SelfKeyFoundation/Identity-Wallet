// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { CryptoPriceTable } from 'selfkey-ui';

const mapStateToProps = state => {
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		tokens: getTokens(state),
		alwaysVisible: ['', '0x4cc19356f2d37338b9802aa8e8fc58b0373296e7']
	};
};

const mapDispatchToProps = dispatch => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoPriceTable);
