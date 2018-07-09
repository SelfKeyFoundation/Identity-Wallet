module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'action_logs';
	const Controller = function() {};

	Controller.add = _add;
	Controller.findByWalletId = _findByWalletId;

	function _add(item) {
		item.createdAt = new Date().getTime();
		return sqlLiteService.insert(TABLE_NAME, item);
	}

	function _findByWalletId(walletId) {
		return sqlLiteService.select(TABLE_NAME, '*', { walletId: walletId });
	}

	return Controller;
};
