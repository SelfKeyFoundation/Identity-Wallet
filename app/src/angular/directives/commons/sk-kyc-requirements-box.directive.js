'use strict';

import IdAttributeItem  from '../../classes/id-attribute-item';
import IdAttribute      from '../../classes/id-attribute';

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
             * 
             * 1) load requirements
             * 2) check if we have local file for the requirement
             * 3) build structure for missing requirements
             * 4) fire callback when all this will be done
             * 
             */

            let test = {
                "national_id": {
                    "key": "national_id",
                    "type": "document",
                    "category": "id_document",
                    "defaultItemId": "1",
                    "entity": [
                        "individual"
                    ],
                    "items": {
                        "1": {
                            "_id": "1",
                            "contentType": "",
                            "idAttributeType": {
                                "category": "id_document",
                                "entity": [
                                    "individual"
                                ],
                                "key": "national_id",
                                "type": "document"
                            },
                            "name": "",
                            "path": "",
                            "size": null,
                            "value": ""
                        },
                        "2": {
                            "_id": "2",
                            "addition": {
                                "selfie": true
                            },
                            "contentType": "",
                            "idAttributeType": {
                                "category": "id_document",
                                "entity": [
                                    "individual"
                                ],
                                "key": "national_id",
                                "type": "document"
                            },
                            "name": "",
                            "size": null,
                            "value": ""
                        }
                    }
                }
            }



            /**
             * get kyc requirements
             */
            function loadRequirements () {
                scope.foundUnknownRequirement = false;

                scope.requirementsListPromise = SelfkeyService.retrieveKycTemplate(
                    scope.kycInfo.apiEndpoint,
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
                        let idAttributeType = ConfigFileService.getIdAttributeType(req.attributeType);
                        if(!idAttributeType){
                            scope.foundUnknownRequirement = true;
                            continue;
                        }
                        requirementsList.push({key: req.attributeType, idAttributeType: idAttributeType, req: req});
                    }
    
                    for(let i in uploads){
                        let req = uploads[i];

                        let idAttributeType = ConfigFileService.getIdAttributeType(req.attributeType);
                        if(!idAttributeType){
                            scope.foundUnknownRequirement = true;
                            continue;
                        }
                        
                        requirementsList.push({key: req.attributeType, idAttributeType: idAttributeType, req: req});
                    }
    
                    scope.sections = CommonService.chunkArray(requirementsList, 3);
                    scope.missingRequirements = compareRequestedRequirementsWithLocalDocuments(requirementsList);
                    
                    if(scope.callback && scope.callback.onReady){
                        let error = null;
                        if(scope.foundUnknownRequirement){
                            error = "unknown_requirement_found";
                        }
                        scope.callback.onReady(error, requirementsList, scope.missingRequirements);
                    }
                }).catch((error)=>{
                    // hide join button
                    // hide error on requirements box
                    $log.error("requirementsListPromise data:", error);
                });
            }
            
            scope.checkIfIdAttributeItemIsready = (item) => {
                let store = ConfigFileService.getStore();
                let idAttributes = store.idAttributes;
                let idAttributeItem = idAttributes[item.key];

                if(item.req.selfie){
                    for(let j in idAttributeItem.items){

                        let it = idAttributeItem.items[j];
                        if(it.addition && it.addition.selfie && (it.value || it.path)){
                            return it;
                        }
                    }
                }else{
                    for(let j in idAttributeItem.items){
                        let it = idAttributeItem.items[j];
                        if((!it.addition || !it.addition.selfie) && (it.value || it.path)){
                            return it;
                        }
                    }
                }

                return null;
            }

            function compareRequestedRequirementsWithLocalDocuments(list) {
                let result = []

                let store = ConfigFileService.getStore();
                let idAttributes = store.idAttributes;

                for (let i in list) {
                    let item = list[i];

                    let isReady = scope.checkIfIdAttributeItemIsready(item);
                    
                    if(!isReady){
                        // item.key
                        // item.req.selfie
                        // item.idAttributeType

                        let idAttribute = angular.copy(idAttributes[item.key]);
                        if(!idAttribute){
                            idAttribute = new IdAttribute(item.key, item.idAttributeType);
                            idAttributes[item.key] = idAttribute;

                            let idAttributeItem = new IdAttributeItem();
                            idAttributeItem.setType(item.idAttributeType);
                            idAttributeItem.name = "";
                            
                            idAttributeItem.setAddition(item.req.selfie);

                            idAttribute.addItem(idAttributeItem);
                        }else{
                            let idAttributeItem = new IdAttributeItem();
                            idAttributeItem.setType(item.idAttributeType);
                            idAttributeItem.name = "";

                            if(!idAttributeItem.addition) {
                                idAttributeItem.addition = {};
                            }
                            idAttributeItem.addition.selfie = item.req.selfie;

                            idAttribute.items[idAttributeItem._id] = idAttributeItem;
                        }

                        // if not found create requirement box (id attribute box record)
                        // package - 

                        result.push(idAttribute); //idAttribute && idAttribute.value ? idAttribute : null;
                    }
                }
        
                console.log(">>>>>>>> >>>>>>>>>>", result);

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