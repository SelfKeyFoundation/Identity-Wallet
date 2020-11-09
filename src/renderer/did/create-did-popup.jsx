import React, { PureComponent } from 'react';
import { Grid, Typography, Button, IconButton, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../common/popup';
import { KeyTooltip, TooltipArrow, PaymentIcon, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	footer: {
		paddingTop: theme.spacing(5)
	},
	actions: {
		'&>button': {
			marginRight: theme.spacing(2),
			marginTop: theme.spacing(5)
		}
	},
	networkFee: {
		fontWeight: 600,
		marginBottom: theme.spacing(0.5)
	},
	textRight: {
		textAlign: 'right'
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	},
	tooltipIcon: {
		padding: theme.spacing(0, 0, 0.5, 1),
		'& svg': {
			height: '10px !important',
			width: '10px !important'
		}
	},
	divider: {
		marginBottom: theme.spacing(2)
	},
	bottomSpace: {
		marginBottom: theme.spacing(2)
	}
});

class CreateDIDPopupComponent extends PureComponent {
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
									className={classes.bottomSpace}
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
												TransitionProps={{ timeout: 0 }}
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
