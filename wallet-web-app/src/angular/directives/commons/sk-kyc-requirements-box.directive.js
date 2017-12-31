'use strict';

function SkKycRequirementsBoxDirective($rootScope, $log, $window, SelfkeyService, ConfigFileService, CommonService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            kycInfo: "=",
            callback: "="
        },
        link: (scope, element) => {
            scope.foundUnknownRequirement = false;
            
            loadRequirements ();

            /**
             * get kyc requirements
             */
            function loadRequirements () {
                scope.foundUnknownRequirement = false;
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
                        let req = questions[i];
                        let idAttributeType = ConfigFileService.getIdAttributeType(i);
                        if(!idAttributeType){
                            scope.foundUnknownRequirement = true;
                            continue;
                        }
                        requirementsList.push({id: req._id, key: req.type, idAttributeType: idAttributeType});
                    }
    
                    for(let i in uploads){
                        let req = uploads[i];

                        let idAttributeType = ConfigFileService.getIdAttributeType(i);
                        if(!idAttributeType){
                            scope.foundUnknownRequirement = true;
                            continue;
                        }

                        requirementsList.push({id: req._id, key: req.type, idAttributeType: idAttributeType});
                    }
    
                    scope.sections = CommonService.chunkArray(requirementsList, 3);
                    scope.progress = compareRequestedRequirementsWithLocalDocuments(requirementsList);
                    
                    if(scope.callback && scope.callback.onReady){
                        let error = null;
                        if(scope.foundUnknownRequirement){
                            error = "unknown_requirement_found";
                        }
                        scope.callback.onReady(error, requirementsList, scope.progress);
                    }
                }).catch((error)=>{
                    // hide join button
                    // hide error on requirements box
                    $log.error("requirementsListPromise data:", error);
                });
            }
            
            function compareRequestedRequirementsWithLocalDocuments(list) {
                let result = {}
        
                for (let i in list) {
                    let req = list[i];
                    let idAttribute = ConfigFileService.getDefaultIdAttributeItem(req.key);
                    result[req.key] = idAttribute && idAttribute.value ? idAttribute : null;
                }
        
                return result;
            }

            $rootScope.$on('id-attributes-changed', (event) => {
                loadRequirements ();
            });
        },
        replace: true,
        templateUrl: 'common/directives/sk-kyc-requirements-box.html'
    }
}

export default SkKycRequirementsBoxDirective;