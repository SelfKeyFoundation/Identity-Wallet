import React from 'react';
import moment from 'moment';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableBody,
	IconButton,
	Button,
	withStyles
} from '@material-ui/core';
import {
	IdCardIcon,
	SmallTableHeadRow,
	SmallTableRow,
	SmallTableCell,
	EditTransparentIcon,
	DeleteIcon
} from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	cardAction: {
		padding: '20px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	attr: {
		margin: '0.5em',
		display: 'block',
		'& .label': {
			display: 'inline-block',
			minWidth: '12em'
		},
		'& h5': {
			display: 'inline-block'
		},
		'& svg': {
			marginRight: '0.5em',
			verticalAlign: 'middle'
		}
	}
});

const renderLastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

// const renderAttributeLabel = ({ name }) => name || 'No label provided';

const renderAttributeValue = ({ data }) => data.value || '';

const renderAttributeTitle = attr => attr.type.content.title || 'No title provided';

const CorporateInformation = withStyles(styles)(props => {
	const { classes, attributes = [], onEditAttribute, onDeleteAttribute, onAddAttribute } = props;
	return (
		<Card>
			<CardHeader title="Informations" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="stretch"
					spacing={24}
				>
					<Grid item>
						<Grid container spacing={0} justify="space-between">
							<Grid item xs={3}>
								<Grid
									container
									justify="flex-end"
									alignItems="center"
									direction="column"
									wrap="nowrap"
									spacing={24}
									className={classes.info}
								>
									<Grid item>
										<IdCardIcon />
									</Grid>
									<Grid item>
										<Typography variant="subtitle2" color="secondary">
											Information provided here will be used for the KYC
											processes in the Marketplace.
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={9}>
								<Table>
									<TableHead>
										<SmallTableHeadRow>
											<SmallTableCell variant="head">
												<Typography variant="overline">
													Information
												</Typography>
											</SmallTableCell>
											<SmallTableCell variant="head">
												<Typography variant="overline">Label</Typography>
											</SmallTableCell>
											<SmallTableCell variant="head">
												<Typography variant="overline">
													Last edited
												</Typography>
											</SmallTableCell>
											<SmallTableCell variant="head" align="right">
												<Typography variant="overline">Actions</Typography>
											</SmallTableCell>
										</SmallTableHeadRow>
									</TableHead>
									<TableBody>
										{attributes.map(attr => (
											<SmallTableRow key={attr.id}>
												<SmallTableCell className={classes.labelCell}>
													<Typography variant="subtitle1">
														{renderAttributeTitle(attr)}
													</Typography>
												</SmallTableCell>
												<SmallTableCell className={classes.labelCell}>
													<Typography variant="subtitle1">
														{renderAttributeValue(attr)}
													</Typography>
												</SmallTableCell>
												<SmallTableCell>
													<Typography variant="subtitle1">
														{renderLastUpdateDate(attr)}
													</Typography>
												</SmallTableCell>
												<SmallTableCell align="right">
													<IconButton
														id="editButton"
														onClick={() => onEditAttribute(attr)}
													>
														<EditTransparentIcon />
													</IconButton>
													<IconButton
														id="deleteButton"
														onClick={() => onDeleteAttribute(attr)}
													>
														<DeleteIcon />
													</IconButton>
												</SmallTableCell>
											</SmallTableRow>
										))}
									</TableBody>
								</Table>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Grid container spacing={0} justify="center">
							<Grid item>
								<Button
									id="addAttributes"
									variant="outlined"
									size="large"
									color="secondary"
									onClick={onAddAttribute}
									className={classes.button}
								>
									Add Information
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
});

export { CorporateInformation };
export default CorporateInformation;
