"use strict";

const IdAttributeItem = requireAppModule("angular/classes/id-attribute-item");
const IdAttribute = requireAppModule("angular/classes/id-attribute");

function SkKycRequirementsBoxDirective(
	$rootScope,
	$log,
	$window,
	SelfkeyService,
	ConfigFileService,
	CommonService
) {
	"ngInject";

	return {
		restrict: "E",
		scope: {
			kycInfo: "="
		},
		link: (scope, element) => {
			loadRequirements();

			/**
			 * get kyc requirements
			 */
			function loadRequirements() {
				const COLUMNS = 2;

				scope.requirementsListPromise = SelfkeyService.retrieveKycTemplate(
					scope.kycInfo.apiEndpoint,
					scope.kycInfo.organisation,
					scope.kycInfo.template
				);

				scope.requirementsListPromise
					.then(data => {
						$log.info("requirementsListPromise data:", data);

						let requirementsList = [];
						let requirements = data.requirements;

						let questions = requirements.questions;
						let uploads = requirements.uploads;

						// Temporary - name is one of default id attribute that is missing in template
						let idAttributeType = ConfigFileService.getIdAttributeType("name");
						requirementsList.push({
							key: "name",
							idAttributeType: idAttributeType,
							req: null
						});

						for (let i in questions) {
							let req = questions[i];

							if (!req.attributeType) continue;

							let idAttributeType = ConfigFileService.getIdAttributeType(
								req.attributeType
							);
							requirementsList.push({
								key: req.attributeType,
								idAttributeType: idAttributeType,
								req: req
							});
						}

						for (let i in uploads) {
							let req = uploads[i];

							if (!req.attributeType) continue;

							let idAttributeType = ConfigFileService.getIdAttributeType(
								req.attributeType
							);
							requirementsList.push({
								key: req.attributeType,
								idAttributeType: idAttributeType,
								req: req
							});
						}

						scope.sections = CommonService.chunkArray(requirementsList, COLUMNS);
					})
					.catch(error => {
						$log.error("requirementsListPromise data:", error);
					});
			}
		},
		replace: true,
		templateUrl: "common/directives/sk-kyc-requirements-box.html"
	};
}

module.exports = SkKycRequirementsBoxDirective;
