import { connect } from 'react-redux';
import { getExchangeLinks } from 'common/exchanges/selectors';
import { WithoutBalance } from 'selfkey-ui';

const mapStateToProps = state => {
	return {
		exchanges: getExchangeLinks(state)
	};
};

export default connect(mapStateToProps)(WithoutBalance);
