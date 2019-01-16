import React from 'react';
import { connect } from 'react-redux';
import { getExchangeLinks } from 'common/exchanges/selectors';
import WithoutBalance from './without-balance';
import UnlockBox from './unlock-box';

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
