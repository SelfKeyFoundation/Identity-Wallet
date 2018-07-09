import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as localeActions from 'common/locale/actions';
import { CryptoPriceBox } from 'selfkey-ui';

const mapStateToProps = state => {
	return { locale: state.locale, test: state.test };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(localeActions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CryptoPriceBox);
