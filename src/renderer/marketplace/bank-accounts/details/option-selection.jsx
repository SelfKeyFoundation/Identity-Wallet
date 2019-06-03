import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon } from 'selfkey-ui';
import { FlagCountryName } from '../../common';
import BankingAccountOption from './account-option';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	}
});
class OptionSelectionComponent extends Component {
	state = { selectedValue: '' };

	onSelectOption = event => {
		this.setState({ selectedValue: event.target.value });
	};

	render() {
		const {
			classes,
			title,
			description1,
			description2,
			options,
			countryCode,
			onBackClick,
			onStartClick
		} = this.props;

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						{title}
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Grid
						container
						justify="flex-start"
						alignItems="flex-start"
						direction="column"
						spacing={32}
					>
						<Grid item>
							<Typography variant="body2" gutterBottom>
								{description1}
							</Typography>
							<Typography variant="body2" gutterBottom>
								{description2}
							</Typography>
						</Grid>
						<Grid item>
							<Grid
								container
								direction="column"
								justify="flex-start"
								alignItems="stretch"
								spacing={40}
							>
								{options.map((opt, idx) => (
									<Grid item key={idx}>
										<BankingAccountOption
											account={opt}
											title={`Option ${idx + 1}`}
											onSelectOption={this.onSelectOption}
											selectedValue={this.state.selectedValue}
										/>
									</Grid>
								))}
							</Grid>
						</Grid>

						<Grid item>
							<Grid container direction="row" spacing={24}>
								<Grid item>
									<Button variant="contained" size="large" onClick={onStartClick}>
										Continue
									</Button>
								</Grid>
								<Grid item>
									<Button variant="outlined" size="large" onClick={onBackClick}>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

export const OptionSelection = withStyles(styles)(OptionSelectionComponent);

export default OptionSelection;
