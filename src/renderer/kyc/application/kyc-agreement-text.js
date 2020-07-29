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
			I consent to share my information with {vendor}, for the purposes of {purpose} and that
			they may further share this information with partners and affiliates in accordance with
			their{' '}
			<a
				className={classes.link}
				onClick={e => {
					window.openExternal(e, privacyPolicy);
				}}
			>
				privacy policy
			</a>{' '}
			and{' '}
			<a
				className={classes.link}
				onClick={e => {
					window.openExternal(e, termsOfService);
				}}
			>
				terms and conditions
			</a>
			, and by clicking the box, hereby agree to.
		</Typography>
	)
);

export default KycAgreementText;
