import React, { Component } from 'react';
import moment from 'moment';
import { push } from 'connected-react-router';
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
	FileDefaultIcon,
	BookIcon,
	IdCardIcon,
	SmallTableHeadRow,
	SmallTableRow,
	SmallTableCell
} from 'selfkey-ui';
import { CreateAttributePopup } from '../containers/create-attribute-popup';
import { EditAttributePopup } from '../containers/edit-attribute-popup';
import { DeleteAttributePopup } from '../containers/delete-attribute-popup';
import { EditAvatarPopup } from '../containers/edit-avatar-popup';
import { HexagonAvatar } from './hexagon-avatar';

import backgroundImage from '../../../../../static/assets/images/icons/icon-marketplace.png';

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
	labelCell: {
		whiteSpace: 'normal'
	}
});

const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';

class SelfkeyIdOverviewComponent extends Component {
	state = {
		popup: null
	};
	handleEditAttribute = attribute => {
		this.setState({ popup: 'edit-attribute', editAttribute: attribute });
	};
	handleAddAttribute = () => {
		this.setState({ popup: 'create-attribute', isDocument: false });
	};
	handleAddDocument = () => {
		this.setState({ popup: 'create-attribute', isDocument: true });
	};
	handleDeleteAttribute = attribute => {
		this.setState({ popup: 'delete-attribute', deleteAttribute: attribute });
	};
	handlePopupClose = () => {
		this.setState({ popup: null });
	};
	handleAvatarClick = () => {
		this.setState({ popup: 'edit-avatar' });
	};
	handleAccessClick = _ => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));
	renderLastUpdateDate({ updatedAt }) {
		return moment(updatedAt).format('DD MMM YYYY, hh:mm a');
	}
	renderAttributeName({ name }) {
		return name || 'No label provided';
	}
	renderDocumentName(doc) {
		let fileType = null;
		let fileName = null;
		let FileIcon = FileDefaultIcon;

		if (typeof doc.data.value === 'string' && doc.documents.length === 1) {
			fileName = doc.documents[0].name;
			fileType = doc.documents[0].mimeType;
		}

		if (fileType) {
			if (fileType === 'application/pdf') FileIcon = FilePdfIcon;
			else if (fileType.startsWith('image')) FileIcon = FileImageIcon;
		}

		return (
			<Grid container>
				<Grid item xs={3}>
					<FileIcon />
				</Grid>

				<Grid item xs={6}>
					<Typography variant="h6">{doc.name}</Typography>

					<Typography variant="subtitle1" color="secondary">
						{fileName || `${doc.documents.length} files`}
					</Typography>
				</Grid>
			</Grid>
		);
	}

	render() {
		const {
			classes,
			attributes,
			basicAttributes,
			documents,
			profilePicture,
			email,
			firstName,
			lastName,
			middleName,
			wallet
		} = this.props;
		const { popup } = this.state;

		return (
			<Grid container direction="column" spacing={32}>
				{popup === 'create-attribute' && (
					<CreateAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
					/>
				)}
				{popup === 'edit-attribute' && (
					<EditAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.editAttribute}
					/>
				)}
				{popup === 'delete-attribute' && (
					<DeleteAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.deleteAttribute}
					/>
				)}
				{popup === 'edit-avatar' && (
					<EditAvatarPopup
						open={true}
						onClose={this.handlePopupClose}
						avatar={profilePicture}
						walletId={wallet.id}
					/>
				)}
				<Grid item>
					<Grid container direction="row" spacing={32}>
						<Grid item xs={8}>
							<Card>
								<CardHeader
									avatar={<HexagonAvatar src={profilePicture} />}
									title={`${firstName} ${middleName} ${lastName}`}
									subheader={email}
									onClick={this.handleAvatarClick}
								/>
							</Card>
						</Grid>
						<Grid item xs={4}>
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="body2">
										Selfkey Marketplace is now launched and operational.
									</Typography>
									<br />
									<Button variant="contained" onClick={this.handleAccessClick}>
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
														Basic Information about yourself. This can
														be edited at any time, but not deleted.
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
																					entry.type
																						.content
																						.title
																				}
																			</Typography>
																		</SmallTableCell>
																		<SmallTableCell
																			className={
																				classes.labelCell
																			}
																		>
																			<Typography variant="subtitle1">
																				{this.renderAttributeName(
																					entry
																				)}
																			</Typography>
																		</SmallTableCell>
																		<SmallTableCell>
																			<Typography variant="subtitle1">
																				{this.renderLastUpdateDate(
																					entry
																				)}
																			</Typography>
																		</SmallTableCell>
																		<SmallTableCell align="right">
																			<IconButton id="editButton">
																				<EditTransparentIcon
																					onClick={() => {
																						this.handleEditAttribute(
																							entry
																						);
																					}}
																				/>
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
													Additional information. This will be used for
													the KYC processes in the marketplace.
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
																					entry.type
																						.content
																						.title
																				}
																			</Typography>
																		</SmallTableCell>
																		<SmallTableCell>
																			<Typography variant="subtitle1">
																				{this.renderAttributeName(
																					entry
																				)}
																			</Typography>
																		</SmallTableCell>
																		<SmallTableCell>
																			<Typography variant="subtitle1">
																				{this.renderLastUpdateDate(
																					entry
																				)}
																			</Typography>
																		</SmallTableCell>
																		<SmallTableCell align="right">
																			<IconButton id="editButton">
																				<EditTransparentIcon
																					onClick={() => {
																						this.handleEditAttribute(
																							entry
																						);
																					}}
																				/>
																			</IconButton>
																			<IconButton
																				id="deleteButton"
																				onClick={() => {
																					this.handleDeleteAttribute(
																						entry
																					);
																				}}
																			>
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
													onClick={this.handleAddAttribute}
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
																					entry.type
																						.content
																						.title
																				}
																			</Typography>
																		</TableCell>
																		<TableCell>
																			{this.renderDocumentName(
																				entry
																			)}
																		</TableCell>
																		<TableCell> - </TableCell>
																		<TableCell>
																			<Typography variant="h6">
																				{this.renderLastUpdateDate(
																					entry
																				)}
																			</Typography>
																		</TableCell>
																		<TableCell align="right">
																			<IconButton id="editButton">
																				<EditTransparentIcon
																					onClick={() => {
																						this.handleEditAttribute(
																							entry
																						);
																					}}
																				/>
																			</IconButton>
																			<IconButton
																				id="deleteButton"
																				onClick={() => {
																					this.handleDeleteAttribute(
																						entry
																					);
																				}}
																			>
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
													onClick={this.handleAddDocument}
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
		);
	}
}

export const SelfkeyIdOverview = withStyles(styles)(SelfkeyIdOverviewComponent);

export default SelfkeyIdOverview;
