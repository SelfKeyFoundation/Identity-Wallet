function MemberMarketplaceIcoItemController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $sce, ConfigFileService, CommonService, SelfkeyService, $window) {
    'ngInject'

    // Token Details View 
    // 1: Join Ico (if all requirements are ok)
    // 2: Complete Selfkey ID (if missing any requirements)
    // 3: Join Ico (after all documents get ready & submited)

    // 4: show missing documents - (Screen 35)
    // 5: show message after all document get ready - (Screen 36)
    // 6: after click (3: Join Token Sale) -> Screen 38
    // 7: screen 40

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
    $scope.icoProcess = {
        status: $scope.icoStatuses.REQUIREMENTS_MISSING
    }

    $scope.isSusbscribed = false;
    $scope.actionInProgress = false;

    $scope.kycProgress = null;

    normaliseIcoData();



    let store = ConfigFileService.getStore();

    // check participation
    for (let i in store.subscribtions) {
        let subs = store.subscribtions[i];
        if (subs.type === 'ico' && subs.info.symbol === $scope.ico.symbol) {
            $scope.isSusbscribed = true;
            break;
        }
    }

    $scope.kycInfo = {
        apiEndpoint: $scope.ico.kyc.apiEndpoint,
        organisation: $scope.ico.kyc.organisation,
        template: $scope.ico.kyc.template
    }

    $scope.kycRequirementsCallbacks = {
        onReady: (error, requirementsList, progress) => {
            if(!error){
                $scope.kycProgress = progress;
                checkRequirementsProgress(progress);
            }
        }
    }

    $scope.getDecorations = () => {
        if ($scope.isSusbscribed) {
            switch ($scope.icoProcess.status) {
                case $scope.icoStatuses.REQUIREMENTS_MISSING:
                    return { clazz: 'orange', title: 'Missing Requirements' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_READY:
                    return { clazz: 'green', title: 'Requirements Are Ready' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_APPROVED:
                    return { clazz: 'green', title: 'Requirements Are Approved' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_REJECTED:
                    return { clazz: 'red', title: 'Requirements Are Rejected' };
                    break;
                default:
            }
        }
    }

    $scope.getActionButtonInfo = () => {
        // //complete-button, join-button, join-ico-button
        if ($scope.isSusbscribed) {
            switch ($scope.icoProcess.status) {
                case $scope.icoStatuses.REQUIREMENTS_MISSING:
                    return { clazz: 'complete-button', title: 'Complete Selfkey ID' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_READY:
                    return { clazz: 'complete-button', title: 'Submit ID' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_APPROVED:
                    return { clazz: 'join-button', title: 'Complete Selfkey ID' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_REJECTED:
                    return { clazz: 'complete-button', title: 'Submit ID Again' };
                    break;
                default:
            }
        } else {
            return { clazz: 'complete-button', title: 'Participate' };
        }
    }

    $scope.action = ($event) => {
        $scope.actionInProgress = true;

        if ($scope.isSusbscribed) {
            switch ($scope.icoProcess.status) {
                case $scope.icoStatuses.REQUIREMENTS_MISSING:
                    $state.go('member.marketplace.ico-manage-requirements', { 
                        selected: $scope.ico, 
                        kycProgress: $scope.kycProgress, 
                        kycInfo: $scope.kycInfo 
                    });
                    break;
                case $scope.icoStatuses.REQUIREMENTS_READY:
                    //return { clazz: 'complete-button', title: 'Submit ID' };
                    break;
                case $scope.icoStatuses.REQUIREMENTS_APPROVED:
                    $state.go('member.marketplace.ico-accept-terms', { selected: $scope.ico });
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
                $scope.isSusbscribed = true;
            }).finally(() => {
                $scope.actionInProgress = false;
            })
        }
    }

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

        $scope.icoProcess.status = status ? $scope.icoStatuses.REQUIREMENTS_READY : $scope.icoStatuses.REQUIREMENTS_MISSING;
    }

    function normaliseIcoData() {
        if (typeof $scope.ico.token.totalOnSale === 'number') {
            $scope.ico.tokenSalePercent = (($scope.ico.token.totalOnSale / $scope.ico.token.total) * 100).toFixed(2);
        }
        if ($scope.ico.cap.total && $scope.ico.cap.raised) {
            $scope.ico.cap.capPercent = (($scope.ico.cap.raised / $scope.ico.cap.total) * 100).toFixed(2);
        }
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