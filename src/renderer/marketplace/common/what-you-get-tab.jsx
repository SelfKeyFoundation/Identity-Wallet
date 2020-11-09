import React from 'react';
import { withStyles } from '@material-ui/styles';
import { WhatYouGet } from './marketplace-what-you-get';
import { HowServiceWorks } from './marketplace-how-service-works';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: theme.spacing(4, 0, 0),
		color: '#FFFFFF',
		'& p': {
			marginBottom: theme.spacing(3),
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: theme.spacing(0),
			marginBottom: theme.spacing(1),
			marginTop: theme.spacing(0)
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: theme.spacing(3),
			marginBottom: theme.spacing(3)
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: theme.spacing(1)
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	}
});

const WhatYouGetTab = withStyles(styles)(
	({
		classes,
		initialDocsText,
		kycProcessText,
		getFinalDocsText,
		description,
		timeToForm,
		whatYouGet
	}) => (
		<div className={classes.tabContainer}>
			<WhatYouGet
				classes={classes}
				description={description}
				timeToForm={timeToForm}
				initialDocsText={initialDocsText}
				kycProcessText={kycProcessText}
				getFinalDocsText={getFinalDocsText}
				whatYouGet={whatYouGet}
			/>

			<HowServiceWorks
				classes={classes}
				initialDocsText={initialDocsText}
				kycProcessText={kycProcessText}
				getFinalDocsText={getFinalDocsText}
			/>
		</div>
	)
);

export { WhatYouGetTab };
export default WhatYouGetTab;
