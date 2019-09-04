import React, { Component } from 'react';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { BankingAccountOption } from '../common/account-option';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '30px 0',
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
	},
	gridPadding: {
		padding: '15px 20px !important'
	}
});

class BankingTypesTabComponent extends Component {
	state = { option: null };
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
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
					spacing={40}
				>
					<Grid item className={classes.gridPadding}>
						<Typography variant="body1" color="secondary">
							We work with {Object.keys(banks).length} different banks in {region}.
							Each bank has different eligibility requirements, types of accounts
							available and onboarding processes. We invite you to carefully review
							each banks requirements and services to better understand if their
							banking services meet your needs:
						</Typography>
					</Grid>
					{Object.keys(banks).map((opt, idx) => (
						<Grid item key={idx} className={classes.gridPadding}>
							<BankingAccountOption
								account={banks[opt]}
								jurisdiction={jurisdiction}
								title={`Option ${idx + 1}`}
								isOpen={option === idx}
								toggleOpen={this.toggleOption(idx)}
							/>
						</Grid>
					))}
				</Grid>
			</div>
		);
	}
}

export const BankingTypesTab = withStyles(styles)(BankingTypesTabComponent);

export default BankingTypesTab;
