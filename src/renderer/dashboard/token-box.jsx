import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import { TokenBox } from 'selfkey-ui';

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(TokenBox);
