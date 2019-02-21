import React, { Component } from 'react';
import { Grid, Button, Typography, Card, CardContent, withStyles } from '@material-ui/core';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { walletTokensOperations } from 'common/wallet-tokens';
import { IdCardIcon, BookIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import history from 'common/store/history';

const styles = theme => ({
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
	},
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		marginLeft: '50px',
		marginRight: '50px'
	},
	create: {
		marginTop: '30px',
		marginBottom: '20px'
	}
});

class SelfKeyIdCreateComponent extends Component {
	state = {
		address: '',
		symbol: '',
		decimal: '',
		found: null
	};
	componentDidMount() {
		this.props.dispatch(tokensOperations.loadTokensOperation());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.tokens.length !== this.props.tokens.length) {
			if (this.state.address !== '') {
				this.findToken(this.state.address);
			}
		}
	}

	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
	};
	handleFieldChange = async event => {
		this.findToken(event.target.value);
	};

	findToken = async contractAddress => {
		let found = (this.props.tokens || []).find(
			t => (t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase()
		);
		if (!found) {
			await this.props.dispatch(tokensOperations.addTokenOperation(contractAddress));
			this.setState({
				symbol: '',
				decimal: '',
				found,
				address: contractAddress
			});
			return;
		}
		this.setState({ ...found, found });
	};
	handleSubmit = () => {
		const { found } = this.state;
		if (!found || !found.id) return;
		this.props.dispatch(walletTokensOperations.createWalletTokenOperation(found.id));
		this.handleBackClick();
	};
	render() {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<Button
					variant="outlined"
					color="secondary"
					size="small"
					onClick={this.handleBackClick}
					className={this.props.classes.back}
				>
					‹ Back
				</Button>
				<Grid item>
					<IdCardIcon />
				</Grid>
				<Grid item>
					<Typography variant="h1">Setup your Selfkey Identity</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1" color="secondary" gutterBottom>
						Create a new Selfkey ID to start building your identity profile.
					</Typography>
				</Grid>
				<Grid item>
					<Card>
						<CardContent>
							<Grid
								container
								direction="column"
								justify="center"
								alignItems="center"
								spacing={32}
							>
								<Grid container item spacing={0} justify="space-between">
									<Grid
										container
										xs={3}
										justify="end"
										alignItems="center"
										direction="column"
										wrap="nowrap"
										spacing={32}
										className={classes.info}
									>
										<Grid item>
											<BookIcon />
										</Grid>
									</Grid>
									<Grid item xs={9}>
										<Grid item>
											<Typography variant="body1" gutterBottom>
												I am creating a new Selfkey Identity Profile
											</Typography>
											<Typography
												variant="subtitle2"
												color="secondary"
												gutterBottom
											>
												Setup the Selfkey ID. This will form the basis of{' '}
												your locally managed and stored identity profile.
											</Typography>
										</Grid>
										<Grid item>
											<Button
												variant="contained"
												size="large"
												className={classes.create}
												onClick={this.handleAddAttribute}
											>
												Create Selfkey ID
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</CardContent>
						{/* <hr className={classes.hr} />
						<CardContent>
							<Grid
								container
								direction="column"
								justify="center"
								alignItems="center"
								spacing={32}
							>
								<Grid container item spacing={0} justify="space-between">
									<Grid
										container
										xs={3}
										justify="end"
										alignItems="center"
										direction="column"
										wrap="nowrap"
										spacing={32}
										className={classes.info}
									>
										<Grid item>
											<BookIcon />
										</Grid>
									</Grid>
									<Grid item xs={9}>
										<Grid item>
											<Typography variant="body1" gutterBottom>
												I was approved in the Selfkey token sale KYC
											</Typography>
											<Typography
												variant="subtitle2"
												color="secondary"
												gutterBottom
											>
												If you were whitelisted for the Selfkey token sale,{' '}
												you can download a zip file and import to complete{' '}
												your Selfkey ID.
											</Typography>
										</Grid>
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												className={classes.create}
												onClick={this.handleAddAttribute}
											>
												Import KYC File
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</CardContent> */}
					</Card>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return { tokens: tokensSelectors.allTokens(state) };
};

export const SelfKeyIdCreate = connect(mapStateToProps)(
	withStyles(styles)(SelfKeyIdCreateComponent)
);

export default SelfKeyIdCreate;
