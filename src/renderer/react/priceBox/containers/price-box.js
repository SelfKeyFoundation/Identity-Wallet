import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PriceBox from '../components/price-box';
import * as localeActions from 'common/locale/actions';

const mapStateToProps = state => {
	console.log('State', state);
	return { locale: state.locale, test: state.test };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(localeActions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PriceBox);
