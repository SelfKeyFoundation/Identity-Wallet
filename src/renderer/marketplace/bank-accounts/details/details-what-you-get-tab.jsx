import React from 'react';
import { withStyles } from '@material-ui/core';
import { WhatYouGet } from '../../common/marketplace-what-you-get';
import { HowServiceWorks } from '../../common/marketplace-how-service-works';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '2em 0 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	}
});

const BankingWhatYouGetTab = withStyles(styles)(
	({ classes, initialDocsText, kycProcessText, getFinalDocsText, description, timeToForm }) => (
		<div className={classes.tabContainer}>
			<WhatYouGet
				classes={classes}
				description={description}
				timeToForm={timeToForm}
				initialDocsText={initialDocsText}
				kycProcessText={kycProcessText}
				getFinalDocsText={getFinalDocsText}
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

export { BankingWhatYouGetTab };
export default BankingWhatYouGetTab;
