function MemberMarketplaceIcoItemController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $sce, ConfigFileService, CommonService, SelfkeyService, $window) {
    'ngInject'

    $log.info('MemberMarketplaceIcoItemController', $stateParams);

    /**
     * not_participating
     * requirements_missing
     * requirements_ready
     * requirements_submited
     * ready_to_join
     */
    $scope.icoStatuses = {
        REQUIREMENTS_MISSING: "requirements_missing",
        REQUIREMENTS_READY: "requirements_ready",
        REQUIREMENTS_SUBMITED: "requirements_submited",
        REQUIREMENTS_APPROVED: "requirements_approved",
        REQUIREMENTS_REJECTED: "requirements_rejected"
    }

    /**
     *
     */
    $scope.view = {
        showKycRequirements: false,
        showActionButton: true
    }

    $scope.trustSrc = (src) => {
        return $sce.trustAsResourceUrl(src);
    }

    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;
    if (typeof $scope.ico.token.totalOnSale === 'number') {
        $scope.ico.tokenSalePercent = (($scope.ico.token.totalOnSale / $scope.ico.token.total) * 100).toFixed(2);
    }
    if ($scope.ico.cap.total && $scope.ico.cap.raised) {
        $scope.ico.cap.capPercent = (($scope.ico.cap.raised / $scope.ico.cap.total) * 100).toFixed(2);
    }

    $scope.isSusbscribed = false;
    $scope.actionInProgress = false;

    let store = ConfigFileService.getStore();

    // check participation
    for (let i in store.subscribtions) {
        let subs = store.subscribtions[i];
        if (subs.type === 'ico' && subs.info.symbol === $scope.ico.symbol) {
            $scope.isSusbscribed = true;
        }
    }

    $scope.kycInfo = {
        organisation: "5a3f53da59cfda9e4639ba71", //$scope.ico.kyc.organisation,
        template: "507f1f77bcf86cd799439013" //$scope.ico.kyc.template
    }

    $scope.kycRequirementsCallbacks = {
        onReady: (error, requirementsList, progress) => {
            console.log("onReady", error, requirementsList, progress);
            checkRequirementsProgress(progress);

            if ($scope.isSusbscribed && $scope.icoStatus === $scope.icoStatuses.REQUIREMENTS_MISSING) {
                $scope.view.showActionButton = false;
            }
        }
    }

    $scope.getActionButtonInfo = () => {
        // //complete-button, join-button, join-ico-button
        if ($scope.isSusbscribed) {
            switch ($scope.icoStatus) {
                case $scope.icoStatuses.REQUIREMENTS_MISSING:
                    return {clazz: 'complete-button', title: 'Complete Selfkey ID'};
                    break;
                case $scope.icoStatuses.REQUIREMENTS_READY:
                    return {clazz: 'complete-button', title: 'Submit ID'};
                    break;
                case $scope.icoStatuses.REQUIREMENTS_APPROVED:
                    return {clazz: 'join-button', title: 'Complete Selfkey ID'};
                    break;
                case $scope.icoStatuses.REQUIREMENTS_REJECTED:
                    return {clazz: 'complete-button', title: 'Submit ID Again'};
                    break;
                default:
            }
        } else {
            return {clazz: 'complete-button', title: 'Participate'};
        }
    }

    $scope.action = ($event) => {
        $scope.actionInProgress = true;

        if ($scope.isSusbscribed) {
            switch ($scope.icoStatus) {
                case $scope.icoStatuses.REQUIREMENTS_MISSING:
                    $state.go('member.marketplace.ico-manage-requirements', {selected: $scope.ico});
                    break;
                case $scope.icoStatuses.REQUIREMENTS_READY:
                    //return { clazz: 'complete-button', title: 'Submit ID' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_APPROVED:
                    $state.go('member.marketplace.ico-accept-terms', {selected: $scope.ico});
                    break;
                case $scope.icoStatuses.REQUIREMENTS_REJECTED:
                    //return { clazz: 'complete-button', title: 'Submit ID Again' };
                    break;
                default:
            }
        } else {
            store.subscribtions.push({
                "_id": $scope.ico.symbol,
                "type": "ico",
                "createDate": new Date(),
                "info": {
                    "kycStatus": 0,
                    "requirements": [],
                    "startDate": $scope.ico.startDate,
                    "symbol": $scope.ico.symbol
                }
            });

            ConfigFileService.save().then((resp) => {
                $log.info(">>>>", resp);

                // 

            }).finally(() => {
                $scope.actionInProgress = false;
            })
        }
    }

    // Token Details View 
    // 1: Join Ico (if all requirements are ok)
    // 2: Complete Selfkey ID (if missing any requirements)
    // 3: Join Ico (after all documents get ready & submited)

    // 4: show missing documents - (Screen 35)
    // 5: show message after all document get ready - (Screen 36)
    // 6: after click (3: Join Token Sale) -> Screen 38
    // 7: screen 40

    /**
     *
     */
    function checkRequirementsProgress(progress) {
        let status = true;
        for (let i in progress) {
            let req = progress[i];
            if (!req || (!req.value && !req.path)) {
                status = false;
                break;
            }
        }

        $scope.icoStatus = status ? $scope.icoStatuses.REQUIREMENTS_READY : $scope.icoStatuses.MISSING_REQUIREMENTS;
    }


    $scope.OpenNewTab = function (type) {
        if (type == 'web') {
            $window.open($scope.ico.website);
        } else if (type == 'pdf') {
            $window.open($scope.ico.whitepaper);
        }
    }
};

export default MemberMarketplaceIcoItemController;