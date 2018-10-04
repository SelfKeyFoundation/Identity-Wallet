import { connect } from 'react-redux';
import { TransactionError } from 'selfkey-ui';
import { getWallet } from 'common/wallet/selectors';

const mapStateToProps = state => {
	return {
		publicKey: '0x' + getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(TransactionError);
