/* global __static */
import electron from 'electron';
import path from 'path';
import { isDevMode } from 'common/utils/common';
import { Logger } from 'common/logger';
import { walletConnectOperations } from '../../common/wallet-connect';

const log = new Logger('ScanQrCodeService');

export class ScanQrCodeService {
	HANDLER_NAME = 'wallet-connect';

	constructor({ config, store, mainWindow }) {
		this.config = config;
		this.store = store;
		this.mainWindow = mainWindow;
		this.init();
	}

	focusWindow() {
		if (this.mainWindow) {
			if (this.mainWindow.isMinimized()) this.mainWindow.restore();

			let attempts = 0;
			let timeout = null;
			const refocus = () => {
				if ((this.mainWindow.isFocused() || attempts > 5) && timeout) {
					clearTimeout(timeout);
					timeout = null;
					return;
				}
				this.mainWindow.setFocusable(true);
				this.mainWindow.moveTop();
				this.mainWindow.focus();
				this.mainWindow.flashFrame(true);
				attempts++;
				timeout = setTimeout(refocus, 1000);
			};
			refocus();
		}
	}

	async init() {
		log.info('init wallet connect QR scanner');
		this.openWindow();
	}

	openWindow() {
		let windowOptions = {
			title: 'SelfKey Identity Wallet QR Code Scanner',
			name: 'selfkey-scan-qr-code',
			width: 700,
			height: 800,
			transparent: true,
			webPreferences: {
				nodeIntegration: true
			}
		};

		if (process.platform === 'win32' || process.platform === 'linux') {
			windowOptions = Object.assign({}, windowOptions, {
				frame: false
			});
		}
		const qrWindow = new electron.BrowserWindow(windowOptions);

		qrWindow.webContents.session.setPreloads([
			path.join(__static, '/assets/libs/preload-get-display-media-polyfill.js')
		]);
		qrWindow.webContents.session.setPermissionCheckHandler(
			async (webContents, permission, details) => true
		);
		qrWindow.webContents.session.setPermissionRequestHandler(
			async (webContents, permission, cbFx, details) => {
				return cbFx(true);
			}
		);

		qrWindow.loadURL('file://' + path.join(__static, '/capture.html'));
		this.mainWindow.minimize();

		electron.ipcMain.on('qr-code-found', (event, code) => {
			if (code) {
				this.focusWindow();
				this.store.dispatch(walletConnectOperations.handleUriOperation(code));
				try {
					qrWindow.close();
				} catch (error) {
					log.error(error);
				}
			}
		});

		if (isDevMode() && process.env.NODE_ENV !== 'production') {
			// window.webContents.openDevTools();
		}
	}
}

export default ScanQrCodeService;
