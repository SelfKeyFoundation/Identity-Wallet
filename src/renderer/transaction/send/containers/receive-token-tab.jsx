import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CopyWithIcon, MailIcon, PrintSmallIcon } from 'selfkey-ui';
import QRCode from 'qrcode.react';

const styles = theme => ({
	tokenAddress: {
		padding: theme.spacing(0),
		textAlign: 'center'
	},
	qrCode: {
		marginBottom: theme.spacing(4),
		textAlign: 'center',
		'& canvas': {
			background: '#FFF',
			borderRadius: '4px',
			boxSizing: 'border-box',
			height: '199px !important',
			padding: theme.spacing(1),
			width: '199px !important'
		}
	},
	bottomSpace: {
		marginBottom: theme.spacing(2)
	},
	tokenPublicKey: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		marginBottom: theme.spacing(4),
		'& > p': {
			display: 'inline'
		},
		'& > button': {
			display: 'inline'
		}
	},
	publicKey: {
		fontSize: '20px',
		'@media print': {
			color: '#000000',
			display: 'block !important'
		}
	},
	mailIcon: {
		height: '27px !important',
		marginBottom: theme.spacing(1),
		marginTop: theme.spacing(1),
		width: '35px !important'
	},
	printIcon: {
		height: '36px !important',
		marginBottom: theme.spacing(1),
		width: '34px !important'
	},
	iconWrap: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		'@media print': {
			display: 'none'
		}
	},
	space: {
		margin: theme.spacing(0, 2)
	},
	padding: {
		padding: theme.spacing(0, 1)
	},
	icon: {
		cursor: 'pointer',
		textDecoration: 'none',
		'&:hover': {
			'& svg': {
				fill: '#FFFFFF'
			}
		}
	}
});

const ReceiveTokenTabComponent = props => {
	const { classes, sendingAddress, cryptoCurrency } = props;

	let link = `mailto:?body=${sendingAddress}`;

	let printDiv = () => {
		window.print();
	};

	return (
		<div className={classes.tokenAddress}>
			<div className={classes.qrCode}>
				<QRCode value={sendingAddress} />
			</div>
			<div className={classes.bottomSpace}>
				<Typography variant="h1" color="secondary">
					Your Ethereum address to receive {cryptoCurrency}
				</Typography>
			</div>
			<div className={classes.tokenPublicKey}>
				<Typography variant="body2" className={classes.publicKey} id="printableArea">
					{sendingAddress}
				</Typography>
			</div>
			<div className={classes.iconWrap}>
				<div className={classes.space}>
					<CopyWithIcon text={sendingAddress} />
				</div>
				<a href={link} className={`${classes.space} ${classes.padding} ${classes.icon}`}>
					<MailIcon className={classes.mailIcon} />
					<Typography variant="subtitle2" color="secondary">
						E-mail
					</Typography>
				</a>
				<div
					className={`${classes.space} ${classes.padding} ${classes.icon}`}
					onClick={printDiv}
				>
					<PrintSmallIcon className={classes.printIcon} />
					<Typography variant="subtitle2" color="secondary">
						Print
					</Typography>
				</div>
			</div>
		</div>
	);
};

export const ReceiveTokenTab = withStyles(styles)(ReceiveTokenTabComponent);

export default ReceiveTokenTab;
