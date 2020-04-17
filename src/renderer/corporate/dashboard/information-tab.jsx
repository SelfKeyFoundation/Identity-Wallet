import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CorporateInformation } from '../common/corporate-information';
import { CorporateDocuments } from '../common/corporate-documents';

const styles = theme => ({});

const CorporateInformationTab = withStyles(styles)(
	({
		classes,
		attributes,
		attributeOptions,
		onAddAttribute,
		onEditAttribute,
		onDeleteAttribute,
		documents,
		onAddDocument,
		onEditDocument,
		onDeleteDocument
	}) => (
		<Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={2}>
			<Grid item>
				<CorporateInformation
					attributes={attributes}
					attributeOptions={attributeOptions}
					onAddAttribute={onAddAttribute}
					onEditAttribute={onEditAttribute}
					onDeleteAttribute={onDeleteAttribute}
				/>
			</Grid>
			<Grid item>
				<CorporateDocuments
					documents={documents}
					attributeOptions={attributeOptions}
					onAddDocument={onAddDocument}
					onEditDocument={onEditDocument}
					onDeleteDocument={onDeleteDocument}
				/>
			</Grid>
		</Grid>
	)
);

export { CorporateInformationTab };
export default CorporateInformationTab;
