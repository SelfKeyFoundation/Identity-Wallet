import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../../common';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: theme.spacing(4, 0),
		color: '#FFFFFF',
		'& p': {
			marginBottom: theme.spacing(3)
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
			color: primary
		},
		'& div': {
			lineHeight: '24px'
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
