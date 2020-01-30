import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import { getWallet } from 'common/wallet/selectors';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { identityOperations } from 'common/identity';
import { IdCardIcon } from 'selfkey-ui';

const styles = theme => ({
	bgIcon: {
		marginTop: '-112px',
		position: 'relative',
		right: '-220px',
		top: '36px',
		zIndex: 0
	},
	bottomSpace: {
		marginBottom: '30px'
	},
	bottomSpace2: {
		marginBottom: '16px'
	},
	dspWrap: {
		backgroundColor: '#262F39',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		overflow: 'hidden',
		padding: '20px 30px 30px'
	},
	list: {
		padding: 0,
		'& li': {
			columnCount: 2,
			padding: 0,
			'& p:first-child': {
				maxWidth: '150px',
				minWidth: '150px'
			}
		}
	},
	title: {
		fontSize: '20px',
		marginBottom: '30px',
		marginTop: '5px'
	}
});

const EmptyState = ({ classes }) => (
	<Typography variant="body2" className={classes.bottomSpace2}>
		Set up your SelfKey ID for easy Marketplace applications
	</Typography>
);

class DashboardSelfkeyProfile extends PureComponent {
	handleProfileNavigate = evt => {
		evt.preventDefault();
		this.props.dispatch(identityOperations.navigateToProfileOperation());
	};

	render() {
		const { classes } = this.props;
		return (
			<Grid item className={classes.dspWrap}>
				<Typography variant="h1" className={classes.title}>
					My SelfKey Profile
				</Typography>
				<EmptyState classes={this.props.classes} />

				{/* <Typography variant="subtitle2" color="secondary" className={classes.bottomSpace}>
					Add more documents and informations for easy marketplace applications.
				</Typography>
				<List className={`${classes.list} ${classes.bottomSpace}`}>
					{['Basic Info', 'Documents', 'Selfkey DID'].map(item => (
						<ListItem key={item}>
							<Typography variant="body2" color="secondary">
								{item}
							</Typography>
							<Typography variant="body2" align="right">
								pass
							</Typography>
						</ListItem>
					))}
				</List> */}
				<Button variant="outlined" size="large" onClick={this.handleProfileNavigate}>
					Go to My Profile
				</Button>
				<div className={classes.bgIcon}>
					<IdCardIcon width="75px" height="110px" fill="#313B49" />
				</div>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		// address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(withStyles(styles)(DashboardSelfkeyProfile));
