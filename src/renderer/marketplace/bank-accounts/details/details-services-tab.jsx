import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import { sanitize } from '../../common';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
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

class BankingServicesTabComponent extends PureComponent {
	async componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { classes, banks } = this.props;
		let services = banks[Object.keys(banks)[0]].onboarding;

		if (services) {
			services = services.replace(/\n/g, '<br>');
		}
		return (
			<div className={classes.tabContainer}>
				{services && (
					<div
						dangerouslySetInnerHTML={{
							__html: sanitize(services)
						}}
					/>
				)}
			</div>
		);
	}
}

export const BankingServicesTab = withStyles(styles)(BankingServicesTabComponent);

export default BankingServicesTab;
