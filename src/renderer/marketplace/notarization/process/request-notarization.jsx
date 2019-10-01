import React, { Component } from 'react';
import { Grid, Typography, Button, Divider, withStyles, IconButton } from '@material-ui/core';
import { CloseButtonIcon, baseDark, grey, KeyTooltip, TooltipArrow, InfoTooltip } from 'selfkey-ui';
import NotarizationDocuments from './notarization-documents';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '960px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		background: '#2A3540',
		padding: '25px 30px',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	title: {
		marginBottom: '25px'
	},
	howItWorksBox: {
		background: '#313D49',
		borderRadius: '4px',
		boxSizing: 'border-box',
		color: '#FFF',
		height: '178px',
		margin: '0 0 2em 0',
		minHeight: '178px',
		padding: '2em 3%',
		width: '32%',
		'& header': {
			display: 'flex'
		},
		'& header h4': {
			display: 'inline-block',
			fontSize: '16px',
			fontWeight: 500,
			marginLeft: '0.5em',
			marginTop: '-3px'
		},
		'& header span': {
			color: '#00C0D9',
			fontSize: '20px',
			fontWeight: 'bold'
		}
	},
	divider: {
		height: '2px',
		marginBottom: '20px'
	},
	textArea: {
		backgroundColor: baseDark,
		boxSizing: 'border-box',
		border: '1px solid #384656',
		borderRadius: '4px',
		color: grey,
		fontFamily: 'Lato,arial,sans-serif',
		marginBottom: '40px',
		outline: 'none',
		padding: '10px 15px',
		width: '100%',
		'&::placeholder': {
			color: grey
		}
	},
	tooltipIcon: {
		padding: '6px 0 7px 5px'
	}
});

const serviceCostStyle = theme => ({
	serviceCost: {
		paddingBottom: '30px',
		width: '100%'
	},
	priceTable: {
		background: '#313D49',
		margin: '20px 0 0',
		padding: '20px'
	},
	priceRow: {
		padding: '10px 0',
		'& div.rowItem': {
			color: '#FFF',
			width: '33%'
		},
		'& div.price': {
			color: '#00C0D9',
			fontWeight: 'bold',
			textAlign: 'right',
			'& .time': {
				marginTop: '5px'
			}
		},
		'& div.time': {
			fontSize: '13px'
		},
		'& div.rowItem.transactionFee': {
			color: theme.palette.secondary.main
		}
	},
	bold: {
		fontWeight: 600
	},
	rowSeparator: {
		border: '1px solid #475768',
		margin: '30px 0'
	}
});

export const ServiceCost = withStyles(serviceCostStyle)(({ classes }) => (
	<div className={classes.serviceCost}>
		<Typography variant="h2">Service Costs</Typography>

		<div className={classes.priceTable}>
			<div className={classes.priceRow}>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={0}
				>
					<div className="rowItem">
						<Typography variant="h2">Cost</Typography>
					</div>
					<div className="rowItem price">
						<Typography className={classes.bold} variant="body2" color="primary">
							2 x $25
						</Typography>
						<Typography variant="subtitle2" color="secondary">
							2 x 211.831.319,192 KEY
							<KeyTooltip
								interactive
								placement="top-start"
								title={
									<React.Fragment>
										<span>...</span>
										<TooltipArrow />
									</React.Fragment>
								}
							>
								<IconButton aria-label="Info">
									<InfoTooltip />
								</IconButton>
							</KeyTooltip>
						</Typography>
					</div>
					<div className="rowItem price">
						<Typography className={classes.bold} variant="body2" color="primary">
							Total: $50
						</Typography>
						<Typography variant="subtitle2" color="secondary">
							423.662.638,384 KEY
							<KeyTooltip
								interactive
								placement="top-start"
								title={
									<React.Fragment>
										<span>...</span>
										<TooltipArrow />
									</React.Fragment>
								}
							>
								<IconButton aria-label="Info">
									<InfoTooltip />
								</IconButton>
							</KeyTooltip>
						</Typography>
					</div>
				</Grid>
			</div>
			<div className={classes.priceRow}>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={0}
				>
					<div className="rowItem">
						<Typography variant="body2" color="secondary">
							Network Transaction Fee
						</Typography>
					</div>
					<div className="rowItem time" />
					<div className="rowItem price">
						<Typography className={classes.bold} variant="body2" color="primary">
							$0,01
						</Typography>
						<Typography variant="subtitle2" color="secondary">
							0,3237484 ETH
							<KeyTooltip
								interactive
								placement="top-start"
								title={
									<React.Fragment>
										<span>...</span>
										<TooltipArrow />
									</React.Fragment>
								}
							>
								<IconButton aria-label="Info">
									<InfoTooltip />
								</IconButton>
							</KeyTooltip>
						</Typography>
					</div>
				</Grid>
			</div>
		</div>
	</div>
));

class RequestNotarizationComponent extends Component {
	render() {
		const { classes, onBackClick, documents } = this.props;

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<Typography variant="h2" className="region">
						Notarization Service
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Typography variant="h2" gutterBottom>
						How the process works
					</Typography>
					<Grid item className={classes.howItWorks}>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
							spacing={0}
						>
							<div className={classes.howItWorksBox}>
								<header className={classes.header}>
									<span>1</span>
									<Typography variant="h4" gutterBottom>
										Provide documents you want notarized
									</Typography>
								</header>
								<div>
									<Typography variant="subtitle2" color="secondary">
										You will be required to provide standard information about
										yourself, and the documents you wished notarized.
									</Typography>
								</div>
							</div>
							<div className={classes.howItWorksBox}>
								<header className={classes.header}>
									<span>2</span>
									<Typography variant="h4" gutterBottom>
										Video Call
									</Typography>
								</header>
								<div>
									<Typography variant="subtitle2" color="secondary">
										You will be connected live with a notary, so they can
										confirm your identity face-to-face on a webcam. Please make
										sure your device has a camera.
									</Typography>
								</div>
							</div>
							<div className={classes.howItWorksBox}>
								<header className={classes.header}>
									<span>3</span>
									<Typography variant="h4" gutterBottom>
										Receive the notarized documents
									</Typography>
								</header>
								<div>
									<Typography variant="subtitle2" color="secondary">
										Once the notarization process is done you will receive all
										the documents notarized in your Selfkey wallet.
									</Typography>
								</div>
							</div>
						</Grid>
					</Grid>

					<Divider className={classes.divider} />

					<Grid item style={{ marginBottom: '20px' }}>
						<Typography variant="h2" gutterBottom>
							Select the documents you want notarized
						</Typography>
						<NotarizationDocuments documents={documents} />
					</Grid>

					<Grid item>
						<Typography variant="overline" gutterBottom>
							Message for Notary*
						</Typography>
						<textarea
							className={classes.textArea}
							rows="5"
							placeholder="Please describe the work that needs to be done…."
						/>
					</Grid>

					<Divider className={classes.divider} />

					<Grid item style={{ marginBottom: '20px' }}>
						<ServiceCost />
					</Grid>

					<Grid item>
						<Grid container direction="row" spacing={24}>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={this.onStartClick}
								>
									Request Notarization
								</Button>
							</Grid>
							<Grid item>
								<Button variant="outlined" size="large" onClick={onBackClick}>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

const RequestNotarization = withStyles(styles)(RequestNotarizationComponent);
export default RequestNotarization;
export { RequestNotarization };
