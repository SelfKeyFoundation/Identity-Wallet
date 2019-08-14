import React, { Component } from 'react';
import moment from 'moment';
import { push } from 'connected-react-router';
import { walletOperations } from 'common/wallet';
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
	FileMultipleIcon,
	BookIcon,
	IdCardIcon,
	SmallTableHeadRow,
	SmallTableRow,
	SmallTableCell,
	FileAudioIcon,
	DIDIcon
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
		whiteSpace: 'normal',
		wordBreak: 'break-all',
		'& > div': {
			alignItems: 'center'
		}
	},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	documentColumn: {
		display: 'flex',
		alignItems: 'center',
		'& .file-icon': {
			marginRight: '15px'
		}
	},
	button: {
		marginBottom: '16px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	ellipsis: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		maxWidth: '222px'
	},
	didButtons: {
		marginTop: '20px'
	},
	transaction: {
		alignItems: 'center',
		display: 'flex'
	},
	extraSpace: {
		marginRight: '4px'
	}
});

const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';
const SELFKEY_ID_PATH = '/main/selfkeyId';

class SelfkeyIdOverviewComponent extends Component {
	state = {
		popup: null
	};
	componentDidMount() {
		this.props.onRef(this);
	}
	componentWillUnmount() {
		this.props.onRef(undefined);
	}
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
	handleGetDid = _ => this.props.dispatch(walletOperations.startCreateDidFlow(SELFKEY_ID_PATH));
	handleEnterDid = _ =>
		this.props.dispatch(walletOperations.startAssociateDidFlow(SELFKEY_ID_PATH));
	renderLastUpdateDate({ updatedAt }) {
		return moment(updatedAt).format('DD MMM YYYY, hh:mm a');
	}
	renderAttributeName({ name }) {
		return name || 'No label provided';
	}
	renderDocumentName({ entry, classes }) {
		let fileType = null;
		let fileName = null;
		let FileIcon = FileDefaultIcon;

		if (entry.documents.length === 1) {
			fileName = entry.documents[0].name;
			fileType = entry.documents[0].mimeType;
			if (fileType) {
				if (fileType === 'application/pdf') FileIcon = FilePdfIcon;
				else if (fileType.startsWith('audio')) FileIcon = FileAudioIcon;
				else if (fileType.startsWith('image')) FileIcon = FileImageIcon;
			}
		} else if (entry.documents.length > 1) {
			fileName = `${entry.documents.length} files`;
			FileIcon = FileMultipleIcon;
		}

		return (
			<div className={classes.documentColumn}>
				<div className="file-icon">
					<FileIcon />
				</div>
				<div>
					<Typography variant="h6">{entry.name}</Typography>
					<Typography
						variant="subtitle1"
						color="secondary"
						className={classes.ellipsis}
						title={fileName}
					>
						{fileName}
					</Typography>
				</div>
			</div>
		);
	}

	renderExpiryDate(doc) {
		if (!doc || !doc.data || !doc.data.value || !doc.data.value.expires) return '-';
		return moment(doc.data.value.expires).format('DD MMM YYYY');
	}
	renderSubheading(email, did) {
		return (
			<>
				<Typography variant="subtitle1">{email}</Typography>
				<br />
				{did && (
					<Typography variant="subtitle1" color="secondary">
						did:selfkey:{did}
					</Typography>
				)}
			</>
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
			<Grid id="viewOverview" container direction="column" spacing={32}>
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
						<Grid item xs={9}>
							<Card>
								<CardHeader
									avatar={
										<HexagonAvatar
											src={profilePicture}
											onClick={this.handleAvatarClick}
										/>
									}
									title={`${firstName} ${middleName} ${lastName}`}
									subheader={this.renderSubheading(email, wallet.did)}
									className={classes.cardHeader}
								/>
							</Card>
						</Grid>
						<Grid item xs={3}>
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
						{!wallet.did && (
							<Grid item>
								<Card>
									<CardHeader
										title="Decentralised ID"
										className={classes.regularText}
									/>
									<hr className={classes.hr} />
									<CardContent>
										<Grid
											container
											direction="column"
											justify="center"
											alignItems="center"
											spacing={24}
										>
											<Grid
												container
												item
												spacing={0}
												justify="space-between"
											>
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
														<DIDIcon />
													</Grid>

													<Grid item>
														<Typography
															variant="subtitle2"
															color="secondary"
														>
															Register on the SelfKey Network to get
															your DID.
														</Typography>
													</Grid>
												</Grid>

												<Grid item xs={9}>
													<Typography variant="h5">
														Use a DID when accesing different services
														in the marketplace. Once created you’ll see
														it under your profile.
													</Typography>
													<br />
													<Typography
														variant="subtitle2"
														color="secondary"
													>
														Getting a DID requires an Ethereum
														transaction. This is a one time only
														transaction.
													</Typography>
													<Grid
														container
														spacing={16}
														className={classes.didButtons}
													>
														<Grid item className={classes.extraSpace}>
															<Button
																disabled={wallet.didPending}
																variant="contained"
																onClick={this.handleGetDid}
																size="large"
															>
																GET DID
															</Button>
														</Grid>
														<Grid item>
															<Button
																disabled={wallet.didPending}
																variant="outlined"
																onClick={this.handleEnterDid}
																size="large"
															>
																I HAVE ONE
															</Button>
														</Grid>
														{wallet.didPending && (
															<Grid
																item
																className={classes.transaction}
															>
																<Typography variant="h3">
																	Processing transaction..Please
																	wait
																</Typography>
															</Grid>
														)}
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						)}
						<Grid item>
							<Card>
								<CardHeader
									title="Basic Information"
									className={classes.regularText}
								/>
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
																	Type
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
																		<SmallTableCell
																			className={
																				classes.labelCell
																			}
																		>
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

								<CardHeader
									title="Additional Information"
									className={classes.regularText}
								/>
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
												<Typography variant="subtitle2" color="secondary">
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
																	Type
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
																		<SmallTableCell
																			className={
																				classes.labelCell
																			}
																		>
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
													className={classes.button}
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
								<CardHeader title="Documents" className={classes.regularText} />
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
																		<TableCell
																			className={
																				classes.labelCell
																			}
																		>
																			{this.renderDocumentName(
																				{
																					entry,
																					classes
																				}
																			)}
																		</TableCell>
																		<TableCell>
																			{' '}
																			{this.renderExpiryDate(
																				entry
																			)}{' '}
																		</TableCell>
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
													id="addDocuments"
													variant="outlined"
													size="large"
													color="secondary"
													onClick={this.handleAddDocument}
													className={classes.button}
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
