import React, { Component } from 'react';
import { Grid, withStyles, Typography, Button, IconButton } from '@material-ui/core';

import { KeyTooltip, TooltipArrow, PaymentIcon, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	bold: {
		fontWeight: 600
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
	content: {
		'& p': {
			marginBottom: '1em'
		}
	}
});

class CreateDIDContentComponent extends Component {
	render() {
		const {
			classes,
			usdNetworkFee,
			ethNetworkFee,
			tooltipNetworkFee,
			onConfirm,
			onCancel,
			learnHowURL
		} = this.props;

		return (
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<PaymentIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item>
							<Typography variant="h1" gutterBottom>
								Decentralised ID Required
							</Typography>
						</Grid>
						<Grid item className={classes.content}>
							<Typography variant="body1" gutterBottom>
								Getting your DID (
								<a
									className={classes.link}
									onClick={e => {
										window.openExternal(e, learnHowURL);
									}}
								>
									what’s this?
								</a>
								) and registering on the SelfKey Network requires an Ethereum
								transaction. This is a one time only transaction.
							</Typography>
						</Grid>
						<Grid item classes={{ item: classes.footer }}>
							<Grid container justify="space-between">
								<Grid item>
									<Typography variant="h3" color="secondary">
										Network Transaction Fee
									</Typography>
								</Grid>
								<Grid item className={classes.textRight}>
									<Typography
										variant="body2"
										color="primary"
										className={classes.bold}
									>
										${usdNetworkFee.toLocaleString()}
									</Typography>
									<Typography variant="subtitle2" color="secondary" gutterBottom>
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
											<IconButton aria-label="Info">
												<InfoTooltip />
											</IconButton>
										</KeyTooltip>
									</Typography>
								</Grid>
							</Grid>
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
		);
	}
}

export const CreateDIDContent = withStyles(styles)(CreateDIDContentComponent);
export default CreateDIDContent;
