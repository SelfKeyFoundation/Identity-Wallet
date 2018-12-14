import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import { H1, SelfkeyIcon, SelfkeyDarkTheme } from 'selfkey-ui';
import { Grid } from '@material-ui/core';
import injectSheet from 'react-jss';

import IncorporationsTable from './table/containers/incorporations-table';
import IncorporationsDetailView from './detail/containers/detail-view';

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

class IncorporationsViewWrapper extends Component {
	state = {
		selectedProgram: false
	};

	_setSelectedProgram = data => this.setState({ selectedProgram: data });

	render() {
		const classes = this.props.classes;
		const selectedProgram = this.state.selectedProgram;
		let view = null;

		if (selectedProgram) {
			view = (
				<IncorporationsDetailView
					{...this.props}
					program={selectedProgram}
					onBackClick={this._setSelectedProgram}
				/>
			);
		} else {
			view = <IncorporationsTable {...this.props} onDetailClick={this._setSelectedProgram} />;
		}

		return (
			<Provider store={store}>
				<SelfkeyDarkTheme>
					<Grid container justify="center" alignItems="center">
						<Grid item id="header" className={classes.header} xs={12}>
							<SelfkeyIcon />
							<H1 className={classes.headerTitle}>Incorporation Marketplace</H1>
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

const IncorporationsWrapper = injectSheet(styles)(IncorporationsViewWrapper);

export { IncorporationsWrapper };
