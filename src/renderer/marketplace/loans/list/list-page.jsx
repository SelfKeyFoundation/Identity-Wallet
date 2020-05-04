import React, { PureComponent } from 'react';
import { PageLoading } from '../../common';
import { Button, Typography, Grid, withStyles } from '@material-ui/core';
import { LoanIcon } from 'selfkey-ui';
import { LoansCalculatorCard } from '../common/calculator-card';
import { LoansTabs } from './tabs';

const styles = theme => ({
	pageContent: {
		width: '1080px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '30px',
		marginBottom: '40px',
		marginTop: '50px'
	},
	headerTitle: {
		paddingLeft: '21px'
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
		marginBottom: '15px'
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
			cardHidden,
			onCloseCalculatorCardClick
		} = this.props;
		const { tab } = this.state;

		let filteredInventory = inventory.filter(offer => offer.data.loanType.includes(tab));

		return (
			<Grid container>
				<Grid item>
					<div className={classes.backButtonContainer}>
						<Button
							id="backToMarketplace"
							variant="outlined"
							color="secondary"
							size="small"
							onClick={onBackClick}
						>
							<Typography
								variant="subtitle2"
								color="secondary"
								className={classes.bold}
							>
								‹ Back
							</Typography>
						</Button>
					</div>
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
									<LoansCalculatorCard onClose={onCloseCalculatorCardClick} />
								</Grid>
							)}

							<Grid item className={classes.tabs}>
								<LoansTabs
									inventory={filteredInventory}
									onTabChange={this.onTabChange}
									onDetailsClick={onDetailsClick}
									tokens={tokens}
									tab={tab}
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
