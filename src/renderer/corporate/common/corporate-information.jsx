import React from 'react';
import moment from 'moment';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableCell,
	TableHead,
	TableBody,
	IconButton,
	Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
	BookIcon,
	SmallTableHeadRow,
	SmallTableRow,
	EditTransparentIcon,
	DeleteIcon
} from 'selfkey-ui';

import { canEdit, canDelete } from './common-helpers.jsx';

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
	cardContent: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
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
	},
	informationLeft: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
		justifyContent: 'flex-end',
		paddingRight: '30px'
	},
	bookIcon: {
		margin: '30px 0 20px'
	},
	button: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: '30px'
	},
	noOverflow: {
		maxWidth: '320px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	}
});

const renderLastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

const renderAttributeLabel = ({ name }) => name || 'No label provided';

const renderAttributeValue = ({ data, type }) => {
	let valueToString = '';
	if (type.content.type === 'object') {
		for (const prop in data.value) {
			if (Object.prototype.hasOwnProperty.call(data.value, prop)) {
				valueToString += `${data.value[prop]} `;
			}
		}
	} else if (type.content.type === 'array') {
		valueToString = type.content.title;
	} else {
		valueToString = data.value || '';
	}
	return valueToString.trim();
};

const renderAttributeTitle = attr => attr.type.content.title || 'No title provided';

const CorporateInformation = withStyles(styles)(props => {
	const {
		classes,
		attributes = [],
		attributeOptions = {},
		onEditAttribute,
		onDeleteAttribute,
		onAddAttribute
	} = props;
	return (
		<Card>
			<CardHeader title="Information" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent className={classes.cardContent}>
				<div>
					<Grid container spacing={0} justify="space-between">
						<Grid item xs={3}>
							<div className={classes.informationLeft}>
								<BookIcon className={classes.bookIcon} />
								<Typography variant="subtitle2" color="secondary">
									Information provided here will be used for the KYC processes in
									the Marketplace.
								</Typography>
							</div>
						</Grid>
						<Grid item xs={9}>
							<Table>
								<TableHead>
									<SmallTableHeadRow>
										<TableCell variant="head">
											<Typography variant="overline">Information</Typography>
										</TableCell>
										<TableCell variant="head">
											<Typography variant="overline">Label</Typography>
										</TableCell>
										<TableCell variant="head">
											<Typography variant="overline">Last edited</Typography>
										</TableCell>
										<TableCell variant="head" align="right">
											<Typography variant="overline">Actions</Typography>
										</TableCell>
									</SmallTableHeadRow>
								</TableHead>
								<TableBody>
									{attributes.map(attr => (
										<SmallTableRow key={attr.id}>
											<TableCell>
												<Typography variant="subtitle1">
													{renderAttributeTitle(attr)}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													variant="subtitle1"
													className={classes.noOverflow}
													title={renderAttributeValue(attr)}
												>
													{renderAttributeLabel(attr)}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="subtitle1">
													{renderLastUpdateDate(attr)}
												</Typography>
											</TableCell>
											<TableCell align="right">
												{canEdit(attr.type, attributeOptions) && (
													<IconButton
														id="editButton"
														onClick={() => onEditAttribute(attr)}
													>
														<EditTransparentIcon />
													</IconButton>
												)}
												{canDelete(attr.type, attributeOptions) && (
													<IconButton
														id="deleteButton"
														onClick={() => onDeleteAttribute(attr)}
													>
														<DeleteIcon />
													</IconButton>
												)}
											</TableCell>
										</SmallTableRow>
									))}
								</TableBody>
							</Table>
						</Grid>
					</Grid>
				</div>
				<div className={classes.button}>
					<Button
						id="addAttributes"
						variant="outlined"
						size="large"
						color="secondary"
						onClick={onAddAttribute}
					>
						Add Information
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateInformation };
export default CorporateInformation;
