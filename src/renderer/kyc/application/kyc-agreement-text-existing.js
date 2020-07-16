import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = {
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	}
};

export const KycAgreementText = withStyles(styles)(
	({ classes, vendor, purpose, privacyPolicy, termsOfService }) => (
		<Typography variant="h3">
			I understand SelfKey Vault will pass this information for <b>{vendor}</b>, that will
			provide {purpose} services in Singapore at my request and will communicate with me at my
			submitted email address above.
		</Typography>
	)
);

export default KycAgreementText;
