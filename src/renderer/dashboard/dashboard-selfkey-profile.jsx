import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Button, List, ListItem } from '@material-ui/core';
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
	emptyStateSpace: {
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
	},
	hidden: {
		display: 'none'
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-239px'
		}
	}
});

const EmptyState = ({ classes }) => (
	<Typography variant="body2" className={classes.emptyStateSpace}>
		Set up your SelfKey ID for easy Marketplace applications
	</Typography>
);

const Content = ({ classes }) => (
	<>
		<Typography variant="subtitle2" color="secondary" className={classes.bottomSpace}>
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
		</List>
	</>
);

class DashboardSelfkeyProfile extends PureComponent {
	handleProfileNavigate = evt => {
		evt.preventDefault();
		this.props.dispatch(identityOperations.navigateToProfileOperation());
	};

	render() {
		const { classes, isEmptyProfile } = this.props;
		const bgIconClass = isEmptyProfile ? classes.bgIcon : classes.hidden;
		return (
			<Grid item className={classes.dspWrap}>
				<Typography variant="h1" className={classes.title}>
					My SelfKey Profile
				</Typography>

				{isEmptyProfile ? (
					<EmptyState classes={this.props.classes} />
				) : (
					<Content classes={this.props.classes} />
				)}

				<Button variant="outlined" size="large" onClick={this.handleProfileNavigate}>
					Go to My Profile
				</Button>
				<div className={bgIconClass}>
					<IdCardIcon width="75px" height="110px" fill="#313B49" />
				</div>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(DashboardSelfkeyProfile));
