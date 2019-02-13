import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import { SelfkeyDarkTheme } from 'selfkey-ui';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import IncorporationsTable from './table';
import IncorporationsDetailView from './detail-view';

const styles = theme => ({
	body: {
		minHeight: '90vh'
	}
});

class MarketplaceIncorporationComponent extends Component {
	state = {
		companyCode: false,
		countryCode: false
	};

	handleDetailClick = (companyCode, countryCode) => {
		this.setState({ companyCode, countryCode });
	};

	render() {
		const { classes } = this.props;
		const { companyCode, countryCode } = this.state;
		let view = null;

		if (companyCode && countryCode) {
			view = (
				<IncorporationsDetailView
					{...this.props}
					companyCode={companyCode}
					countryCode={countryCode}
					onBackClick={this.handleDetailClick}
				/>
			);
		} else {
			view = <IncorporationsTable {...this.props} onDetailClick={this.handleDetailClick} />;
		}

		return (
			<Provider store={store}>
				<SelfkeyDarkTheme>
					<Grid item id="body" xs={12} className={classes.body}>
						{view}
					</Grid>
				</SelfkeyDarkTheme>
			</Provider>
		);
	}
}

const MarketplaceIncorporationPage = withStyles(styles)(MarketplaceIncorporationComponent);

export { MarketplaceIncorporationPage };
