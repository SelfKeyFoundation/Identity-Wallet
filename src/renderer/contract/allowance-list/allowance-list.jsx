import React from 'react';
import { withStyles } from '@material-ui/styles';

import {
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Typography,
	IconButton,
	Grid
} from '@material-ui/core';
import { SmallTableHeadRow, MuiEditIcon, MuiAddIcon } from 'selfkey-ui';
import { TokenSelector } from '../../tokens/token-selector';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	header: {
		textAlign: 'center',
		marginBottom: 30
	}
});

const ContactAllowanceListRow = withStyles(styles)(({ classes, allowance }) => (
	<TableRow className={classes.bodyTableRow}>
		<TableCell>
			<Typography variant="h6">{allowance.contractAddress}</Typography>
			{allowance.contractName && (
				<Typography variant="subtitle">({allowance.contractName})</Typography>
			)}
		</TableCell>
		<TableCell>
			<Typography variant="h6">{allowance.tokenAddress}</Typography>
			{allowance.tokenSymbol && (
				<Typography variant="subtitle">({allowance.tokenSymbol})</Typography>
			)}
		</TableCell>
		<TableCell numeric>{allowance.allowanceAmount}</TableCell>
		<TableCell>
			<IconButton aria-label="Edit">
				<MuiEditIcon />
			</IconButton>
		</TableCell>
	</TableRow>
));

export const ContractAllowanceList = withStyles(styles)(
	({ classes, allowances, tokens, selectedToken, onTokenChange, onAllowanceAdd }) => {
		return (
			<div className={classes.container}>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
					spacing={3}
				>
					<Grid item className={classes.header}>
						<Typography variant="h1">Manage Contract Allowance</Typography>
					</Grid>
					<Grid item>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={2}
						>
							<Grid item>
								<Typography variant="h5">Filter By Token</Typography>
							</Grid>
							<Grid xs>
								<TokenSelector
									tokens={tokens}
									selected={selectedToken}
									onTokenChange={onTokenChange}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Table>
							<TableHead>
								<SmallTableHeadRow>
									<TableCell>
										<Typography variant="overline">Contract</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Token</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Amount</Typography>
									</TableCell>
									<TableCell>
										<IconButton
											aria-label="Add"
											onClick={() => onAllowanceAdd(selectedToken)}
										>
											<MuiAddIcon />
										</IconButton>
									</TableCell>
								</SmallTableHeadRow>
							</TableHead>
							<TableBody>
								{allowances.map(a => (
									<ContactAllowanceListRow key={a.id} allowance={a} />
								))}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</div>
		);
	}
);

ContractAllowanceList.propTypes = {
	allowances: PropTypes.array,
	tokens: PropTypes.array,
	selectedToken: PropTypes.string
};

ContractAllowanceList.defaultProps = {
	allowances: [],
	tokens: [],
	selectedToken: null
};
