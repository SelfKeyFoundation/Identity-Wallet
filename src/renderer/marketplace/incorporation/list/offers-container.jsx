import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { IncorporationOffersPage } from './offers-page';
import NoConnection from 'renderer/no-connection';

const styles = theme => ({});
const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';
const INVORPORATION_DETAIL_PATH = '/main/marketplace-incorporation/details';

class IncorporationTableContainer extends Component {
	componentDidMount() {
		if (!this.props.incorporations || !this.props.incorporations.length) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
	}

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	onDetailsClick = ({ companyCode, countryCode, templateID }) => {
		let url = `${INVORPORATION_DETAIL_PATH}/${companyCode}/${countryCode}`;

		if (templateID) {
			url += `/${templateID}`;
		}

		this.props.dispatch(push(url));
	};

	render() {
		const { isLoading, incorporations, keyRate, isError } = this.props;

		if (!isLoading && isError) {
			return <NoConnection onBackClick={this.onBackClick} />;
		}

		const data = incorporations.filter(program => program.show_in_wallet);

		return (
			<IncorporationOffersPage
				keyRate={keyRate}
				data={data}
				onBackClick={this.onBackClick}
				onDetails={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

IncorporationTableContainer.propTypes = {
	incorporations: PropTypes.array,
	isLoading: PropTypes.bool,
	isError: PropTypes.any,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	return {
		incorporations: incorporationsSelectors.getMainIncorporationsWithTaxes(state),
		isLoading: incorporationsSelectors.getLoading(state),
		isError: incorporationsSelectors.getError(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(IncorporationTableContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as IncorporationTableContainer };
