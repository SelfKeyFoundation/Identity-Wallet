import React from 'react';
import { connect } from 'react-redux';
import { getExchangeLinks } from 'common/exchanges/selectors';
import { WithoutBalance, UnlockBox } from 'selfkey-ui';

const WithoutBalanceContainer = props => {
	return (
		<UnlockBox closeAction={props.closeAction}>
			<WithoutBalance {...props} />
		</UnlockBox>
	);
};

const mapStateToProps = state => {
	return {
		exchanges: getExchangeLinks(state)
	};
};

export default connect(mapStateToProps)(WithoutBalanceContainer);
