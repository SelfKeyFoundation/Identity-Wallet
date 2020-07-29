import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WarningShieldIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import { Popup } from '../common';

const styles = theme => ({
	closeModal: {
		left: 0,
		right: 0,
		margin: '0 auto',
		top: 'calc(50% - 220px)',
		width: '360px'
	},
	logo: {
		height: '60px',
		width: '53px'
	},
	bottomSpace: {
		textAlign: 'center'
	},
	marginBottom: {
		marginBottom: '70px'
	},
	spacing: {
		padding: '30px 30px 40px'
	}
});

export const NoConnection = withStyles(styles)(props => {
	const { classes, onBackClick = false } = props;
	const handleClose = () => {
		window.quit();
	};
	return (
		<Popup open popupClass={classes.closeModal} isHeaderVisible={false}>
			<Grid
				container
				spacing={3}
				direction="column"
				justify="center"
				alignItems="center"
				className={classes.bottomSpace}
			>
				<Grid item>
					<WarningShieldIcon className={classes.logo} />
				</Grid>
				<Grid item>
					<Typography variant="body2" className={classes.marginBottom}>
						An internet connection is required to use the SelfKey Vault. Please check
						your connection and reopen the application.
					</Typography>
					<Button
						variant="outlined"
						size="large"
						color="secondary"
						onClick={onBackClick || handleClose}
					>
						OK
					</Button>
				</Grid>
			</Grid>
		</Popup>
	);
});

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(NoConnection);
