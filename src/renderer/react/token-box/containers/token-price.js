import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as localeActions from 'common/locale/actions';
import { getLocale } from 'common/locale/selectors';
import { TokenPrice } from 'selfkey-ui';

const mapStateToProps = state => {
	return { locale: getLocale(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(localeActions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TokenPrice);
