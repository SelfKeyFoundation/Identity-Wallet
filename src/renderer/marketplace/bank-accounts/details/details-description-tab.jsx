import React, { PureComponent } from 'react';
import { Typography } from '@material-ui/core';
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
			padding: '0',
			marginBottom: theme.spacing(1),
			marginTop: theme.spacing(0)
		},
		'& ul': {
			lineHeight: '1.4em',
			listStyle: 'outside',
			marginBottom: theme.spacing(3),
			marginLeft: theme.spacing(3)
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: theme.spacing(1)
		},
		'& a': {
			color: primary
		}
	}
});

class BankingDescriptionTabComponent extends PureComponent {
	async componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { classes, jurisdiction } = this.props;
		return (
			<div className={classes.tabContainer}>
				<Typography
					variant="body1"
					color="secondary"
					dangerouslySetInnerHTML={{
						__html: sanitize(jurisdiction.data.introText)
					}}
				/>
			</div>
		);
	}
}

export const BankingDescriptionTab = withStyles(styles)(BankingDescriptionTabComponent);

export default BankingDescriptionTab;
