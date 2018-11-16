import React from 'react';
import {
	Grid,
	Typography,
	Tabs,
	Tab,
	CardHeader,
	Card,
	Avatar,
	CardContent,
	Table,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	TableHead
} from '@material-ui/core';
import { GreenTickIcon, EditTransparentIcon, DeleteIcon, ViewIcon } from 'selfkey-ui';

const SelfkeyId = ({ attributeHistory, attributes, documents }) => (
	<Grid container direction="column" spacing={32}>
		<Grid item>
			<Typography variant="h5">SelfKey Identity Wallet</Typography>
		</Grid>
		<Grid item>
			<Tabs value={0}>
				<Tab label="Overview" />
				<Tab label="Companies" />
				<Tab label="Applications" />
			</Tabs>
		</Grid>
		<Grid item>
			<Grid container direction="row" spacing={32}>
				<Grid item>
					<Grid container direction="column" spacing={32}>
						<Grid item>
							<Card>
								<CardHeader title="ID Wallet History" />
								<CardContent>
									<Table>
										<TableBody>
											{attributeHistory &&
												attributeHistory.map(entry => {
													return (
														<TableRow key={entry.id}>
															<TableCell>{entry.timestamp}</TableCell>
															<TableCell>
																<GreenTickIcon />
																{entry.action}
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardHeader title="Your Attribtues" />
								<CardContent>
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
															<TableCell>{entry.record}</TableCell>
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
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardHeader title="Your ID Documents" />
								<CardContent>
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
															<TableCell>{entry.record}</TableCell>
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
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Card>
						<CardHeader>
							<Avatar />
						</CardHeader>
						<CardContent>Hey</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
);

export default SelfkeyId;
