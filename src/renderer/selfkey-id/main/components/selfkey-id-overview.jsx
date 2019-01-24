import React from 'react';
import {
	Grid,
	CardHeader,
	Card,
	Avatar,
	CardContent,
	Table,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	TableHead,
	Typography,
	Button
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
// import { Link } from 'react-router-dom';

// const getRecord = (attributes, entryName) => {
// 	const entry = attributes.filter(entry => entry.name === entryName)[0];
// 	return entry ? entry.record : '';
// };

const hrStyle = {
	backgroundColor: '#303C49',
	border: 'none',
	boxSizing: 'border-box',
	height: '1px',
	margin: '5px 16px'
};

const infoStyle = {
	padding: '25px 30px'
};

const hexagonStyle = {
	border: '3px solid #313D49',
	height: '120px',
	width: '120px'
};

const SelfkeyIdOverview = ({ attributes, documents }) => (
	<Grid container direction="column" spacing={32}>
		<Grid item>
			<Grid container direction="row" spacing={32}>
				<Grid item xs={8}>
					<Card>
						<CardHeader
							avatar={
								<Avatar
									style={hexagonStyle}
									alt="Avatar Image"
									src="https://avatars0.githubusercontent.com/u/9919?s=280&v=4"
								/>
							}
							title="Shrimp and Chorizo Pael"
							subheader="Chorizo"
						/>
					</Card>
				</Grid>
				<Grid item xs={4}>
					<Card>
						<CardContent>
							<Typography variant="body2">
								You have not applied for any service in the marketplace yet.
							</Typography>
							<br />
							<Button variant="contained">Access Marketplace</Button>
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
						<hr style={hrStyle} />
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
										style={infoStyle}
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
												Basic Information about yourself. This can be edited
												at any time, but not deleted.
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
													<SmallTableCell variant="head" align="right">
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
																		{entry.name}
																	</Typography>
																</SmallTableCell>
																<SmallTableCell>
																	<Typography variant="subtitle1">
																		{entry.record}
																	</Typography>
																</SmallTableCell>
																<SmallTableCell>
																	<Typography variant="subtitle1">
																		{entry.lastEdited}
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
						<hr style={hrStyle} />
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
										style={infoStyle}
									>
										<Grid item>
											<BookIcon />
										</Grid>
										<Typography
											variant="subtitle2"
											color="secondary"
											gutterBottom
										>
											Basic Information about yourself. This can be edited at
											any time, but not deleted.
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
													<SmallTableCell variant="head" align="right">
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
																		{entry.name}
																	</Typography>
																</SmallTableCell>
																<SmallTableCell>
																	<Typography variant="subtitle1">
																		{entry.record}
																	</Typography>
																</SmallTableCell>
																<SmallTableCell>
																	<Typography variant="subtitle1">
																		{entry.lastEdited}
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

								<Grid container item spacing={0} justify="center">
									<Grid item>
										<Button variant="outlined" size="large" color="secondary">
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
						<hr style={hrStyle} />

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
														const fileName = entry.record;
														const fileType = fileName.substr(
															fileName.length - 3
														);
														return (
															<TableRow key={entry.id}>
																<TableCell>
																	<Typography variant="h6">
																		{entry.name}
																	</Typography>
																</TableCell>
																<TableCell>
																	<Grid container>
																		<Grid item xs={3}>
																			{fileType === 'pdf' ? (
																				<FilePdfIcon />
																			) : (
																				<FileImageIcon />
																			)}
																		</Grid>
																		<Grid item xs={6}>
																			<Typography variant="h6">
																				{entry.type
																					? entry.type
																					: ' '}
																			</Typography>
																			<Typography
																				variant="subtitle1"
																				color="secondary"
																			>
																				{entry.record}
																			</Typography>
																		</Grid>
																	</Grid>
																</TableCell>
																<TableCell>
																	<Typography
																		variant="h6"
																		color="error"
																	>
																		{entry.expiryDate}
																	</Typography>
																	<Typography
																		variant="subtitle2"
																		color="secondary"
																	>
																		Expired
																	</Typography>
																</TableCell>
																<TableCell>
																	<Typography variant="h6">
																		{entry.lastEdited}
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
										<Button variant="outlined" size="large" color="secondary">
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
);

export default SelfkeyIdOverview;
