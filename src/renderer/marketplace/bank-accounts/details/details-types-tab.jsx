import React, { Component } from 'react';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { BankingAccountOption } from './account-option';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '2em 0',
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
		const { classes, region, banks = [], accountType } = this.props;
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
					<Grid item>
						<Typography variant="body2" color="secondary">
							We work with {banks.length} different banks in {region}. Each bank has
							different eligibility requirements, types of accounts available and
							onboarding processes. We invite you to carefully review each banks
							requirements and services to better understand if their banking services
							meet your needs:
						</Typography>
					</Grid>
					{banks.map((opt, idx) => (
						<Grid item key={idx}>
							<BankingAccountOption
								account={opt}
								accountType={accountType}
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
