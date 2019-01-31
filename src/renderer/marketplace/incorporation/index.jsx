import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import { IncorporationsIcon, SelfkeyDarkTheme } from 'selfkey-ui';
import { Typography, Grid } from '@material-ui/core';
import injectSheet from 'react-jss';

import IncorporationsTable from './table';
import IncorporationsDetailView from './detail-view';

const styles = {
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '38px'
	},
	headerTitle: {
		paddingLeft: '21px'
	}
};

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
					<Grid container justify="center" alignItems="center">
						<Grid item id="header" className={classes.header} xs={12}>
							<IncorporationsIcon />
							<Typography variant="h1" gutterBottom className={classes.headerTitle}>
								Incorporation Marketplace
							</Typography>
						</Grid>
						<Grid item id="body" xs={12}>
							{view}
						</Grid>
					</Grid>
				</SelfkeyDarkTheme>
			</Provider>
		);
	}
}

const MarketplaceIncorporationPage = injectSheet(styles)(MarketplaceIncorporationComponent);

export { MarketplaceIncorporationPage };
