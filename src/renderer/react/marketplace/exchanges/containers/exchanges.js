import { connect } from 'react-redux';
import { getExchanges } from 'common/exchanges/selectors';
import { Items } from 'selfkey-ui';

const mapStateToProps = state => {
	return {
		items: getExchanges(state),
		category: 'Exchanges'
	};
};

export default connect(mapStateToProps)(Items);
