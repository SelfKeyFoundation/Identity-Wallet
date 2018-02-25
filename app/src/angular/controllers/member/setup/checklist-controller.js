"use strict";

function MemberSetupChecklistController($rootScope, $scope, $log, $state, ConfigFileService) {
	"ngInject";

	$log.info("MemberSetupChecklistController");

	let store = ConfigFileService.getStore();
	$scope.name = getIdAttributeItemValues("name");

	$scope.nextStep = event => {
		$state.go("member.setup.add-document", { type: "id_document" });
	};

	/**
	 *
	 */
	function getIdAttributesStore() {
		let walletData = store.wallets[$rootScope.wallet.getPublicKeyHex()];
		return walletData.data.idAttributes;
	}

	function getIdAttributeItem(type) {
		let idAttributesStore = getIdAttributesStore();
		let idAttribute = idAttributesStore[type];
		return idAttribute.items[idAttribute.defaultItemId];
	}

	function getIdAttributeItemValues(type) {
		let item = getIdAttributeItem(type);
		return item.values;
	}
}

module.exports = MemberSetupChecklistController;
