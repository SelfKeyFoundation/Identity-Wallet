import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Button, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { identityOperations } from 'common/identity';
import { IdCardIcon, AttributeAlertIcon, CheckMaIcon, HourGlassIcon } from 'selfkey-ui';
import { identitySelectors } from '../../common/identity';

const styles = theme => ({
	bgIcon: {
		marginTop: '-112px',
		position: 'relative',
		right: '-220px',
		top: '36px',
		zIndex: 0
	},
	bottomSpace: {
		marginBottom: '26px'
	},
	emptyStateSpace: {
		marginBottom: '16px'
	},
	dspWrap: {
		backgroundColor: '#262F39',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		height: '100%',
		overflow: 'hidden',
		padding: '18px 30px 30px'
	},
	list: {
		marginBottom: '32px',
		padding: 0,
		'& li': {
			columnCount: 2,
			marginBottom: '21px',
			padding: 0,
			'& p:first-child': {
				maxWidth: '140px',
				minWidth: '140px'
			}
		}
	},
	title: {
		fontSize: '20px',
		marginBottom: '24px',
		marginTop: '5px'
	},
	hidden: {
		display: 'none'
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-239px'
		}
	},
	flex: {
		alignItems: 'center',
		display: 'flex'
	},
	rightSpace: {
		marginRight: '8px'
	}
});

const EmptyState = ({ classes }) => (
	<Typography variant="body2" className={classes.emptyStateSpace}>
		Set up your SelfKey ID for easy Marketplace applications
	</Typography>
);

const Content = ({ classes, profileData }) => {
	const isDID = profileData.identity.did;
	const basicDocs = profileData.basicAttributes.length;

	const Status = ({ status, text }) => {
		let icon;
		switch (status) {
			case 'missing':
				icon = <AttributeAlertIcon className={classes.rightSpace} />;
				text = text || 'Missing';
				break;
			case 'uploaded':
				icon = <CheckMaIcon className={classes.rightSpace} />;
				text = text || 'Uploaded';
				break;
			default:
				icon = <HourGlassIcon className={classes.rightSpace} />;
				text = text || 'Partially Filled';
				break;
		}
		return (
			<div className={classes.flex}>
				{icon}
				<Typography variant="h5">{text}</Typography>
			</div>
		);
	};

	const BasicDocuments = ({ basicDocs }) => {
		switch (basicDocs) {
			case 0:
				return <Status status="missing" />;
			case 4:
				return <Status status="uploaded" />;
			default:
				return <Status />;
		}
	};

	const Documents = ({ docsNumber }) => {
		switch (docsNumber) {
			case 0:
				return <Status status="missing" />;
			default:
				return <Status status="uploaded" />;
		}
	};

	const SelfKeyDID = ({ isDID }) => {
		return isDID ? <Status status="uploaded" text="Created" /> : <Status status="missing" />;
	};

	return (
		<>
			<Typography variant="subtitle2" color="secondary" className={classes.bottomSpace}>
				Add more documents and informations for easy marketplace applications.
			</Typography>
			<List className={classes.list}>
				<ListItem key={'Basic Info'}>
					<Typography variant="body2" color="secondary">
						Basic Info
					</Typography>
					<BasicDocuments basicDocs={basicDocs} />
				</ListItem>

				<ListItem key={'Documents'}>
					<Typography variant="body2" color="secondary">
						Documents
					</Typography>
					<Documents docsNumber={profileData.documents.length} />
				</ListItem>

				<ListItem key={'Selfkey DID'} style={{ overflow: 'hidden' }}>
					<Typography variant="body2" color="secondary">
						Selfkey DID
					</Typography>
					<SelfKeyDID isDID={isDID} />
				</ListItem>
			</List>
		</>
	);
};

class DashboardSelfkeyProfile extends PureComponent {
	handleProfileNavigate = evt => {
		evt.preventDefault();
		this.props.dispatch(identityOperations.navigateToProfileOperation());
	};

	render() {
		const { classes, profile } = this.props;
		const isEmptyProfile = profile.basicAttributes.length < 1;
		const bgIconClass = isEmptyProfile ? classes.bgIcon : classes.hidden;
		return (
			<Grid item className={classes.dspWrap}>
				<Typography variant="h1" className={classes.title}>
					My SelfKey Profile
				</Typography>

				{isEmptyProfile ? (
					<EmptyState classes={this.props.classes} />
				) : (
					<Content classes={this.props.classes} profileData={profile} />
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
	return {
		profile: identitySelectors.selectIndividualProfile(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(DashboardSelfkeyProfile));
