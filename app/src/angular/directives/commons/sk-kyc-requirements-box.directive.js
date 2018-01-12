'use strict';

import IdAttributeItem from '../../classes/id-attribute-item';
import IdAttribute from '../../classes/id-attribute';

function SkKycRequirementsBoxDirective($rootScope, $log, $window, SelfkeyService, ConfigFileService, CommonService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            kycInfo: "="
        },
        link: (scope, element) => {
            loadRequirements();

            /**
             * get kyc requirements
             */
            function loadRequirements() {
                scope.requirementsListPromise = SelfkeyService.retrieveKycTemplate(
                    scope.kycInfo.apiEndpoint,
                    scope.kycInfo.organisation,
                    scope.kycInfo.template
                );

                scope.requirementsListPromise.then((data) => {
                    $log.info("requirementsListPromise data:", data);

                    let requirementsList = [];
                    let requirements = data.requirements;

                    let questions = requirements.questions;
                    let uploads = requirements.uploads;

                    for (let i in questions) {
                        let req = questions[i];
                        let idAttributeType = ConfigFileService.getIdAttributeType(req.attributeType);
                        requirementsList.push({ key: req.attributeType, idAttributeType: idAttributeType, req: req });
                    }

                    for (let i in uploads) {
                        let req = uploads[i];

                        let idAttributeType = ConfigFileService.getIdAttributeType(req.attributeType);
                        requirementsList.push({ key: req.attributeType, idAttributeType: idAttributeType, req: req });
                    }

                    scope.sections = CommonService.chunkArray(requirementsList, 3);
                }).catch((error) => {
                    $log.error("requirementsListPromise data:", error);
                });
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-kyc-requirements-box.html'
    }
}

export default SkKycRequirementsBoxDirective;