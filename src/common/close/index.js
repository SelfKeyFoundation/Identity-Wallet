import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';

export const closeTypes = {
	CLOSE_APP_CANCEL: 'close/app/CANCEL'
};

const cancelClose = () => async (dispatch, getState) => {
	const mainWindow = getGlobalContext().mainWindow;
	mainWindow.shouldIgnoreClose = true;
};

const operations = {
	cancelClose
};

const closeOperations = {
	cancelClose: createAliasedAction(closeTypes.CLOSE_APP_CANCEL, operations.cancelClose)
};

export { closeOperations };
