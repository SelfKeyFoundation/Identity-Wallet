import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as localeActions from 'common/locale/actions';
import { CryptoPriceBox } from 'selfkey-ui';
import { getLocale } from 'common/locale/selectors';

const mapStateToProps = state => {
	return { locale: getLocale(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(localeActions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoPriceBox);
