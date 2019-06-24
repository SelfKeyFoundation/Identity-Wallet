import React from 'react';
import { IncorporationOffersTable } from './offers-table';
import { Grid, withStyles } from '@material-ui/core';
import OffersPageLayout from '../../common/offers-page-layout';
const styles = theme => ({});

const IncorporationOffersPage = withStyles(styles)(
	({ classes, loading, data, keyRate, onDetails, onBackClick, getPrice, getTemplateID }) => {
		return (
			<OffersPageLayout
				title="Incorporation Marketplace"
				loading={loading}
				onBackClick={onBackClick}
			>
				<Grid item>
					<IncorporationOffersTable
						keyRate={keyRate}
						data={data}
						onDetails={onDetails}
						getPrice={getPrice}
						getTemplateID={getTemplateID}
					/>
				</Grid>
			</OffersPageLayout>
		);
	}
);

export default IncorporationOffersPage;
export { IncorporationOffersPage };
