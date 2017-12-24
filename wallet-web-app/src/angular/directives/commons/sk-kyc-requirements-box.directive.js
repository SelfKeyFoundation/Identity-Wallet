'use strict';

function SkKycRequirementsBoxDirective($log, $window, SelfkeyService, ConfigFileService, CommonService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            kycInfo: "=",
            callback: "="
        },
        link: (scope, element) => {
            /**
             * temporary
             */
            let questionsTypeStore = {
                "0": "name",
                "1": "email",
                "2": "public_key",
                "3": "physical_address",
                "4": "work_place",
            }

            let docsTypeStore = {
                "0": "passport",
                "1": "drivers_license",
                "2": "national_id",
                "3": "utility_bill",
            }

            /**
             * get kyc requirements
             */
            scope.requirementsListPromise = SelfkeyService.retrieveKycTemplate(
                scope.kycInfo.organisation,
                scope.kycInfo.template
            );

            scope.requirementsListPromise.then((data)=>{
                $log.info("requirementsListPromise data:", data);
                
                let requirementsList = [];
                let requirements = data.requirements;

                let questions = requirements.questions;
                let uploads = requirements.uploads;

                for(let i in questions){
                    let q = questions[i];
                    let key = questionsTypeStore[i]; // temp
                    requirementsList.push({id: q._id, key: key});
                }

                for(let i in uploads){
                    let u = uploads[i];
                    let key = docsTypeStore[i]; // temp
                    requirementsList.push({id: u._id, key: key});
                }

                scope.sections = CommonService.chunkArray(requirementsList, 3);
                scope.progress = compareRequestedRequirementsWithLocalDocuments(requirementsList);
                
                if(scope.callback && scope.callback.onReady){
                    scope.callback.onReady(null, requirementsList, scope.progress);
                }
            }).catch((error)=>{
                // hide join button
                // hide error on requirements box
                $log.error("requirementsListPromise data:", error);
            });

            function compareRequestedRequirementsWithLocalDocuments(list) {
                let result = {}
        
                for (let i in list) {
                    let req = list[i];
                    let idAttribute = ConfigFileService.getDefaultIdAttributeItem(req.key);
                    result[req.key] = idAttribute && idAttribute.value ? idAttribute : null;
                }
        
                return result;
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-kyc-requirements-box.html'
    }
}

export default SkKycRequirementsBoxDirective;