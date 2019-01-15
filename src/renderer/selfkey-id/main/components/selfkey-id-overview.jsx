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
import { GreenTickIcon, EditTransparentIcon, DeleteIcon, ViewIcon } from 'selfkey-ui';
import { Link } from 'react-router-dom';

const getRecord = (attributes, entryName) => {
	const entry = attributes.filter(entry => entry.name === entryName)[0];
	return entry ? entry.record : '';
};

const SelfkeyIdOverview = ({ attributes, documents }) => (
	<Grid container direction="column" spacing={32}>
		<Grid item>
			<Grid container direction="row" spacing={32}>
				<Grid item xs={8}>
					<Card>
						<CardHeader
							avatar={<Avatar>R</Avatar>}
							title={getRecord(attributes, 'First Name')}
							subheader={getRecord(attributes, 'Email')}
						/>
						<CardContent>
							<Typography variant="subtitle1">Basic Information</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>INFORMATION </TableCell>
										<TableCell>LABEL</TableCell>
										<TableCell>LAST EDITED</TableCell>
										<TableCell>ACTIONS</TableCell>
									</TableRow>
								</TableHead>
								<TableBody />
							</Table>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={4}>
					<Card>
						<CardContent>
							<Typography variant="body1">
								You have not applied for any service in the marketplace yet.
							</Typography>
							<Button>Access Marketplace</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Grid>
		<Grid item>
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Card>
						<CardHeader title="Your Attribtues" />
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
												<TableRow>
													<TableCell>ATTRIBUTE</TableCell>
													<TableCell>RECORD</TableCell>
													<TableCell>LAST EDITED</TableCell>
													<TableCell>ACTIONS</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{attributes &&
													attributes.map(entry => {
														return (
															<TableRow key={entry.id}>
																<TableCell>
																	<GreenTickIcon />
																	{entry.name}
																</TableCell>
																<TableCell>
																	{entry.record}
																</TableCell>
																<TableCell>
																	{entry.lastEdited}
																</TableCell>
																<TableCell>
																	<Grid
																		container
																		direction="row"
																		justify="flex-start"
																		alignItems="center"
																	>
																		<Grid item>
																			<IconButton id="editButton">
																				<EditTransparentIcon />
																			</IconButton>
																		</Grid>
																		<Grid item>
																			<IconButton id="deleteButton">
																				<DeleteIcon />
																			</IconButton>
																		</Grid>
																	</Grid>
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
										<Button>
											<Link to="/attributes">Add Information</Link>
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
				<Grid item>
					<Card>
						<CardHeader title="Your ID Documents" />
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
												<TableRow>
													<TableCell>TYPE</TableCell>
													<TableCell>FILENAME</TableCell>
													<TableCell>LAST EDITED</TableCell>
													<TableCell>ACTIONS</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{documents &&
													documents.map(entry => {
														return (
															<TableRow key={entry.id}>
																<TableCell>
																	<GreenTickIcon />
																	{entry.name}
																</TableCell>
																<TableCell>
																	{entry.record}
																</TableCell>
																<TableCell>
																	{entry.lastEdited}
																</TableCell>
																<TableCell>
																	<Grid
																		container
																		direction="row"
																		justify="flex-start"
																		alignItems="center"
																	>
																		<Grid item>
																			<IconButton id="viewButton">
																				<ViewIcon />
																			</IconButton>
																		</Grid>
																		<Grid item>
																			<IconButton id="editButton">
																				<EditTransparentIcon />
																			</IconButton>
																		</Grid>
																		<Grid item>
																			<IconButton id="deleteButton">
																				<DeleteIcon />
																			</IconButton>
																		</Grid>
																	</Grid>
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
										<Button>
											<Link to="/attributes">Add Documents</Link>
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
