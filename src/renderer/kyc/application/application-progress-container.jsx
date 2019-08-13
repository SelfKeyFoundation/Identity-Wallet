import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycOperations } from 'common/kyc';
import { push } from 'connected-react-router';
import { CloseButtonIcon, HourGlassLargeIcon } from 'selfkey-ui';
import { Grid, Typography, Button, withStyles } from '@material-ui/core';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-19px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	icon: {
		width: '120px'
	},
	content: {
		width: 'calc(100% - 120px)'
	},
	description: {
		fontFamily: 'Lato, arial',
		color: '#FFF',
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
		},
		'& p.email': {
			color: '#00C0D9',
			padding: '10px 0 10px 0'
		},
		'& strong': {
			fontWeight: '700'
		}
	},
	instructions: {
		padding: '30px 0',
		borderTop: '1px solid #475768'
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

class ApplicationInProgressComponent extends Component {
	componentDidMount() {
		this.clearRelyingParty();
	}

	clearRelyingParty = async () => {
		// Clear relying party session after a payment
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};

	onBackClick = () => this.props.dispatch(push(`/main/dashboard`));

	onSelfKeyClick = () => this.props.dispatch(push(`/main/selfkeyId`));

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={this.onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<Typography variant="body2" gutterBottom className="region">
						KYC Process
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Grid
						container
						justify="flex-start"
						alignItems="flex-start"
						className={classes.content}
					>
						<div className={classes.icon}>
							<HourGlassLargeIcon />
						</div>
						<div className={classes.content}>
							<div className={classes.description}>
								<Typography variant="h1" gutterBottom>
									Application Process Started
								</Typography>
								<Typography variant="body2" gutterBottom>
									One of our managers is reviewing the information you submitted
									and{' '}
									<strong>
										will contact you shortly on the e-mail you provided
									</strong>
									, to continue the process.
								</Typography>
							</div>
							<div className={classes.instructions} style={{ display: 'none' }}>
								<Typography variant="subtitle2" color="secondary" gutterBottom>
									The application is available to you at any point under the
									marketplace applications tab, in your SelfKey ID Profile.
								</Typography>
							</div>
							<div className={classes.footer}>
								<Button
									variant="contained"
									size="large"
									onClick={this.onSelfKeyClick}
								>
									Go to Profile
								</Button>
								<Button variant="outlined" size="large" onClick={this.onBackClick}>
									Close
								</Button>
							</div>
						</div>
					</Grid>
				</div>
			</div>
		);
	}
}

export const ApplicationInProgress = connect()(withStyles(styles)(ApplicationInProgressComponent));

export default ApplicationInProgress;
