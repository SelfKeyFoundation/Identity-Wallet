module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'wallet_settings';
	const Controller = function() {};

	Controller.findByWalletId = _findByWalletId;
	Controller.edit = _edit;

	function _findByWalletId(walletId) {
		return sqlLiteService.select(TABLE_NAME, '*', { walletId: walletId });
	}

	function _edit(data) {
		return sqlLiteService.update(TABLE_NAME, data, { id: data.id });
	}

	return Controller;
};
