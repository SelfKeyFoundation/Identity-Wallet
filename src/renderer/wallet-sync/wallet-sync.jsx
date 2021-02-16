import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Toolbar from './wallet/main/toolbar-container';
import QRCode from 'qrcode.react';
import { walletSyncOperations, walletSyncSelectors } from 'common/wallet-sync';

// import WalletConnectProvider from "@walletconnect/web3-provider";

// export async function createWalletConnectWeb3() {
//   const provider = new WalletConnectProvider({
//     // TODO: Need to create an ENV variable for it
//     infuraId: "42c72df6422e4bc4847f137125953bc2",
//   });

//   // provider.disconnect();

//   // It will launch the wallet connect QR Code modal
//   await provider.enable();

//   const web3 = new Web3(provider);
//   web3.eth.defaultAccount = provider.accounts[0];

//   window.send = (e, t) => {
//     return provider.send(e, t);
//   };

//   // loadWalletConnectEvents(provider);

//   return web3;
// }
// import WalletConnectProvider from '@walletconnect/web3-provider';

const useStyles = makeStyles(theme => ({
	headerSection: {
		marginLeft: 0,
		marginRi: 0,
		width: '100%'
	},
	bodySection: {
		maxWidth: '1074px',
		width: '100%'
	},
	'@media screen and (min-width: 1230px)': {
		bodySection: {
			maxWidth: '1140px'
		}
	},
	page: {}
}));

const contentWrapperStyle = {
	marginBottom: '60px',
	marginRight: '-55px',
	marginTop: '128px'
};

// function createWCProvider() {
// 	const provider = new WalletConnectProvider({
// 		// TODO: Need to create an ENV variable for it
// 		infuraId: '42c72df6422e4bc4847f137125953bc2'
// 	});

// 	// provider.disconnect();

// 	// It will launch the wallet connect QR Code modal
// 	return provider.enable();
// }

export function WalletSync() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const serverUri = useSelector(walletSyncSelectors.selectServerUri);

	useEffect(() => {
		dispatch(walletSyncOperations.initializeServer());
	});

	return (
		<Grid
			container
			direction="column"
			justify="space-between"
			alignItems="center"
			className={classes.page}
		>
			<Grid item className={classes.headerSection}>
				<Toolbar />
			</Grid>
			<Grid item xs={12} className={classes.bodySection} style={contentWrapperStyle}>
				{serverUri ? (
					<>
						<QRCode value={'stuff'} />
						<div>{serverUri}</div>
					</>
				) : (
					'Loading...'
				)}
			</Grid>
		</Grid>
	);
}
