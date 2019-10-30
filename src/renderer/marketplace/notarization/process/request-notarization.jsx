import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Typography, Button, Divider, withStyles, IconButton } from '@material-ui/core';
import { CloseButtonIcon, baseDark, grey, KeyTooltip, TooltipArrow, InfoTooltip } from 'selfkey-ui';
import NotarizationDocuments from './notarization-documents';
import { identitySelectors } from 'common/identity';
import { CreateAttributeContainer } from '../../../attributes';
import MarketplaceNotariesComponent from '../common/marketplace-notaries-component';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '960px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		alignItems: 'flex-start',
		background: '#2A3540',
		display: 'flex',
		justifyContent: 'flex-start',
		padding: '20px 30px',
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
	howItWorks: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
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
		fontSize: '14px',
		lineHeight: '21px',
		marginBottom: '40px',
		outline: 'none',
		padding: '10px 15px',
		width: '100%',
		'&::placeholder': {
			color: grey
		}
	},
	requestBtn: {
		marginRight: '20px'
	}
});

const serviceCostStyle = theme => ({
	serviceCost: {
		marginBottom: '20px',
		paddingBottom: '30px',
		width: '100%'
	},
	priceTable: {
		background: '#313D49',
		margin: '20px 0 0',
		padding: '20px'
	},
	priceRow: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
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
	}
});

export const ServiceCost = withStyles(serviceCostStyle)(({ classes }) => (
	<div className={classes.serviceCost}>
		<Typography variant="h2">Service Costs</Typography>
		<div className={classes.priceTable}>
			<div className={classes.priceRow}>
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
			</div>
			<div className={classes.priceRow}>
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
			</div>
		</div>
	</div>
));

class RequestNotarizationComponent extends MarketplaceNotariesComponent {
	state = {
		popup: null
	};

	onBackClick = () => this.props.dispatch(push(this.rootPath()));
	onStartClick = () => this.props.dispatch(push(this.tocPath()));

	handleAddDocument = () => {
		this.setState({ popup: 'create-attribute', isDocument: true });
	};

	handlePopupClose = () => {
		this.setState({ popup: null });
	};

	render() {
		const { classes, documents } = this.props;
		const { popup } = this.state;

		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
					/>
				)}
				<div className={classes.container}>
					<CloseButtonIcon onClick={this.onBackClick} className={classes.closeIcon} />
					<div className={classes.containerHeader}>
						<Typography variant="h2" className="region">
							Notarization Service
						</Typography>
					</div>
					<div className={classes.contentContainer}>
						<Typography variant="h2" gutterBottom>
							How the process works
						</Typography>
						<div className={classes.howItWorks}>
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
						</div>
						<Divider className={classes.divider} />
						<div>
							<Typography variant="h2" gutterBottom>
								Select the documents you want notarized
							</Typography>
							<NotarizationDocuments
								documents={documents}
								onAddDocument={this.handleAddDocument}
								{...this.props}
							/>
						</div>
						<div>
							<Typography variant="overline" gutterBottom>
								Message for Notary*
							</Typography>
							<textarea
								className={classes.textArea}
								rows="5"
								placeholder="Please describe the work that needs to be done…."
							/>
						</div>
						<Divider className={classes.divider} />
						<ServiceCost />
						<div>
							<Button
								className={classes.requestBtn}
								variant="contained"
								size="large"
								onClick={this.onStartClick}
							>
								Request Notarization
							</Button>
							<Button variant="outlined" size="large" onClick={this.onBackClick}>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...identitySelectors.selectSelfkeyId(state)
	};
};

const styledComponent = withStyles(styles)(RequestNotarizationComponent);
export const RequestNotarization = connect(mapStateToProps)(styledComponent);
export default RequestNotarization;
