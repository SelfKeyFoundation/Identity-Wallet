import React from 'react';
import moment from 'moment';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Table,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	TableHead,
	Typography,
	Button,
	withStyles
} from '@material-ui/core';
import {
	EditTransparentIcon,
	DeleteIcon,
	FilePdfIcon,
	FileImageIcon,
	BookIcon,
	IdCardIcon,
	SmallTableHeadRow,
	SmallTableRow,
	SmallTableCell
} from 'selfkey-ui';
import backgroundImage from '../../../../../static/assets/images/icons/icon-marketplace.png';

const avatarPlaceholder = 'http://placekitten.com/240/240';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	info: {
		padding: '25px 30px'
	},
	card: {
		backgroundColor: '#1E262E',
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: '90% 50%',
		backgroundRepeat: 'no-repeat'
	},
	hexagon: {
		cursor: 'pointer',
		height: '120px',
		margin: '0 4px 0 10px',
		overflow: 'hidden',
		transform: 'rotate(120deg)',
		visibility: 'hidden',
		width: '104px'
	},
	hexagonIn: {
		height: '100%',
		overflow: 'hidden',
		transform: 'rotate(-60deg)',
		width: '100%'
	},
	hexagonIn2: {
		backgroundPosition: '50%',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		height: '100%',
		transform: 'rotate(-60deg)',
		visibility: 'visible',
		width: '100%'
	}
});

export const HexagonAvatar = withStyles(styles)(({ classes, src = avatarPlaceholder }) => (
	<div className={classes.hexagon}>
		<div className={classes.hexagonIn}>
			<div className={classes.hexagonIn2} style={{ backgroundImage: `url(${src})` }} />
		</div>
	</div>
));

const renderAttributeName = ({ data, name, type }) => {
	if (!data.value || typeof data.value === 'object') {
		return name;
	}

	if (!type.content) {
		return data.value;
	}

	if (type.content.format === 'date') {
		return moment(Math.min(+data.value, 0)).format('DD MMM YYYY');
	}

	return data.value;
};

const renderLastUpdateDate = ({ updatedAt }) => moment(updatedAt).format('DD MMM YYYY, hh:mm a');

const renderDocumentName = doc => {
	let fileType = null;
	let fileName = null;

	if (typeof doc.data.value === 'string' && doc.documents.length === 1) {
		fileName = doc.documents[0].name;
		fileType = doc.documents[0].mimeType;
	}
	return (
		<Grid container>
			{fileType && (
				<Grid item xs={3}>
					{fileType === 'application/pdf' ? <FilePdfIcon /> : <FileImageIcon />}
				</Grid>
			)}
			<Grid item xs={6}>
				<Typography variant="h6">{doc.name}</Typography>
				{fileName && (
					<Typography variant="subtitle1" color="secondary">
						{fileName}
					</Typography>
				)}
			</Grid>
		</Grid>
	);
};

export const SelfkeyIdOverview = withStyles(styles)(
	({
		classes,
		attributes,
		basicAttributes,
		documents,
		profilePicture,
		email,
		firstName,
		lastName,
		middleName
	}) => (
		<Grid container direction="column" spacing={32}>
			<Grid item>
				<Grid container direction="row" spacing={32}>
					<Grid item xs={8}>
						<Card>
							<CardHeader
								avatar={<HexagonAvatar src={profilePicture} />}
								title={`${firstName} ${middleName} ${lastName}`}
								subheader={email}
							/>
						</Card>
					</Grid>
					<Grid item xs={4}>
						<Card className={classes.card}>
							<CardContent>
								<Typography variant="body2">
									{/* You have not applied for any service in the marketplace yet. */}
									Selfkey Marketplace is coming soon...
								</Typography>
								<br />
								<Button variant="contained" disabled>
									Access Marketplace
								</Button>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>

			<Grid item>
				<Grid container direction="column" spacing={32}>
					<Grid item>
						<Card>
							<CardHeader title="Basic Information" />
							<hr className={classes.hr} />
							<CardContent>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									spacing={24}
								>
									<Grid container item spacing={0} justify="space-between">
										<Grid
											container
											xs={3}
											justify="end"
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
												<Typography
													variant="subtitle2"
													color="secondary"
													gutterBottom
												>
													Basic Information about yourself. This can be
													edited at any time, but not deleted.
												</Typography>
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
															<Typography variant="overline">
																Label
															</Typography>
														</SmallTableCell>
														<SmallTableCell variant="head">
															<Typography variant="overline">
																Last edited
															</Typography>
														</SmallTableCell>
														<SmallTableCell
															variant="head"
															align="right"
														>
															<Typography variant="overline">
																Actions
															</Typography>
														</SmallTableCell>
													</SmallTableHeadRow>
												</TableHead>
												<TableBody>
													{basicAttributes &&
														basicAttributes.map(entry => {
															return (
																<SmallTableRow key={entry.id}>
																	<SmallTableCell>
																		<Typography variant="subtitle1">
																			{
																				entry.type.content
																					.title
																			}
																		</Typography>
																	</SmallTableCell>
																	<SmallTableCell>
																		<Typography variant="subtitle1">
																			{renderAttributeName(
																				entry
																			)}
																		</Typography>
																	</SmallTableCell>
																	<SmallTableCell>
																		<Typography variant="subtitle1">
																			{renderLastUpdateDate(
																				entry
																			)}
																		</Typography>
																	</SmallTableCell>
																	<SmallTableCell align="right">
																		<IconButton id="editButton">
																			<EditTransparentIcon />
																		</IconButton>
																	</SmallTableCell>
																</SmallTableRow>
															);
														})}
												</TableBody>
											</Table>
										</Grid>
									</Grid>
								</Grid>
							</CardContent>

							<CardHeader title="Additional Information" />
							<hr className={classes.hr} />
							<CardContent>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									spacing={24}
								>
									<Grid container item spacing={0} justify="space-between">
										<Grid
											container
											xs={3}
											justify="end"
											alignItems="center"
											direction="column"
											wrap="nowrap"
											spacing={24}
											className={classes.info}
										>
											<Grid item>
												<BookIcon />
											</Grid>
											<Typography
												variant="subtitle2"
												color="secondary"
												gutterBottom
											>
												Additional information. This will be used for the
												KYC processes in the marketplace.
											</Typography>
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
															<Typography variant="overline">
																Label
															</Typography>
														</SmallTableCell>
														<SmallTableCell variant="head">
															<Typography variant="overline">
																Last edited
															</Typography>
														</SmallTableCell>
														<SmallTableCell
															variant="head"
															align="right"
														>
															<Typography variant="overline">
																Actions
															</Typography>
														</SmallTableCell>
													</SmallTableHeadRow>
												</TableHead>
												<TableBody>
													{attributes &&
														attributes.map(entry => {
															return (
																<SmallTableRow key={entry.id}>
																	<SmallTableCell>
																		<Typography variant="subtitle1">
																			{
																				entry.type.content
																					.title
																			}
																		</Typography>
																	</SmallTableCell>
																	<SmallTableCell>
																		<Typography variant="subtitle1">
																			{renderAttributeName(
																				entry
																			)}
																		</Typography>
																	</SmallTableCell>
																	<SmallTableCell>
																		<Typography variant="subtitle1">
																			{renderLastUpdateDate(
																				entry
																			)}
																		</Typography>
																	</SmallTableCell>
																	<SmallTableCell align="right">
																		<IconButton id="editButton">
																			<EditTransparentIcon />
																		</IconButton>
																		<IconButton id="deleteButton">
																			<DeleteIcon />
																		</IconButton>
																	</SmallTableCell>
																</SmallTableRow>
															);
														})}
												</TableBody>
											</Table>
										</Grid>
									</Grid>

									<Grid container item spacing={0} justify="center">
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												color="secondary"
											>
												Add Information
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
					<Grid item>
						<Card>
							<CardHeader title="Documents" />
							<hr className={classes.hr} />

							<CardContent>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									spacing={24}
								>
									<Grid container item spacing={0} justify="center">
										<Grid item xs={12}>
											<Table>
												<TableHead>
													<SmallTableHeadRow>
														<TableCell>
															<Typography variant="overline">
																Type
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="overline">
																Label
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="overline">
																Expiry Date
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="overline">
																Last Edited
															</Typography>
														</TableCell>
														<TableCell align="right">
															<Typography variant="overline">
																Actions
															</Typography>
														</TableCell>
													</SmallTableHeadRow>
												</TableHead>
												<TableBody>
													{documents &&
														documents.map(entry => {
															return (
																<TableRow key={entry.id}>
																	<TableCell>
																		<Typography variant="h6">
																			{
																				entry.type.content
																					.title
																			}
																		</Typography>
																	</TableCell>
																	<TableCell>
																		{renderDocumentName(entry)}
																	</TableCell>
																	<TableCell> - </TableCell>
																	<TableCell>
																		<Typography variant="h6">
																			{renderLastUpdateDate(
																				entry
																			)}
																		</Typography>
																	</TableCell>
																	<TableCell align="right">
																		<IconButton id="editButton">
																			<EditTransparentIcon />
																		</IconButton>
																		<IconButton id="deleteButton">
																			<DeleteIcon />
																		</IconButton>
																	</TableCell>
																</TableRow>
															);
														})}
												</TableBody>
											</Table>
										</Grid>
									</Grid>
									<Grid container item spacing={0} justify="center">
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												color="secondary"
											>
												Add Documents
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default SelfkeyIdOverview;
