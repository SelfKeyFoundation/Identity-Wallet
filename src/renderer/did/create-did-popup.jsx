import React, { Component } from 'react';
import { Grid, withStyles, Typography, Button, IconButton, Divider } from '@material-ui/core';
import { Popup } from '../common/popup';
import { KeyTooltip, TooltipArrow, PaymentIcon, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	footer: {
		paddingTop: '40px'
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '40px'
		}
	},
	networkFee: {
		fontWeight: 600,
		marginBottom: '4px'
	},
	textRight: {
		textAlign: 'right'
	},
	bottomSpace: {
		marginBottom: '30px'
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	},
	tooltipIcon: {
		padding: '0px 0 3px 10px',
		'& svg': {
			height: '10px !important',
			width: '10px !important'
		}
	},
	divider: {
		marginBottom: '20px'
	},
	bottomSpace2: {
		marginBottom: '20px'
	}
});

class CreateDIDPopupComponent extends Component {
	render() {
		const {
			classes,
			usdNetworkFee,
			ethNetworkFee,
			tooltipNetworkFee,
			onConfirm,
			onCancel,
			onLearnHowClicked,
			open
		} = this.props;

		return (
			<Popup closeAction={onCancel} text={'Register on the Selfkey Network'} open={open}>
				<Grid container direction="row" justify="flex-start" alignItems="flex-start">
					<Grid item xs={2}>
						<PaymentIcon />
					</Grid>
					<Grid item xs={10}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
						>
							<Grid item>
								<Typography variant="h1" gutterBottom>
									Decentralised ID Required
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="body1">
									Getting your DID (
									<a className={classes.link} onClick={onLearnHowClicked}>
										what’s this?
									</a>
									) and registering on the SelfKey Network requires an Ethereum
									transaction. This is a one time only transaction.
								</Typography>
							</Grid>
							<Grid item className={classes.footer}>
								<Divider className={classes.divider} />
								<Grid
									container
									justify="space-between"
									className={classes.bottomSpace2}
								>
									<Grid item>
										<Typography variant="h3" color="secondary">
											Network Transaction Fee
										</Typography>
									</Grid>
									<Grid item className={classes.textRight}>
										<Typography
											variant="body2"
											color="primary"
											className={classes.networkFee}
										>
											${usdNetworkFee.toLocaleString()}
										</Typography>
										<Typography variant="subtitle2" color="secondary">
											{ethNetworkFee.toLocaleString()} ETH
											<KeyTooltip
												interactive
												placement="top-start"
												title={
													<React.Fragment>
														<span>{tooltipNetworkFee}</span>
														<TooltipArrow />
													</React.Fragment>
												}
											>
												<IconButton
													aria-label="Info"
													className={classes.tooltipIcon}
												>
													<InfoTooltip />
												</IconButton>
											</KeyTooltip>
										</Typography>
									</Grid>
								</Grid>
								<Divider />
								<div className={classes.actions}>
									<Button variant="contained" size="large" onClick={onConfirm}>
										GET DID
									</Button>
									<Button variant="outlined" size="large" onClick={onCancel}>
										Cancel
									</Button>
								</div>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

export const CreateDIDPopup = withStyles(styles)(CreateDIDPopupComponent);
export default CreateDIDPopup;
