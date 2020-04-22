import React from 'react';
import { Typography } from '@material-ui/core';
import injectSheet from 'react-jss';
import { CopyWithIcon, MailIcon, PrintSmallIcon } from 'selfkey-ui';
import QRCode from 'qrcode.react';

const styles = {
	tokenAddress: {
		padding: 0,
		textAlign: 'center'
	},
	qrCode: {
		marginBottom: '36px',
		textAlign: 'center',
		'& canvas': {
			background: '#FFF',
			borderRadius: '4px',
			boxSizing: 'border-box',
			height: '199px !important',
			padding: '10px',
			width: '199px !important'
		}
	},
	bottomSpace: {
		marginBottom: '20px'
	},
	tokenPublicKey: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '30px',
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
		marginBottom: '11px',
		marginTop: '5px',
		width: '35px !important'
	},
	printIcon: {
		height: '36px !important',
		marginBottom: '7px',
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
		margin: '0 20px'
	},
	padding: {
		padding: '0 5px'
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
};

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
			<Typography variant="h1" color="secondary" className={classes.bottomSpace}>
				Your Ethereum address to receive {cryptoCurrency}
			</Typography>
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

export const ReceiveTokenTab = injectSheet(styles)(ReceiveTokenTabComponent);

export default ReceiveTokenTab;
