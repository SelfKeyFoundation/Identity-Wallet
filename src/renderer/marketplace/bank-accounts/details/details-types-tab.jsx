import React, { PureComponent } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BankingAccountOption } from '../common/account-option';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	tabContainer: {
		alignItems: 'strech',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		padding: theme.spacing(4, 0),
		width: '100%',
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
		}
	},
	text: {
		padding: theme.spacing(0, 0, 4)
	},
	bankingAccountOption: {
		marginBottom: theme.spacing(4)
	}
});

class BankingTypesTabComponent extends PureComponent {
	state = { option: null };

	async componentDidMount() {
		window.scrollTo(0, 0);
	}

	toggleOption = optionIdx => expanded => {
		const { option } = this.state;
		if (!expanded) {
			return this.setState({ option: null });
		}
		if (option !== optionIdx) {
			return this.setState({ option: optionIdx });
		}
	};
	render() {
		const { classes, region, banks = [], jurisdiction } = this.props;
		const { option } = this.state;
		return (
			<div className={classes.tabContainer}>
				<div className={classes.text}>
					<Typography variant="body1" color="secondary">
						We work with {Object.keys(banks).length} different banks in {region}. Each
						bank has different eligibility requirements, types of accounts available and
						onboarding processes. We invite you to carefully review each banks
						requirements and services to better understand if their banking services
						meet your needs:
					</Typography>
				</div>
				{Object.keys(banks).map((opt, idx) => (
					<div item key={idx} className={classes.bankingAccountOption}>
						<BankingAccountOption
							account={banks[opt]}
							jurisdiction={jurisdiction}
							title={`Option ${idx + 1}`}
							isOpen={option === idx}
							toggleOpen={this.toggleOption(idx)}
						/>
					</div>
				))}
			</div>
		);
	}
}

export const BankingTypesTab = withStyles(styles)(BankingTypesTabComponent);

export default BankingTypesTab;
