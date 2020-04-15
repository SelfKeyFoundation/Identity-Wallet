import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { CorporateMembers } from '../common/corporate-members';

const styles = theme => ({});

const CorporateMembersTab = withStyles(styles)(props => (
	<Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={2}>
		<Grid item>
			<CorporateMembers {...props} />
		</Grid>
	</Grid>
));

export { CorporateMembersTab };
export default CorporateMembersTab;
