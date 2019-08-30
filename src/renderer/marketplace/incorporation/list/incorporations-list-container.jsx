import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { marketplaceSelectors } from 'common/marketplace';
import { withStyles } from '@material-ui/core/styles';
import { IncorporationsListPage } from './incorporations-list-page';

const styles = theme => ({});
const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';
const INCORPORATIONS_DETAIL_PATH = '/main/marketplace-incorporation/details';

class IncorporationsListContainer extends Component {
	onBackClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	onDetailsClick = jurisdiction => {
		this.props.dispatch(
			push(
				`${INCORPORATIONS_DETAIL_PATH}/${jurisdiction.data.companyCode}/${
					jurisdiction.data.countryCode
				}/${jurisdiction.templateId}`
			)
		);
	};

	activeJurisdiction = jurisdiction => jurisdiction.status === 'active';

	render() {
		const { isLoading, incorporations, keyRate } = this.props;

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
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	return {
		incorporations: marketplaceSelectors.selectIncorporations(state),
		isLoading: marketplaceSelectors.isLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(IncorporationsListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as IncorporationsListContainer };
