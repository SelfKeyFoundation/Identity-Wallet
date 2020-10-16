import React from 'react';
import { Grid, CardHeader, Card, CardContent, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BookIcon, IdCardIcon } from 'selfkey-ui';
import { HexagonAvatar } from '../common/hexagon-avatar';
import backgroundImage from '../../../../static/assets/images/icons/icon-marketplace.png';
import { AttributesTable } from '../common/attributes-table';
import { DocumentsTable } from '../common/documents-table';
import { featureIsEnabled } from 'common/feature-flags';

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
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	button: {
		marginBottom: '16px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	}
});

const SelfkeyIdSubheading = ({ email, did }) => (
	<React.Fragment>
		<Typography variant="subtitle1">{email}</Typography>
		<br />
		{featureIsEnabled('did') && did && (
			<Typography variant="subtitle1" color="secondary">
				did:selfkey:{did}
			</Typography>
		)}
	</React.Fragment>
);

const IndividualOverviewTab = withStyles(styles)(
	({
		classes,
		profile,
		onMarketplaceClick,
		onAvatarClick,
		didComponent,
		onEditAttribute,
		onDeleteAttribute,
		onAddAttribute,
		onAddDocument
	}) => (
		<Grid id="viewOverview" container direction="column" spacing={4}>
			<Grid item>
				<Grid container direction="row" spacing={4}>
					<Grid item xs={9}>
						<Card>
							<CardHeader
								avatar={
									<HexagonAvatar
										src={profile.profilePicture}
										onClick={onAvatarClick}
									/>
								}
								title={`${profile.firstName} ${profile.middleName} ${
									profile.lastName
								}`}
								subheader={
									<SelfkeyIdSubheading
										email={profile.email}
										did={profile.identity.did}
									/>
								}
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
								<Button variant="contained" onClick={onMarketplaceClick}>
									Access Marketplace
								</Button>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={4}>
					{featureIsEnabled('did') && !profile.identity.did && (
						<Grid item>{didComponent}</Grid>
					)}
					<Grid item>
						<Card>
							<CardHeader title="Basic Information" className={classes.regularText} />
							<hr className={classes.hr} />
							<CardContent>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									spacing={3}
								>
									<Grid container item spacing={0} justify="space-between">
										<Grid
											container
											item
											xs={3}
											justify="flex-end"
											alignItems="center"
											direction="column"
											wrap="nowrap"
											spacing={3}
											className={classes.info}
										>
											<Grid item>
												<IdCardIcon />
											</Grid>

											<Grid item>
												<Typography variant="subtitle2" color="secondary">
													Basic Information about yourself. This can be
													edited at any time, but not deleted.
												</Typography>
											</Grid>
										</Grid>

										<Grid item xs={9}>
											<AttributesTable
												attributes={profile.basicAttributes}
												onEditAttribute={onEditAttribute}
												onDeleteAttribute={onDeleteAttribute}
											/>
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
									spacing={3}
								>
									<Grid container item spacing={0} justify="space-between">
										<Grid
											container
											item
											xs={3}
											justify="flex-end"
											alignItems="center"
											direction="column"
											wrap="nowrap"
											spacing={3}
											className={classes.info}
										>
											<Grid item>
												<BookIcon />
											</Grid>
											<Typography variant="subtitle2" color="secondary">
												Additional information. This will be used for the
												KYC processes in the marketplace.
											</Typography>
										</Grid>

										<Grid item xs={9}>
											<AttributesTable
												attributes={profile.attributes}
												onEditAttribute={onEditAttribute}
												onDeleteAttribute={onDeleteAttribute}
											/>
										</Grid>
									</Grid>

									<Grid container item spacing={0} justify="center">
										<Grid item>
											<Button
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
									spacing={3}
								>
									<Grid container item spacing={0} justify="center">
										<Grid item xs={12}>
											<DocumentsTable
												documents={profile.documents}
												onEditAttribute={onEditAttribute}
												onDeleteAttribute={onDeleteAttribute}
											/>
										</Grid>
									</Grid>
									<Grid container item spacing={0} justify="center">
										<Grid item>
											<Button
												id="addDocuments"
												variant="outlined"
												size="large"
												color="secondary"
												onClick={onAddDocument}
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
	)
);

export { IndividualOverviewTab };
export default IndividualOverviewTab;
