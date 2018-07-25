import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import * as localeActions from 'common/locale/actions';

import { TokenBox } from 'selfkey-ui';
const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(localeActions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TokenBox);
