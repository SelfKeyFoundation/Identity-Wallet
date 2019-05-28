import React, { Component } from 'react';
import { Paper, CircularProgress } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { appOperations } from 'common/app';
import backgroundImage from '../../../static/assets/images/bgs/background.jpg';

const styles = theme => ({
	container: {
		backgroundImage: `url(${backgroundImage})`,
		minHeight: '100vh',
		textAlign: 'center',
		padddingTop: '50px'
	}
});

class Loading extends Component {
	async componentDidMount() {
		await this.props.dispatch(appOperations.loadingOperation());
		await this.props.dispatch(appOperations.startAutoUpdateOperation());
	}

	render() {
		const { classes } = this.props;
		return (
			<Paper className={classes.container} square={true}>
				<CircularProgress />
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Loading));
