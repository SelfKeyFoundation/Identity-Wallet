import React, { PureComponent } from 'react';
import { PageLoading } from '../../common';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { BackButton, LoanIcon } from 'selfkey-ui';
import { LoansCalculatorCard } from '../common/calculator-card';
import { LoansTabs } from './tabs';

const styles = theme => ({
	pageContent: {
		margin: '0 auto',
		width: '1080px'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	header: {
		alignItems: 'center',
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		justifyContent: 'flex-start',
		marginBottom: theme.spacing(5),
		marginTop: theme.spacing(9),
		paddingBottom: theme.spacing(4)
	},
	headerTitle: {
		paddingLeft: theme.spacing(2)
	},
	icon: {
		height: '36px',
		width: '36px'
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	},
	tabs: {
		marginBottom: theme.spacing(2),
		minHeight: '600px'
	}
});

class LoansListPageComponent extends PureComponent {
	state = {
		tab: 'lending'
	};

	onTabChange = tab => this.setState({ tab });

	render() {
		const {
			classes,
			loading,
			inventory,
			onDetailsClick,
			onBackClick,
			tokens,
			rates,
			cardHidden,
			onCloseCalculatorCardClick,
			fiatRates
		} = this.props;
		const { tab } = this.state;
		return (
			<Grid container>
				<Grid item className={classes.backButtonContainer}>
					<BackButton onclick={onBackClick} />
				</Grid>
				{loading && <PageLoading />}
				{!loading && (
					<Grid item>
						<Grid
							id="loans"
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							className={classes.pageContent}
						>
							<Grid item id="header" className={classes.header}>
								<LoanIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Loans
								</Typography>
							</Grid>

							{!cardHidden && (
								<Grid item>
									<LoansCalculatorCard
										onCalculatorClick={() => this.onTabChange('calculator')}
										onClose={onCloseCalculatorCardClick}
									/>
								</Grid>
							)}

							<Grid item className={classes.tabs}>
								<LoansTabs
									inventory={inventory}
									onTabChange={this.onTabChange}
									onDetailsClick={onDetailsClick}
									tokens={tokens}
									tab={tab}
									rates={rates}
									fiatRates={fiatRates}
								/>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
}

const styledComponent = withStyles(styles)(LoansListPageComponent);
export default styledComponent;
export { styledComponent as LoansListPage };
