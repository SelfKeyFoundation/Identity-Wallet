import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { Typography, Grid, Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { WalletConnectIcon, QRCodeIcon, SquareTargetIcon } from 'selfkey-ui';

const useStyles = makeStyles({
	title: {
		display: 'flex',
		gap: '1em',
		marginBottom: '50px',
		'& svg': {
			fill: '#3b99fc'
		}
	},
	connectOptions: {
		marginBottom: '25px'
	},
	option: {
		textAlign: 'center',
		minWidth: '200px',
		'& > div': {
			marginBottom: '1em'
		},
		'& > div:hover svg g': {
			stroke: '#00c0d9'
		}
	},
	icon: {
		width: 50,
		height: 50,
		background: 'transparent'
	},
	message: {
		width: 300,
		overflowWrap: 'break-word'
	},
	actions: {
		marginTop: 20
	},
	loading: {
		display: 'flex',
		gap: '1em',
		'& svg': {
			fill: '#3b99fc'
		}
	},
	squareIcon: {
		'& svg': {
			position: 'relative',
			top: '-10px',
			width: '90px !important'
		}
	}
});

export const WcConnectComponent = ({
	onCancel,
	onCopyOption,
	onScanOption,
	onClickManage,
	isLoading
}) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCancel} text="">
			<Grid container direction="column" alignItems="center" spacing={2}>
				{isLoading && (
					<Grid item className={classes.loading}>
						<WalletConnectIcon />
						<Typography variant="body1">Connecting ...</Typography>
					</Grid>
				)}
				{!isLoading && (
					<>
						<Grid item>
							<div className={classes.title}>
								<WalletConnectIcon />
								<Typography variant="body1">
									New WalletConnect Connection
								</Typography>
							</div>
						</Grid>
						<Grid item>
							<Grid
								container
								direction="row"
								alignItems="center"
								spacing={2}
								className={classes.connectOptions}
							>
								<Grid item className={classes.option}>
									<div onClick={onCopyOption}>
										<QRCodeIcon width="100" />
									</div>
									<Typography variant="subtitle2" color="secondary">
										Paste QR
										<br />
										code from clipboard
									</Typography>
								</Grid>
								<Grid item className={classes.option}>
									<div onClick={onScanOption} className={classes.squareIcon}>
										<SquareTargetIcon width="100" />
									</div>
									<Typography variant="subtitle2" color="secondary">
										Scan QR code
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</>
				)}
				<Grid item className={classes.actions}>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="contained" size="large" onClick={onClickManage}>
								Manage Sessions
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

WcConnectComponent.propTypes = {
	onClickManage: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onCopyOption: PropTypes.func.isRequired,
	onScanOption: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired
};
WcConnectComponent.defaultProps = {
	isLoading: false
};

export default WcConnectComponent;
