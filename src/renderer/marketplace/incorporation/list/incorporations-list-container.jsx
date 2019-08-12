import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { IncorporationsListPage } from './incorporations-list-page';
import NoConnection from 'renderer/no-connection';

const styles = theme => ({});
const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';
const INCORPORATIONS_DETAIL_PATH = '/main/marketplace-incorporation/details';

class IncorporationsListContainer extends Component {
	componentDidMount() {
		if (!this.props.incorporations || !this.props.incorporations.length) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
	}

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	onDetailsClick = jurisdiction => {
		this.props.dispatch(
			push(
				`${INCORPORATIONS_DETAIL_PATH}/${jurisdiction['Company code']}/${
					jurisdiction['Country code']
				}/${jurisdiction.templateId}`
			)
		);
	};

	activeJurisdiction = jurisdiction => jurisdiction.show_in_wallet;

	render() {
		const { isLoading, incorporations, keyRate, isError } = this.props;

		if (!isLoading && isError) {
			return <NoConnection onBackClick={this.onBackClick} />;
		}

		const data = incorporations.filter(this.activeJurisdiction);

		return (
			<IncorporationsListPage
				keyRate={keyRate}
				data={data}
				onBackClick={this.onBackClick}
				onDetailsClick={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

IncorporationsListContainer.propTypes = {
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

const styledComponent = withStyles(styles)(IncorporationsListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as IncorporationsListContainer };
