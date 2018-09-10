import { connect } from 'react-redux';
import { getItemDetails, hasBalance } from 'common/exchanges/selectors';
import { ItemDetails } from 'selfkey-ui';

const mapStateToProps = (state, props) => {
	return {
		item: getItemDetails(state, props.name).data,
		hasBalance: hasBalance(state, props.name)
	};
};

export default connect(mapStateToProps)(ItemDetails);
